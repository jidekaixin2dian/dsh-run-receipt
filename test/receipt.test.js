import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { associate, auditFile, headingResults, occurrencePath, relativePath } from '../src/evidence.js'
import { workspaceFile } from '../src/files.js'
import { advanceWindow, createMonitor, observedMissing } from '../src/monitor.js'
import { ledgerAt } from '../src/store.js'

const at = '2026-11-18T22:00:00.000Z'
const base = Date.parse(at)
const iso = value => new Date(value).toISOString()
const sessionId = 's-1'
const messageId = 'm-1'
const taskId = 'plan-1'
const receipt = { scheduledAt: at, deliveredAt: iso(base + 100), messageId, targetSessionId: sessionId }
const scheduled = { type: 'user/message', seq: 2, data: { id: messageId, source: { kind: 'schedule' },
  content: [{ type: 'text', text: `[SCHEDULE REMINDER]\nThis is a scheduled message from the user\nschedule_id_json: "${taskId}"\noccurrence_at: ${at}\nreminder_prompt_json: "write report"` }] } }
const firstTurn = [
  { type: 'turn/start', seq: 1, data: { turn: 1 } }, scheduled,
  { type: 'turn/end', seq: 5, time: base + 500, data: { turn: 1, reason: { kind: 'completed' } } },
]
const row = { taskId, at, receipt }
const session = events => ({ session: { id: sessionId }, inheritedEventCount: 0, events })

test('receipt uses exact native occurrence and first turn, ignoring a later successful turn', () => {
  const failed = { ...firstTurn[2], data: { turn: 1, reason: { kind: 'error' } } }
  const result = associate(session([firstTurn[0], scheduled, failed,
    { type: 'turn/start', seq: 6, data: { turn: 2 } },
    { type: 'turn/end', seq: 8, data: { turn: 2, reason: { kind: 'completed' } } }]), row)
  assert.equal(result.status, 'failed')
  assert.equal(result.messageSeq, 2)
  assert.equal(result.endSeq, 5)
  assert.equal(associate(session(firstTurn), { ...row, at: iso(base + 1000) }).reason, 'ambiguous')
})

test('a shared batch, duplicate acceptance, and missing input cannot pass', () => {
  const batch = { ...scheduled, data: { ...scheduled.data, content: [{ type: 'text', text: '[SCHEDULE REMINDER BATCH]' }] } }
  assert.equal(associate(session([firstTurn[0], batch, firstTurn[2]]), row).reason, 'ambiguous')
  assert.equal(associate(session([firstTurn[0], scheduled, { ...scheduled, seq: 3 }, firstTurn[2]]), row).reason, 'ambiguous')
  assert.equal(associate(session([firstTurn[0], firstTurn[2]]), row).reason, 'noAcceptance')
})

test('date tokens use the plan’s local date and paths stay relative', () => {
  assert.equal(occurrencePath({ path: 'reports/{date}.md' }, at, 'Asia/Hong_Kong'), 'reports/2026-11-19.md')
  assert.equal(relativePath('reports\\{date}.md'), 'reports/{date}.md')
  for (const invalid of ['../secret.md', 'C:/secret', '/etc/passwd', '//server/share', './a', 'a//b', '~user/key', 'docs/a:stream', 'bad/{id}', 'aux.txt', 'logs/COM1.txt']) {
    assert.equal(relativePath(invalid), null, invalid)
  }
})

test('report headings honor Markdown structure', () => {
  const report = ['# **Highlights**', '', 'Summary', '-------', '', '```md', '# Hidden', '```', '', '> # Quote'].join('\n')
  assert.deepEqual(headingResults(report, ['Highlights', 'Summary', 'Hidden', 'Quote']).map(x => x.pass), [true, true, false, false])
})

test('a version changed by another task cannot borrow this turn’s write evidence', () => {
  const baseline = { version: 'old', absolutePath: '/a/report.md' }
  const file = { state: 'present', version: 'new', absolutePath: baseline.absolutePath, markdown: '## Highlights' }
  const write = { path: file.absolutePath, version: 'our-version' }
  assert.equal(auditFile({ file, baseline, write, headings: ['Highlights'] }).reason, 'changedAfterWrite')
  assert.equal(auditFile({ file, baseline, headings: [] }).reason, 'unattributedChange')
  assert.equal(auditFile({ file: { ...file, version: 'old' }, baseline, headings: [] }).reason, 'stale')
  const certified = { ...write, version: 'new' }
  assert.equal(auditFile({ file, baseline, write: certified, headings: ['Highlights'] }).status, 'passed')
  assert.equal(auditFile({ file, baseline, write: certified, headings: ['Missing'] }).reason, 'headingsMissing')
})

test('workspace resolution rejects a symlink target outside the selected root before reading', async () => {
  const fs = {
    resolve: async value => ({ targetKey: value === 'alias/report.md' ? '/outside/report.md' : value }),
    processPath: target => target.targetKey,
    contains: () => false,
    lstat: () => assert.fail('outside path was probed'),
  }
  assert.equal((await workspaceFile(fs, '/workspace', 'alias/report.md')).state, 'outsideWorkspace')
})

