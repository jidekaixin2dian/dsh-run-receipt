import { isAbsolute, relative, resolve } from 'node:path'
import { associate, auditFile, confirmedMutation, isMutation, occurrencePath, relativePath, reminder, validInstant } from './evidence.js'
import { workspaceFile } from './files.js'

export const SAMPLE_MS = 15_000
const MAX_GAP_MS = 45_000
const DELIVERY_GRACE_MS = 90_000
const HOUR_MS = 3_600_000
const historyLimit = 30
const historyPages = 10

const iso = value => new Date(value).toISOString()
const keyFor = (taskId, at, messageId = '') => JSON.stringify([taskId, at, messageId])
const time = value => Date.parse(value)
const since = watch => watch.revisions.at(-1).from
const currentRule = watch => watch?.revisions.at(-1)
const sameRoot = (a, b) => typeof a === 'string' && typeof b === 'string' && isAbsolute(a) && isAbsolute(b) && relative(a, b) === ''
const error = code => Object.assign(new Error(code), { publicCode: code })

export function advanceWindow(previous, task, revision, now) {
  if (task.status !== 'active' || !validInstant(task.at) || (task.floorAt && task.floorAt > task.at)) return undefined
  const signature = JSON.stringify([task.at, task.updatedAt, task.zone, task.root, revision.from])
  if (previous?.signature === signature && now >= previous.last && now - previous.last <= MAX_GAP_MS) {
    return { ...previous, last: now }
  }
  if (time(task.at) > now) return { signature, at: task.at, first: now, last: now }
}

export function observedMissing(window, page, now) {
  if (!window || now - time(window.at) < DELIVERY_GRACE_MS || page.records.some(record => record.scheduledAt === window.at)) return false
  const coversStart = page.records.some(record => time(record.deliveredAt) <= window.first)
  return coversStart || (!page.nextBefore && !page.earlierRecordsUnavailable && !page.earlierRecordsPruned)
}

