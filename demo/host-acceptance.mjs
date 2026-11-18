import assert from 'node:assert/strict'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { setTimeout as delay } from 'node:timers/promises'

const [hostLog, workspace, output, playwright] = process.argv.slice(2)
if (![hostLog, workspace, output, playwright].every(Boolean)) {
  throw new Error('Usage: node host-acceptance.mjs HOST_LOG TEST_WORKSPACE OUTPUT PLAYWRIGHT_ENTRY')
}
const { chromium } = await import(pathToFileURL(resolve(playwright)))
const url = (await readFile(hostLog, 'utf8')).match(/http:\/\/127\.0\.0\.1:\d+\/\?token=[^\s]+/u)?.[0]
assert.ok(url, 'isolated host launch URL')
await mkdir(workspace, { recursive: true })
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({ locale: 'en-US', viewport: { width: 1440, height: 950 } })
const pageErrors = []
page.on('pageerror', error => pageErrors.push(error.message))

async function openPanel() {
  const nav = page.getByRole('button', { name: 'Run Receipt', exact: true })
  await nav.waitFor()
  const notice = page.getByRole('button', { name: 'Continue', exact: true })
  await notice.waitFor({ timeout: 3000 }).then(() => notice.click(), () => {})
  await nav.click()
  await page.locator('.rr-panel').waitFor()
}

async function rpc(method, args) {
  const reply = await page.evaluate(async ({ method, args }) => {
    const response = await fetch('/api/' + method, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ type: 'client-request', rpcId: crypto.randomUUID(), method, payload: { args } }),
    })
    return response.json()
  }, { method, args })
  assert.equal(reply.result?.ok, true, JSON.stringify(reply.result))
  return reply.result.value
}

async function plan(title, prompt, seconds, cwd = resolve(workspace), target = 'new') {
  return rpc('schedule/create', { request: { title, prompt,
    timing: { kind: 'after', after_seconds: seconds }, target: { kind: target, create: { cwd } } } })
}

async function watch(task, path, headings = '') {
  await page.getByRole('button', { name: 'Plans', exact: true }).click()
  await page.getByRole('button', { name: 'Refresh', exact: true }).click()
  const card = page.locator(`[data-plan-id="${task.id}"]`)
  await card.getByRole('button', { name: 'Track this plan' }).click()
  await card.getByLabel('Report path').fill(path)
  await card.getByLabel('Required Markdown headings, one per line').fill(headings)
  if (path) await card.getByText('Expected path').waitFor()
  await card.getByRole('button', { name: 'Save rule' }).click()
  await card.getByText(/Tracking/).waitFor()
}

async function view() {
  return page.evaluate(async () => (await fetch('/api/run-receipt')).json())
}

async function finished(task) {
  const end = Date.now() + 60_000
  while (Date.now() < end) {
    const { rows } = await view()
    const row = rows?.find(row => row.taskId === task.id && row.final)
    if (row) return row
    await delay(650)
  }
  const current = await view()
  throw new Error('No terminal row for ' + task.title + ' ' + JSON.stringify(current.rows?.filter(row => row.taskId === task.id)))
}

async function select(title) {
  await page.getByRole('button', { name: 'Runs', exact: true }).click()
  await page.locator('.rr-row').filter({ hasText: title }).click()
  return page.locator('.rr-detail')
}

