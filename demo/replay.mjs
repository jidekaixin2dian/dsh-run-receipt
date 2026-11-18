import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import { ledgerAt } from '../src/store.js'
import { advanceWindow, observedMissing } from '../src/monitor.js'

const [source, replayHome] = process.argv.slice(2)
assert.ok(source && replayHome, 'Usage: node replay.mjs NATIVE_RECEIPTS_JSON REPLAY_HOME')
const home = resolve(replayHome)
assert.equal(basename(home), 'replay-home')
assert.ok(existsSync(join(home, 'RUN_RECEIPT_FIXTURE')), 'Use a prepared isolated replay copy.')
const { passed, stale } = JSON.parse(readFileSync(source, 'utf8'))
const ledger = ledgerAt(join(home, 'profiles', 'web', 'run-receipt', 'ledger.json'))
const native = ledger.state.rows[passed.key]
assert.equal(native.artifact.status, 'passed')
assert.equal(native.receipt.messageId, passed.receipt.messageId)
assert.equal(stale.artifact.reason, 'stale')
assert.equal(ledger.state.rows[stale.key].manual.emptyAt !== null, true)

const iso = ms => new Date(ms).toISOString()
function nextWeekday(instant) {
  const next = new Date(instant)
  do { next.setUTCDate(next.getUTCDate() + 1) } while ([0, 6].includes(next.getUTCDay()))
  return next.getTime()
}
const secondAt = nextWeekday(Date.parse(native.at))
const thirdAt = nextWeekday(secondAt)
const secondKey = JSON.stringify(['replay-day-2', iso(secondAt), 'demo-2-message'])
const thirdKey = JSON.stringify(['replay-day-3', iso(thirdAt), ''])
const second = {
  ...stale, key: secondKey, taskId: 'replay-day-2', title: '晨报 · 第 2 天（回放）',
  at: iso(secondAt), receipt: { messageId: 'demo-2-message', targetSessionId: 'demo-2-session',
    scheduledAt: iso(secondAt), deliveredAt: iso(secondAt + 1000) },
  execution: { ...stale.execution, endedAt: secondAt + 3000 },
  artifact: { ...stale.artifact, checkedAt: iso(secondAt + 4000),
    baseline: { ...stale.artifact.baseline, checkedAt: iso(secondAt - 60000) } },
}
delete second.manual
const plan = { at: iso(thirdAt), status: 'active', zone: native.zone }
let window
for (const offset of [-15000, 0, 30000, 60000, 90000]) {
  window = advanceWindow(window, plan, { from: native.rule.from }, thirdAt + offset)
}
assert.equal(observedMissing(window, { records: [] }, thirdAt + 90000), true)
const third = {
  key: thirdKey, taskId: 'replay-day-3', title: '晨报 · 第 3 天（回放）', at: iso(thirdAt), zone: native.zone,
  mode: 'new', expectation: 'missing', rule: native.rule,
  observation: { first: iso(window.first), last: iso(window.last) },
}
ledger.save({ ...ledger.state, watches: { [native.taskId]: ledger.state.watches[native.taskId] },
  rows: { [native.key]: { ...native, title: '晨报 · 第 1 天（真实投递）' }, [secondKey]: second, [thirdKey]: third }, proofs: {} })
console.log('Saved three-workday replay with the native day-1 receipt and controlled day-2 and day-3 observations.')