test('a missed observation needs continuous sampling and authoritative history coverage', () => {
  const task = { at, status: 'active', zone: 'UTC', updatedAt: iso(base - 1000) }
  const revision = { from: iso(base - 30_000) }
  let window = advanceWindow(null, task, revision, base - 20_000)
  for (const offset of [0, 30_000, 60_000, 90_000]) window = advanceWindow(window, task, revision, base + offset)
  assert.equal(observedMissing(window, { records: [] }, base + 90_000), true)
  assert.equal(observedMissing(window, { records: [], earlierRecordsUnavailable: true }, base + 90_000), false)
  assert.equal(observedMissing(window, { records: [receipt] }, base + 90_000), false)
  assert.equal(advanceWindow(window, { ...task, status: 'paused' }, revision, base + 92_000), undefined)
  assert.equal(advanceWindow(window, { ...task, updatedAt: at }, revision, base + 92_000), undefined)
  assert.equal(advanceWindow(window, task, revision, base + 140_000), undefined)
})

function host(ledger, properties, clock) {
  return createMonitor({
    fs: { resolve: () => assert.fail('no configured workspace rule') },
    sessionQuery: { readSession: async () => session(firstTurn) },
    schedule: {
      catalog: async () => [properties.plan],
      history: properties.history,
    },
  }, ledger, { now: () => clock.time })
}

function ledger() {
  return ledgerAt(join(mkdtempSync(join(tmpdir(), 'dsh-receipt-test-')), 'ledger.json'))
}

test('a delayed receipt keeps the recorded observation and manual read flag', async () => {
  const clock = { time: base - 20_000 }
  const records = []
  const db = ledger()
  const plan = { id: taskId, title: 'Morning', kind: 'rrule', rrule: 'DTSTART;TZID=Asia/Hong_Kong:20261119T060000\nRRULE:FREQ=DAILY',
    status: 'active', scheduledAt: at, updatedAt: iso(base - 60_000), target: { kind: 'new', create: {} } }
  const monitor = host(db, { plan, history: async () => ({ records }) }, clock)
  await monitor.setWatch({ id: taskId, on: true, path: '', headings: [] })
  assert.equal(monitor.view().plans[0].zone, 'Asia/Hong_Kong')
  assert.equal(monitor.view().plans[0].root, process.cwd())
  for (const offset of [0, 30_000, 60_000, 90_000]) {
    clock.time = base + offset
    await monitor.refresh()
  }
  const missed = monitor.view().rows[0]
  assert.equal(missed.expectation, 'missing')
  await monitor.mark({ key: missed.key, action: 'read' })
  records.push(receipt)
  await monitor.refresh()
  const [actual] = monitor.view().rows
  assert.equal(monitor.view().rows.length, 1)
  assert.equal(actual.execution.status, 'completed')
  assert.equal(actual.manual.readAt, iso(clock.time))
  assert.deepEqual(actual.observation, missed.observation)
  await monitor.stop()
})

test('a failed history page is replayed even when the newer page already exists', async () => {
  const clock = { time: base - 10_000 }
  const plan = { id: taskId, title: 'Morning', kind: 'daily', timeZone: 'UTC',
    status: 'active', scheduledAt: at, target: { kind: 'new', create: {} } }
  let pages = 0
  const recs = Array.from({ length: 31 }, (_, i) => ({
    scheduledAt: iso(base + 40_000 - i * 100), deliveredAt: iso(base + 40_100 - i * 100), messageId: `m-${i}`, targetSessionId: `s-${i}`,
  }))
  const history = async ({ before }) => {
    if (pages === 0) return { records: [] }
    if (!before) return { records: recs.slice(0, 30), nextBefore: recs[29].messageId }
    if (pages === 1) throw new Error('transient')
    return { records: recs.slice(30) }
  }
  const monitor = host(ledger(), { plan, history }, clock)
  await monitor.setWatch({ id: taskId, on: true, path: '', headings: [] })
  clock.time = base + 45_000
  pages = 1
  assert.equal((await monitor.refresh()).failure, 'historyUnavailable')
  pages = 2
  const recovered = await monitor.refresh()
  assert.equal(recovered.failure, null)
  assert.equal(recovered.rows.filter(row => row.receipt).length, 31)
  assert.equal((await monitor.refresh()).rows.filter(row => row.receipt).length, 31)
  await monitor.stop()
})

test('ledger round trips and preserves its original data when a later parse fails', () => {
  const file = join(mkdtempSync(join(tmpdir(), 'dsh-receipt-durable-')), 'ledger.json')
  const write = ledgerAt(file)
  write.save({ ...write.state, watches: { p: { on: true, revisions: [] } } })
  assert.deepEqual(ledgerAt(file).state, write.state)
  assert.equal(JSON.parse(readFileSync(file, 'utf8')).watches.p.on, true)
  writeFileSync(file, '{', 'utf8')
  assert.throws(() => ledgerAt(file), SyntaxError)
  assert.equal(readFileSync(file, 'utf8'), '{')
})
