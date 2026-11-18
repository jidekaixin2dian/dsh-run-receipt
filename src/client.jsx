import { useEffect, useRef, useState } from 'react'
import { Button, IconArchiveCheckOutlineRegular } from '@deepseek-ai/dsh-client-ui-primitives'
import { en, zh } from './copy.js'

const id = 'run-receipt'
const ns = 'run-receipt'
const chunk = 30

async function request(payload, signal) {
  const response = await fetch('api/run-receipt', payload ? {
    method: 'POST', credentials: 'same-origin', signal,
    headers: { 'content-type': 'application/json', 'x-dsh-plugin': 'dsh-run-receipt' },
    body: JSON.stringify(payload),
  } : { signal, credentials: 'same-origin' })
  const data = await response.json().catch(() => null)
  if (!response.ok || !data) throw new Error(data?.error ?? (response.status === 403 ? 'denied' : 'unavailable'))
  return data
}

function dateTime(value, zone, locale) {
  if (value === null || value === undefined) return '—'
  return new Intl.DateTimeFormat(locale, { timeZone: zone, year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).format(new Date(value))
}

function preview(path, at, zone) {
  if (!path || !at) return path
  const parts = new Intl.DateTimeFormat('en', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(new Date(at))
  return path.replaceAll('{date}', ['year', 'month', 'day'].map(type => parts.find(part => part.type === type).value).join('-'))
}

function deliverStatus(row) {
  if (row.receipt) return 'delivered'
  return row.expectation === 'missing' ? 'missed' : 'waiting'
}

function reportStatus(row) {
  if (row.artifact) return row.artifact.status
  return row.rule?.path ? 'notChecked' : 'noRule'
}

function Pill({ label, status, t }) {
  return <span className="rr-pill" data-state={status} title={t(label)}>{t(status)}</span>
}

function RunRow({ row, selected, onSelect, t, locale }) {
  return <button className="rr-row" type="button" aria-current={selected ? 'true' : undefined}
    data-run-key={row.key} onClick={onSelect}>
    <span className="rr-row-title">
      {row.manual?.readAt ? null : <span className="rr-unread" aria-label={t('unread')} />}
      <strong>{row.title}</strong>
      <time dateTime={row.at}>{dateTime(row.at, row.zone, locale)}</time>
    </span>
    <span className="rr-states">
      <Pill label="delivery" status={deliverStatus(row)} t={t} />
      <Pill label="execution" status={row.execution?.status ?? (row.receipt ? 'pending' : 'notChecked')} t={t} />
      <Pill label="artifact" status={reportStatus(row)} t={t} />
      {row.manual?.emptyAt && <span className="rr-manual-tag">{t('emptyConfirm')}</span>}
    </span>
  </button>
}

function Field({ label, children, code = false }) {
  return <><dt>{label}</dt><dd>{code ? <code>{children}</code> : children}</dd></>
}

function Detail({ row, t, locale, actions, onClose }) {
  const [current, setCurrent] = useState(null)
  const [issue, setIssue] = useState('')
  const [checking, setChecking] = useState(false)
  const controller = useRef()
  const element = useRef()
  const { rule, artifact, execution, receipt, observation, manual } = row
  const canCheck = Boolean(rule?.path && receipt && execution?.turn && row.final && !row.scopeChanged)
  useEffect(() => () => controller.current?.abort(), [])
  useEffect(() => {
    if (element.current?.closest('.rr-panel')?.clientWidth <= 740) {
      element.current.scrollIntoView({ block: 'start' })
    }
  }, [])

  async function checkCurrent() {
    controller.current?.abort()
    const active = new AbortController()
    controller.current = active
    setChecking(true)
    setIssue('')
    try {
      const value = await request({ op: 'current', key: row.key }, active.signal)
      if (!active.signal.aborted) setCurrent(value)
    } catch (error) {
      if (!active.signal.aborted) setIssue(error.message)
    } finally {
      if (!active.signal.aborted) setChecking(false)
    }
  }

  async function open(path, action) {
    try { await actions.openFile(path, action) } catch { setIssue('openFailed') }
  }

  function openSession() {
    try { actions.openSession(receipt.targetSessionId) } catch { setIssue('openFailed') }
  }

  const dt = value => dateTime(value, row.zone, locale)
  return <section ref={element} className="rr-detail" aria-label={row.title}>
    <div className="rr-detail-head">
      <h2>{row.title}</h2>
      <Button size="sm" onClick={onClose}>{t('close')}</Button>
    </div>
    <section>
      <h3>{t('delivery')} <Pill label="delivery" status={deliverStatus(row)} t={t} /></h3>
      <dl>
        <Field label={t('timeZone')}>{row.zone}</Field>
        <Field label={t('scheduled')}>{dt(row.at)}</Field>
        <Field label={t('deliveredAt')}>{dt(receipt?.deliveredAt)}</Field>
        {receipt && <Field label={t('messageId')} code>{receipt.messageId}</Field>}
        {observation && !receipt && <>
          <Field label={t('observedFrom')}>{dt(observation.first)}</Field>
          <Field label={t('observedThrough')}>{dt(observation.last)}</Field>
        </>}
      </dl>
      {!receipt && <p>{t(row.expectation === 'missing' ? 'noReceiptBoundary' : 'waitingBoundary')}</p>}
    </section>
    {receipt && <section>
      <h3>{t('execution')} <Pill label="execution" status={execution?.status ?? 'pending'} t={t} /></h3>
      <dl>
        <Field label={t('sessionId')} code>{receipt.targetSessionId}</Field>
        <Field label={t('turn')}>{execution?.turn ?? '—'}</Field>
        {execution?.turn && <Field label={t('eventSeq')} code>{[execution.startSeq, execution.messageSeq, execution.endSeq].filter(Number.isInteger).join(' → ')}</Field>}
        <Field label={t('endedAt')}>{dt(execution?.endedAt)}</Field>
        {execution?.endSeq && <Field label={t('reason')} code>{execution.reason}</Field>}
      </dl>
      {execution?.reason && !execution.endSeq && <p>{t(execution.reason)}</p>}
      <Button size="sm" variant="outline" onClick={openSession}>{t('openSession')}</Button>
    </section>}
    {rule?.path && <section>
      <h3>{t('artifact')} <Pill label="artifact" status={reportStatus(row)} t={t} /></h3>
      <dl>
        <Field label={t('path')} code>{rule.path}</Field>
        {artifact?.checkedAt && <Field label={t('reviewedAt')}>{dt(artifact.checkedAt)}</Field>}
        {artifact?.baseline?.version && <Field label={t('beforeVersion')} code>{artifact.baseline.version}</Field>}
        {artifact?.version && <Field label={t('version')} code>{artifact.version}</Field>}
        {artifact?.write && <>
          <Field label={t('writeVersion')} code>{artifact.write.version}</Field>
          <Field label={t('writeEvent')} code>{artifact.write.resultSeq}</Field>
        </>}
        {current?.version && <Field label={t('currentVersion')} code>{current.version}</Field>}
      </dl>
      {artifact?.reason && <p>{t(artifact.reason)}</p>}
      {rule.headings.length > 0 && <>
        <h4>{t('headingRules')}</h4>
        <ul className="rr-checks">{rule.headings.map(heading => {
          const result = artifact?.checks?.find(item => item.heading === heading)
          return <li key={heading}><span>{heading}</span><span>{t(result ? result.pass ? 'rulePass' : 'ruleFail' : 'unavailableHeading')}</span></li>
        })}</ul>
      </>}
      {current && <p role="status">{t(current.state === 'present'
        ? (artifact?.version ? current.version === artifact.version && current.absolutePath === artifact.absolutePath
          ? 'sameVersion' : 'currentChanged' : 'unattributed') : current.state === 'missing' ? 'currentMissing' : current.state)}</p>}
      <div className="rr-actions">
        {canCheck && <Button size="sm" variant="outline" disabled={checking} onClick={checkCurrent}>{t('checkCurrent')}</Button>}
        {current?.state === 'present' && <>
          <Button size="sm" variant="outline" onClick={() => open(current.absolutePath, 'open')}>{t('openFile')}</Button>
          <Button size="sm" onClick={() => open(current.absolutePath, 'reveal')}>{t('revealFile')}</Button>
        </>}
      </div>
    </section>}
    {receipt || row.expectation === 'missing' ? <section>
      <h3>{t('manual')}</h3>
      {manual?.emptyAt && <p>{t('emptyConfirm')} · {dt(manual.emptyAt)}</p>}
      {manual?.readAt && <p>{t('read')} · {dt(manual.readAt)}</p>}
      <div className="rr-actions">
        <Button size="sm" variant="outline" disabled={actions.busy}
          onClick={() => actions.mark(row.key, manual?.readAt ? 'unread' : 'read')}>{t(manual?.readAt ? 'unreadAction' : 'readAction')}</Button>
        {execution?.status === 'completed' && !manual?.emptyAt && <Button size="sm" disabled={actions.busy}
          onClick={() => actions.mark(row.key, 'empty')}>{t('emptyAction')}</Button>}
      </div>
    </section> : null}
    {issue && <p className="rr-error" role="alert">{translateError(issue, t)}</p>}
  </section>
}

function RuleEditor({ task, t, save, close, busy }) {
  const [path, setPath] = useState(task.watch?.path ?? '')
  const [headings, setHeadings] = useState(task.watch?.headings?.join('\n') ?? '')
  const submit = event => {
    event.preventDefault()
    return save({ op: 'watch', id: task.id, on: true, path,
      headings: headings.split('\n').map(line => line.trim()).filter(Boolean) })
  }
  return <form className="rr-form" onSubmit={submit}>
    <div><span className="rr-secondary">{t('workspace')}</span> <code>{task.root ?? '—'}</code></div>
    <label>{t('path')}<input value={path} onChange={event => setPath(event.target.value)} placeholder={t('example')} maxLength={400} autoFocus /></label>
    <p>{t('ruleHelp')}</p>
    {path && <div><span className="rr-secondary">{t('preview')}</span> <code>{preview(path, task.at, task.zone)}</code> <span className="rr-secondary">({task.zone})</span></div>}
    <label>{t('headingInput')}<textarea value={headings} onChange={event => setHeadings(event.target.value)} rows={3} maxLength={1950} /></label>
    <div className="rr-actions">
      <Button type="submit" variant="primary" size="sm" disabled={busy}>{t('save')}</Button>
      <Button size="sm" onClick={close}>{t('cancel')}</Button>
    </div>
  </form>
}

function translateError(code, t) {
  return Object.hasOwn(en, code) ? t(code) : t('unavailable')
}

function Panel({ t, openSession, openFile }) {
  const [view, setView] = useState(null)
  const [tab, setTab] = useState('runs')
  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(null)
  const [onlyUnread, setOnlyUnread] = useState(false)
  const [page, setPage] = useState(0)
  const [issue, setIssue] = useState('')
  const [busy, setBusy] = useState(false)
  const owner = useRef()
  const sequence = useRef(0)
  const working = useRef(false)
  const locale = t('runs') === zh.runs ? 'zh-CN' : 'en'

  async function update(payload) {
    const signal = owner.current?.signal
    if (!signal || signal.aborted || working.current) return false
    const seq = ++sequence.current
    if (payload) {
      working.current = true
      setBusy(true)
      setIssue('')
    }
    try {
      const data = await request(payload, signal)
      if (!signal.aborted && seq === sequence.current) {
        setView(data)
        setIssue('')
        return true
      }
    } catch (error) {
      if (!signal.aborted && seq === sequence.current) setIssue(error.message)
    } finally {
      if (payload && !signal.aborted) {
        working.current = false
        setBusy(false)
      }
    }
    return false
  }

  useEffect(() => {
    const active = new AbortController()
    owner.current = active
    working.current = false
    void update({ op: 'refresh' })
    const timer = setInterval(() => {
      if (!document.hidden) void update()
    }, 5000)
    return () => { active.abort(); clearInterval(timer) }
  }, [])

  const rows = (view?.rows ?? []).filter(row => !onlyUnread || !row.manual?.readAt)
  const pageIndex = Math.min(page, Math.max(0, Math.ceil(rows.length / chunk) - 1))
  const matchingRuns = selected && !selected.receipt
    ? view?.rows.filter(row => row.receipt && row.taskId === selected.taskId && row.at === selected.at) ?? [] : []
  const selectedRow = view?.rows.find(row => row.key === selected?.key)
    ?? (matchingRuns.length === 1 ? matchingRuns[0] : null)
  const tracked = view?.plans.some(task => task.watch?.on)
  const save = async payload => {
    if (await update(payload)) setEditing(null)
  }
  return <main className="rr-panel" data-run-receipt="">
    <div className="rr-container">
      <header className="rr-header">
        <h1>{t('title')}</h1>
        <Button variant="outline" onClick={() => update({ op: 'refresh' })} disabled={busy}>{t('refresh')}</Button>
      </header>
      <nav className="rr-tabs" aria-label={t('title')}>
        {['runs', 'plans'].map(name => <button key={name} type="button" aria-current={tab === name ? 'page' : undefined}
          onClick={() => setTab(name)}>{t(name)}</button>)}
      </nav>
      {(issue || view?.failure) && <div className="rr-error" role="alert">{translateError(issue || view.failure, t)}</div>}
      {!view && !issue && <p role="status">{t('loading')}</p>}
      {view && (tab === 'plans' ? <div className="rr-plans">
        {view.plans.length === 0 && <p>{t('noPlans')}</p>}
        {view.plans.map(task => <section className="rr-plan" key={task.id} data-plan-id={task.id}>
          <div className="rr-plan-head">
            <div>
              <h2>{task.title}</h2>
              <p>{t(task.mode === 'new' ? 'supported' : task.mode)} · {t(task.status)}{task.watch?.on ? ' · ' + t('tracked') : ''}</p>
              {task.watch?.on && task.watch.path && <code>{preview(task.watch.path, task.at, task.watch.zone)}</code>}
            </div>
            <div className="rr-actions">
              {task.mode === 'new' && editing !== task.id && <Button size="sm" variant="outline" onClick={() => setEditing(task.id)}>{t(task.watch?.on ? 'change' : 'track')}</Button>}
              {task.watch?.on && editing !== task.id && <Button size="sm" disabled={busy} onClick={() => save({
                op: 'watch', id: task.id, on: false, path: task.watch.path ?? '', headings: task.watch.headings,
              })}>{t('stop')}</Button>}
            </div>
          </div>
          {task.watch?.on && (task.watch.zone !== task.zone || task.watch.root !== task.root)
            && <p className="rr-error">{t('compatibilityChanged')}</p>}
          {editing === task.id && <RuleEditor key={task.id} task={task} t={t} save={save} close={() => setEditing(null)} busy={busy} />}
        </section>)}
      </div> : <>
        <div className="rr-filter" aria-label={t('runs')}>
          {[false, true].map(filter => <Button key={String(filter)} size="sm" variant={filter === onlyUnread ? 'outline' : 'ghost'}
            aria-pressed={filter === onlyUnread} onClick={() => { setOnlyUnread(filter); setPage(0) }}>{t(filter ? 'unread' : 'all')}</Button>)}
        </div>
        <div className="rr-inbox" data-selected={Boolean(selectedRow)}>
          <div className="rr-list">
            {rows.length ? rows.slice(pageIndex * chunk, (pageIndex + 1) * chunk).map(row => <RunRow
              key={row.key} row={row} t={t} locale={locale} selected={selectedRow?.key === row.key} onSelect={() => setSelected(row)} />)
              : <p className="rr-empty">{t(onlyUnread ? 'noUnread' : tracked ? 'noRuns' : 'choosePlan')}</p>}
            {rows.length > chunk && <div className="rr-actions rr-pagination">
              <Button size="sm" disabled={!pageIndex} onClick={() => setPage(pageIndex - 1)}>{t('previous')}</Button>
              <Button size="sm" disabled={(pageIndex + 1) * chunk >= rows.length} onClick={() => setPage(pageIndex + 1)}>{t('next')}</Button>
            </div>}
          </div>
          {selectedRow && <Detail key={selectedRow.key} row={selectedRow} t={t} locale={locale}
            onClose={() => setSelected(null)} actions={{ busy, openSession, openFile, mark: (key, action) => update({ op: 'mark', key, action }) }} />}
        </div>
      </>)}
    </div>
  </main>
}

function NavIcon({ size }) {
  return <IconArchiveCheckOutlineRegular size={size} />
}

export const inject = ['slots', 'locale', 'uiWorkspace', 'remote', 'sessions', 'workspaces']

export function apply(ctx) {
  ctx.effect(() => ctx.locale.register(ns, { zh, en }))
  ctx.effect(() => {
    const style = document.createElement('style')
    style.textContent = process.env.RUN_RECEIPT_CSS
    document.head.append(style)
    return () => style.remove()
  })
  ctx.slots.inject('main', () => ctx.slots.register({
    name: 'main', key: id, locale: ns,
    inject: () => ({
      openSession: sessionId => {
        const sessions = ctx.sessions.list.getSnapshot()
        const workspace = ctx.workspaces.list.getSnapshot()
        if (!sessions.ids.includes(sessionId) || workspace.archivedSessionIds.includes(sessionId)) {
          throw new Error('openFailed')
        }
        ctx.uiWorkspace.openSession(sessionId)
      },
      openFile: async (path, action) => {
        const result = await ctx.remote.session.openWorkspacePath({ path, action })
        if (!result?.ok) throw new Error('openFailed')
      },
    }),
  }, Panel))
  ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
    name: 'sidebar.panellist', id, order: 11, locale: ns, label: () => ctx.locale.bind(ns)('title'),
  }, NavIcon))
}
