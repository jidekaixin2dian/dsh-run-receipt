import { lexer } from 'marked'

export const MAX_REPORT_BYTES = 256 * 1024
const mutationNames = new Set(['write', 'edit'])
export const isMutation = name => mutationNames.has(name)
const terminalFailures = new Set(['aborted', 'blocked', 'error', 'max-tokens', 'interrupted'])

export function validInstant(value) {
  return typeof value === 'string' && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value
}

export function localDate(instant, timeZone) {
  const parts = new Intl.DateTimeFormat('en', { timeZone, calendar: 'gregory', numberingSystem: 'latn',
    year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(instant))
  return ['year', 'month', 'day'].map(type => parts.find(part => part.type === type).value).join('-')
}

export function relativePath(value) {
  if (typeof value !== 'string' || value.length > 400) return null
  const path = value.trim().replaceAll('\\', '/')
  if (!path || /[:*?"<>|\x00-\x1f]/u.test(path)) return null
  const parts = path.replaceAll('{date}', '2000-01-01').split('/')
  if (parts.some(part => !part || part === '.' || part === '..' || /^~|[ .]$|[{}]/u.test(part)
    || /^(?:con|prn|aux|nul|com[1-9¹²³]|lpt[1-9¹²³])(?:\.|$)/iu.test(part))) return null
  return path
}

export function occurrencePath(rule, at, timeZone) {
  return rule?.path?.replaceAll('{date}', localDate(at, timeZone)) ?? null
}

export function reminder(message) {
  if (message?.source?.kind !== 'schedule' || message.content?.length !== 1 || message.content[0].type !== 'text') return null
  const lines = message.content[0].text.split('\n')
  if (lines[0] !== '[SCHEDULE REMINDER]' || lines[1] !== 'This is a scheduled message from the user'
      || lines.length !== 5 || !lines[2].startsWith('schedule_id_json: ')
      || !lines[3].startsWith('occurrence_at: ') || !lines[4].startsWith('reminder_prompt_json: ')) return null
  try {
    const taskId = JSON.parse(lines[2].slice(18))
    const at = lines[3].slice(15)
    const prompt = JSON.parse(lines[4].slice(22))
    return typeof taskId === 'string' && validInstant(at) && typeof prompt === 'string' ? { taskId, at, prompt } : null
  } catch {
    return null
  }
}

export function associate(snapshot, row) {
  if (snapshot.session.id !== row.receipt.targetSessionId || snapshot.session.isSeeded || snapshot.inheritedEventCount !== 0) {
    return { status: 'unknown', reason: 'ambiguous' }
  }
  const matches = snapshot.events.filter(event => event.type === 'user/message' && event.data.id === row.receipt.messageId)
  if (matches.length === 0) return { status: 'pending', reason: 'noAcceptance' }
  if (matches.length !== 1) return { status: 'unknown', reason: 'ambiguous' }
  const accepted = matches[0]
  const payload = reminder(accepted.data)
  if (payload?.taskId !== row.taskId || payload.at !== row.at
      || (row.receipt.prompt !== undefined && payload.prompt !== row.receipt.prompt)) {
    return { status: 'unknown', reason: 'ambiguous' }
  }
  const starts = snapshot.events.filter(event => event.type === 'turn/start')
  const start = starts[0]
  const next = starts[1]?.seq ?? Infinity
  if (!start || start.data.turn !== 1 || accepted.seq <= start.seq || accepted.seq >= next) {
    return { status: 'unknown', reason: 'ambiguous' }
  }
  const logs = snapshot.events.filter(event => event.seq >= start.seq && event.seq < next)
  const outcomes = logs.filter(event => event.type === 'turn/end')
  const end = outcomes[0]
  if (outcomes.length > 1 || (end && (end.data.turn !== 1 || end.seq <= accepted.seq))
      || logs.some(event => event.type === 'user/message' && event !== accepted
        && (event.data.source?.kind === 'user' || reminder(event.data)
          || event.data.content?.[0]?.text?.startsWith?.('[SCHEDULE REMINDER BATCH]')))) {
    return { status: 'unknown', reason: 'ambiguous' }
  }
  const identity = { turn: 1, startSeq: start.seq, messageSeq: accepted.seq }
  if (!end) return { ...identity, status: 'running' }
  const kind = end.data.reason?.kind
  const status = kind === 'completed' ? 'completed' : terminalFailures.has(kind) ? 'failed' : 'unknown'
  return { ...identity, status, reason: kind, endSeq: end.seq, endedAt: end.time }
}

export function confirmedMutation(event, observation) {
  if (!observation || event.data.message?.isError !== false || event.data.meta?.path !== observation.path) return false
  const meta = event.data.meta
  return (observation.name === 'write' && meta.operation === 'create')
    || (Array.isArray(meta.diffs) && meta.diffs.some(diff => diff.path === observation.path && diff.oldText !== diff.newText))
}

export function headingResults(markdown, headings) {
  const found = new Set()
  const text = token => {
    if (token.type === 'image' || token.type === 'html') return ''
    if (token.type === 'codespan') return token.text
    if (token.tokens) return token.tokens.map(text).join('')
    return token.text ?? ''
  }
  for (const token of lexer(markdown)) {
    if (token.type === 'heading') found.add(normalizeHeading(text(token)))
  }
  return headings.map(heading => ({ heading, pass: found.has(normalizeHeading(heading)) }))
}

function normalizeHeading(value) {
  return value.trim().replace(/\s+/gu, ' ').normalize('NFC')
}

export function auditFile({ file, baseline, write, headings }) {
  if (file.state === 'missing') return { status: 'rejected', reason: 'missing' }
  if (file.state !== 'present') return { status: 'unknown', reason: file.state }
  const evidence = { version: file.version, absolutePath: file.absolutePath, bytes: file.bytes }
  if (!write || file.version !== write.version || file.absolutePath !== write.path) {
    if (write) return { ...evidence, status: 'unknown', reason: 'changedAfterWrite', write }
    if (baseline?.version === file.version && baseline.absolutePath === file.absolutePath) {
      return { ...evidence, status: 'rejected', reason: 'stale', baseline }
    }
    return { ...evidence, status: 'unknown', reason: baseline ? 'unattributedChange' : 'unattributed', baseline }
  }
  if (headings.length && file.markdown === undefined) return { ...evidence, status: 'unknown', reason: file.readError, write }
  const checks = headingResults(file.markdown ?? '', headings)
  return { ...evidence, status: checks.every(item => item.pass) ? 'passed' : 'rejected',
    reason: checks.every(item => item.pass) ? 'verified' : 'headingsMissing', write, checks }
}