try {
  await page.goto(url)
  await openPanel()
  const run = Date.now().toString(36)
  const first = await plan('Morning report · ' + run, 'RUN_RECEIPT_WRITE', 15)
  await watch(first, 'morning.md', 'Highlights')
  await page.getByRole('button', { name: 'Runs', exact: true }).click()
  await page.locator('.rr-row').filter({ hasText: first.title }).getByText('Awaiting receipt').waitFor()
  const passed = await finished(first)
  assert.equal(passed.execution.status, 'completed', JSON.stringify(passed))
  assert.equal(passed.artifact?.status, 'passed', JSON.stringify(passed))
  assert.deepEqual(passed.artifact.checks, [{ heading: 'Highlights', pass: true }])
  const receipt = await rpc('schedule/history', { request: { id: first.id, limit: 10 } })
  assert.equal(receipt.records.length, 1)
  for (const key of ['targetSessionId', 'messageId', 'deliveredAt', 'scheduledAt']) {
    assert.equal(receipt.records[0][key], passed.receipt[key])
  }
  let detail = await select(first.title)
  await detail.getByText('Version at review').waitFor()
  await detail.getByRole('button', { name: 'Check current version' }).click()
  await detail.getByText('Matches the reviewed version.').waitFor()
  await detail.getByRole('button', { name: 'Open session' }).click()
  await page.locator('.rr-panel').waitFor({ state: 'hidden' })
  await page.getByText('Morning report run finished.', { exact: true }).last().waitFor()
  await openPanel()

  const [second, failing, unsupported] = await Promise.all([
    plan('Morning report · old file · ' + run, 'RUN_RECEIPT_NOOP', 20),
    plan('Morning report · failed · ' + run, 'RUN_RECEIPT_FAIL', 20),
    plan('One shared session · ' + run, 'RUN_RECEIPT_NOOP', 3600, resolve(workspace), 'new_once'),
  ])
  await watch(second, 'morning.md', 'Highlights')
  await watch(failing, '')
  await page.locator(`[data-plan-id="${unsupported.id}"]`).getByText(/New session once/).waitFor()
  const [stale, failed] = await Promise.all([finished(second), finished(failing)])
  assert.equal(stale.execution.status, 'completed', JSON.stringify(stale))
  assert.equal(stale.artifact?.reason, 'stale', JSON.stringify(stale))
  assert.equal(stale.artifact.version, passed.artifact.version)
  assert.equal(failed.execution.status, 'failed', JSON.stringify(failed))
  assert.equal(failed.execution.reason, 'error')
  detail = await select(second.title)
  await detail.getByText('The version matches the pre-run file. This run did not produce a verified update.').waitFor()
  await detail.getByRole('button', { name: 'Confirm no report expected' }).click()
  await detail.getByText('No report expected · confirmed by you', { exact: false }).waitFor()
  await page.reload()
  await openPanel()
  await select(second.title)
  await page.locator('.rr-detail').getByText('No report expected · confirmed by you', { exact: false }).waitFor()
  const retained = await view()
  assert.equal(retained.rows.filter(row => row.taskId === first.id).length, 1)
  assert.equal(retained.rows.filter(row => row.taskId === second.id).length, 1)
  await writeFile(join(workspace, 'morning.md'), '# Morning report\n\nUpdated after review.\n', 'utf8')
  detail = await select(first.title)
  await detail.getByRole('button', { name: 'Check current version' }).click()
  await detail.getByText('The file changed after review.').waitFor()
  await page.screenshot({ path: join(output, 'native-light.png') })

  const collapse = page.getByRole('button', { name: 'Collapse sidebar', exact: true })
  await collapse.click({ timeout: 5000 })
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.setViewportSize({ width: 600, height: 850 })
  await detail.getByText('Version at review').waitFor()
  const panelWidth = await page.locator('.rr-panel').evaluate(el => [el.clientWidth, el.scrollWidth])
  assert.ok(panelWidth[1] <= panelWidth[0] + 1, 'narrow panel has no horizontal overflow')
  await page.screenshot({ path: join(output, 'native-dark-narrow.png') })

  await page.setViewportSize({ width: 1440, height: 950 })
  const foreignTarget = await plan('Morning report · foreign update · ' + run, 'RUN_RECEIPT_NOOP', 24)
  await watch(foreignTarget, 'morning.md', 'Highlights')
  const other = await plan('Other task · ' + run, 'RUN_RECEIPT_REWRITE', 5)
  const changed = await finished(foreignTarget)
  const otherReceipt = await rpc('schedule/history', { request: { id: other.id, limit: 1 } })
  assert.equal(otherReceipt.records.length, 1)
  assert.notEqual(otherReceipt.records[0].targetSessionId, changed.receipt.targetSessionId)
  assert.match(await readFile(join(workspace, 'morning.md'), 'utf8'), /Sibling task updated/u)
  assert.equal(changed.artifact?.reason, 'unattributedChange', JSON.stringify(changed))

  assert.deepEqual(pageErrors, [])
  await writeFile(join(output, 'native-receipts.json'), JSON.stringify({ passed, stale, failed, changed, otherReceipt, pageErrors }, null, 2) + '\n')
  console.log('Native DSH schedule history, matching turn, report, stale file, failure, separate writer, session navigation, manual state, reload, current version and narrow layout passed.')
} finally {
  await browser.close()
}