export function createMonitor(ctx, ledger, { now = Date.now } = {}) {
  let catalog = []
  let failure = null
  let checkedAt = null
  let queue = Promise.resolve()
  let stopping = false
  let windows = new Map()
  const candidates = new Map()
  const observed = new WeakMap()
  const abort = new AbortController()

  function transact(fn) {
    const result = queue.then(() => {
      if (stopping) throw error('unavailable')
      return fn()
    })
    queue = result.catch(() => {})
    return result
  }

  function plan(entry) {
    const rruleZone = entry.kind === 'rrule' ? /^DTSTART;TZID=([^:]+):/u.exec(entry.rrule)?.[1] : undefined
    return { id: entry.id, title: entry.title, at: entry.scheduledAt, updatedAt: entry.updatedAt,
      status: entry.status, mode: entry.target.kind, zone: entry.timeZone ?? rruleZone ?? 'UTC', floorAt: entry.deliveryFloorEndsAt,
      root: entry.target.kind === 'new' ? (entry.target.create.cwd ?? process.cwd()) : null }
  }

  function ruleFor(task, watch, at) {
    const revision = watch.revisions.findLast(item => item.from <= at)
    if (!revision || !revision.on) return null
    return { ...revision, path: occurrencePath(revision, at, revision.zone) }
  }

  function view() {
    const state = ledger.state
    const pending = Array.from(windows, ([taskId, window]) => {
      const task = catalog.find(item => item.id === taskId)
      if (!task || !state.watches[taskId]?.on) return null
      const key = keyFor(taskId, window.at)
      if (state.rows[key] || Object.values(state.rows).some(row => row.taskId === taskId && row.at === window.at)) return null
      return { key, taskId, title: task.title, at: window.at, zone: task.zone, expectation: 'waiting',
        observation: { first: iso(window.first), last: iso(window.last) },
        rule: ruleFor(task, state.watches[taskId], window.at) }
    }).filter(Boolean)
    const rows = [...Object.values(state.rows), ...pending].sort((a, b) => b.at.localeCompare(a.at))
    return {
      failure, checkedAt, rows,
      plans: catalog.map(task => ({ ...task, watch: currentRule(state.watches[task.id]) ?? null })),
    }
  }

  async function sample({ refreshCatalog = false } = {}) {
    const state = ledger.state
    if (!refreshCatalog && !Object.values(state.watches).some(watch => watch.on)) return
    const sampledAt = now()
    let nextCatalog
    try {
      nextCatalog = (await ctx.schedule.catalog()).map(plan)
    } catch {
      windows.clear()
      failure = 'catalogUnavailable'
      return
    }
    abort.signal.throwIfAborted()
    catalog = nextCatalog
    const next = { ...state, rows: { ...state.rows }, cursors: { ...state.cursors } }
    const nextWindows = new Map()
    let degraded = false
    for (const task of catalog) {
      const watch = state.watches[task.id]
      if (!watch?.on) continue
      try {
        const page = await ctx.schedule.history({ id: task.id, limit: historyLimit })
        if (!Array.isArray(page.records)) throw error('historyUnavailable')
        const previous = windows.get(task.id)
        const extended = task.mode === 'new' ? advanceWindow(previous, task, currentRule(watch), sampledAt) : undefined
        const seen = previous?.at === task.at ? previous : extended
        let cursor = page
        const visited = new Set()
        for (let i = 0; i < historyPages; i += 1) {
          let checkpointSeen = false
          for (const record of cursor.records) {
            if (!validInstant(record.scheduledAt) || !validInstant(record.deliveredAt)
                || typeof record.messageId !== 'string' || typeof record.targetSessionId !== 'string') continue
            const key = keyFor(task.id, record.scheduledAt, record.messageId)
            if (state.cursors?.[task.id] === key) checkpointSeen = true
            if (next.rows[key]) continue
            const waitingKey = keyFor(task.id, record.scheduledAt)
            const expected = next.rows[waitingKey]
            const matchingWindow = previous?.at === record.scheduledAt ? previous : null
            const rule = expected?.rule ?? ruleFor(task, watch, record.scheduledAt)
            const { prompt, ...receipt } = record
            next.rows[key] = { key, taskId: task.id, at: record.scheduledAt, title: expected?.title ?? task.title,
              zone: expected?.zone ?? task.zone, mode: task.mode, receipt, rule,
              baseline: expected?.baseline ?? (matchingWindow?.baselineRule === rule?.from ? matchingWindow?.baseline : undefined),
              scopeChanged: Boolean(rule?.path && (!sameRoot(rule.root, task.root) || rule.zone !== task.zone)),
              ...(expected?.observation ? { observation: expected.observation } : {}),
              ...(expected?.manual ? { manual: expected.manual } : {}) }
            if (expected) delete next.rows[waitingKey]
          }
          if (checkpointSeen || !cursor.nextBefore || (i === 0 && cursor.records.at(-1)?.deliveredAt < watch.revisions[0].from)) {
            const newest = page.records[0]
            if (newest) next.cursors[task.id] = keyFor(task.id, newest.scheduledAt, newest.messageId)
            break
          }
          if (i === historyPages - 1 || visited.has(cursor.nextBefore)) { degraded = true; break }
          visited.add(cursor.nextBefore)
          cursor = await ctx.schedule.history({ id: task.id, limit: historyLimit, before: cursor.nextBefore })
          if (!Array.isArray(cursor.records)) throw error('historyUnavailable')
        }
        if (extended) {
          const revision = currentRule(watch)
          if (extended.first === sampledAt && sameRoot(revision.root, task.root) && revision.zone === task.zone && revision.path) {
            const path = occurrencePath(revision, task.at, revision.zone)
            const baseline = await workspaceFile(ctx.fs, revision.root, path, { signal: abort.signal })
            if (now() < time(task.at) && (baseline.state === 'present' || baseline.state === 'missing')) {
              extended.baseline = { ...baseline, checkedAt: iso(now()) }
              extended.baselineRule = revision.from
            }
          }
          if (!page.records.some(record => record.scheduledAt === task.at)) nextWindows.set(task.id, extended)
          if (observedMissing(extended, page, sampledAt)) {
            const key = keyFor(task.id, task.at)
            next.rows[key] ??= { key, taskId: task.id, at: task.at, title: task.title, zone: task.zone,
              mode: task.mode, expectation: 'missing', rule: ruleFor(task, watch, task.at),
              baseline: seen?.baseline, observation: { first: iso(extended.first), last: iso(extended.last) } }
          }
        }
      } catch {
        abort.signal.throwIfAborted()
        degraded = true
      }
    }
    const shared = new Map()
    for (const row of Object.values(next.rows)) {
      if (!row.receipt) continue
      const id = JSON.stringify([row.receipt.targetSessionId, row.receipt.messageId])
      shared.set(id, (shared.get(id) ?? 0) + 1)
    }
    const outstanding = Object.values(next.rows).filter(row => row.receipt && !row.final && next.watches[row.taskId]?.on)
      .sort((a, b) => (a.lastAttempt ?? 0) - (b.lastAttempt ?? 0) || b.at.localeCompare(a.at))
    for (const row of outstanding.slice(0, 20)) {
      const id = JSON.stringify([row.receipt.targetSessionId, row.receipt.messageId])
      const result = await inspect(row, shared.get(id) > 1, sampledAt)
      next.rows[row.key] = { ...row, ...result, lastAttempt: sampledAt }
    }
    abort.signal.throwIfAborted()
    // File observations arrive independently while the catalog and session reads are in flight.
    next.proofs = { ...ledger.state.proofs }
    for (const [key, proof] of Object.entries(next.proofs)) {
      if (next.rows[key]?.final || sampledAt - proof.capturedAt > 24 * HOUR_MS) delete next.proofs[key]
    }
    ledger.save(next)
    windows = nextWindows
    checkedAt = iso(sampledAt)
    failure = degraded ? 'historyUnavailable' : null
    for (const [id, candidate] of candidates) {
      if (sampledAt - candidate.startedAt > 24 * HOUR_MS) candidates.delete(id)
    }
  }

  async function inspect(row, shared, sampledAt) {
    if (shared) return { execution: { status: 'unknown', reason: 'ambiguous' }, final: true }
    if (row.mode !== 'new') return { execution: { status: 'unknown', reason: 'modeUnsupported' }, final: true }
    const old = sampledAt - time(row.receipt.deliveredAt) > 24 * HOUR_MS
    let snapshot
    try {
      snapshot = await ctx.sessionQuery.readSession(row.receipt.targetSessionId)
    } catch {
      return { execution: { ...row.execution, status: 'unknown', reason: 'sessionUnavailable' }, final: old }
    }
    const execution = associate(snapshot, row)
    if (!execution.endSeq) {
      const final = execution.reason === 'ambiguous' || old
      if (final && (execution.status === 'pending' || execution.status === 'running')) {
        return { execution: { ...execution, status: 'unknown', reason: execution.reason ?? 'noTerminal' }, final: true }
      }
      return { execution, final }
    }
    const rule = row.rule
    if (execution.status !== 'completed' || !rule?.path) return { execution, final: true }
    const checkedAt = iso(now())
    if (row.scopeChanged || !sameRoot(rule.root, snapshot.session.cwd) || !sameRoot(rule.root, currentRule(ledger.state.watches[row.taskId])?.root)
        || currentRule(ledger.state.watches[row.taskId])?.from !== rule.from) {
      return { execution, artifact: { status: 'unknown', reason: 'scopeChanged', checkedAt }, final: true }
    }
    const proof = ledger.state.proofs[row.key]
    const owned = proof?.revision === rule.from && proof.messageSeq === execution.messageSeq
      && proof.resultSeq > execution.messageSeq && proof.resultSeq < execution.endSeq
      && snapshot.events.some(event => event.type === 'tool/result' && event.seq === proof.resultSeq
        && event.data.turn === execution.turn && event.data.message?.toolCallId === proof.callId && confirmedMutation(event, proof))
    const file = await workspaceFile(ctx.fs, rule.root, rule.path, { signal: abort.signal })
    let fileForAudit = file
    if (rule.headings.length && owned && file.state === 'present' && file.version === proof.version && file.absolutePath === proof.path) {
      fileForAudit = await workspaceFile(ctx.fs, rule.root, rule.path, { text: true, signal: abort.signal })
    }
    const write = owned ? { path: proof.path, version: proof.version, resultSeq: proof.resultSeq, at: proof.at } : undefined
    const artifact = { ...auditFile({ file: fileForAudit, baseline: row.baseline, write, headings: rule.headings }), checkedAt }
    return { execution, artifact, final: true }
  }

  function onSessionEvent(session, event) {
    if (stopping) return
    if (event.type === 'user/message' && !candidates.has(session.id)) {
      const payload = reminder(event.data)
      if (!payload) return
      const task = catalog.find(item => item.id === payload.taskId && item.mode === 'new')
      const watch = task && ledger.state.watches[task.id]
      if (!watch?.on || since(watch) > payload.at || session.header.isSeeded) return
      const rule = ruleFor(task, watch, payload.at)
      if (!rule?.path || rule.zone !== task.zone || !sameRoot(rule.root, task.root) || !sameRoot(rule.root, session.header.cwd)) return
      candidates.set(session.id, { key: keyFor(task.id, payload.at, event.data.id),
        rule, taskId: task.id, startedAt: now(), messageSeq: event.seq, calls: new Map() })
      return
    }
    const candidate = candidates.get(session.id)
    if (!candidate) return
    if (event.type === 'turn/end') {
      candidates.delete(session.id)
      return true
    }
    if (event.type === 'tool/call' && isMutation(event.data.name) && event.data.turn === 1) {
      candidate.calls.set(event.data.callId, event.seq)
      return
    }
    if (event.type !== 'tool/result' || event.data.turn !== 1) return
    const callId = event.data.message?.toolCallId
    const call = candidate.calls.get(callId)
    const proof = observed.get(session)?.get(callId)
    candidate.calls.delete(callId)
    observed.get(session)?.delete(callId)
    if (!ledger.state.watches[candidate.taskId]?.on || currentRule(ledger.state.watches[candidate.taskId])?.from !== candidate.rule.from
        || call === undefined || call <= candidate.messageSeq || !event.sourceEventSeqs?.includes(call)
        || !confirmedMutation(event, proof)) return
    const state = ledger.state
    ledger.save({ ...state, proofs: { ...state.proofs, [candidate.key]: { ...proof, callId,
      revision: candidate.rule.from, messageSeq: candidate.messageSeq, resultSeq: event.seq, at: iso(event.time), capturedAt: now() } } })
  }

  function onObserved(target, observation, actor) {
    if (stopping || observation.kind !== 'present' || !isMutation(actor?.name)) return
    const session = actor.agent?.session
    const candidate = session && candidates.get(session.id)
    if (!candidate || !candidate.calls.has(actor.callId)) return
    const rule = currentRule(ledger.state.watches[candidate.taskId])
    if (!rule?.on || rule.from !== candidate.rule.from) return
    const path = ctx.fs.processPath(target)
    if (!sameRoot(path, resolve(candidate.rule.root, candidate.rule.path))) return
    let calls = observed.get(session)
    if (!calls) { calls = new Map(); observed.set(session, calls) }
    calls.set(actor.callId, { path, version: observation.version, name: actor.name })
  }

  function setWatch(payload) {
    return transact(async () => {
      if (typeof payload.id !== 'string' || typeof payload.on !== 'boolean') throw error('invalidPlan')
      const entries = (await ctx.schedule.catalog()).map(plan)
      abort.signal.throwIfAborted()
      const task = entries.find(entry => entry.id === payload.id)
      if (!task || (payload.on && task.mode !== 'new')) throw error('invalidPlan')
      if (typeof payload.path !== 'string' || !Array.isArray(payload.headings)) throw error('invalidRule')
      const path = payload.path.trim() ? relativePath(payload.path) : null
      const headings = [...new Set(payload.headings.map(heading => typeof heading === 'string' ? heading.trim() : ''))]
      if ((payload.path.trim() && !path) || headings.length > 12 || headings.some(heading => !heading || heading.length > 160)
          || (headings.length && !/\.(?:md|markdown)$/iu.test(path ?? ''))) throw error('invalidRule')
      if (payload.on && path && (!task.root || !isAbsolute(task.root))) throw error('outsideWorkspace')
      const state = ledger.state
      const before = state.watches[task.id]
      const desired = { on: payload.on, path, headings, root: task.root, zone: task.zone }
      const { from, ...previous } = currentRule(before) ?? {}
      if (JSON.stringify(previous) !== JSON.stringify(desired)) {
        const revision = { ...desired, from: iso(Math.max(now(), time(from) + 1 || 0)) }
        ledger.save({ ...state, watches: { ...state.watches, [task.id]: { on: payload.on, revisions: [...before?.revisions ?? [], revision] } } })
        windows.delete(task.id)
      }
      await sample({ refreshCatalog: true })
      return view()
    })
  }

  function mark(payload) {
    return transact(() => {
      const state = ledger.state
      const row = typeof payload.key === 'string' && Object.hasOwn(state.rows, payload.key) && state.rows[payload.key]
      if (!row || !['read', 'empty', 'unread'].includes(payload.action)
          || (payload.action === 'empty' && row.execution?.status !== 'completed')) throw error('invalidRun')
      const manual = { ...row.manual, readAt: payload.action === 'unread' ? null : iso(now()) }
      if (payload.action === 'empty') manual.emptyAt = iso(now())
      if (payload.action === 'unread') manual.emptyAt = null
      ledger.save({ ...state, rows: { ...state.rows, [row.key]: { ...row, manual } } })
      return view()
    })
  }

  function current(payload, signal) {
    return transact(async () => {
      const row = typeof payload.key === 'string' && Object.hasOwn(ledger.state.rows, payload.key) && ledger.state.rows[payload.key]
      if (!row?.rule?.path || !row.receipt || !row.execution?.turn) throw error('invalidRun')
      const snapshot = await ctx.sessionQuery.readSession(row.receipt.targetSessionId)
      if (!sameRoot(row.rule.root, snapshot.session.cwd)) return { state: 'scopeChanged' }
      return workspaceFile(ctx.fs, row.rule.root, row.rule.path, { signal: AbortSignal.any([signal, abort.signal]) })
    })
  }

  return {
    view, setWatch, mark, current, onSessionEvent, onObserved,
    refresh: options => transact(async () => { await sample(options); return view() }),
    stop() {
      stopping = true
      abort.abort()
      windows.clear()
      candidates.clear()
      return queue
    },
  }
}
