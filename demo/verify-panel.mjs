import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve, join, basename } from 'node:path'
import { pathToFileURL } from 'node:url'
import { setTimeout as delay } from 'node:timers/promises'

const [hostLog, nativeReceipt, output, playwright, mode, isolatedHome] = process.argv.slice(2)
assert.ok(['restart', 'replay', 'uninstall'].includes(mode), 'Mode: restart, replay or uninstall')
const native = JSON.parse(await readFile(nativeReceipt, 'utf8'))
const { chromium } = await import(pathToFileURL(resolve(playwright)))
const url = (await readFile(hostLog, 'utf8')).match(/http:\/\/127\.0\.0\.1:\d+\/\?token=[^\s]+/u)?.[0]
assert.ok(url)
const browser = await chromium.launch({ channel: 'chrome', headless: true })
try {
  const zh = mode === 'replay'
  const page = await browser.newPage({ viewport: { width: 1440, height: 1060 }, locale: zh ? 'zh-CN' : 'en-US' })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  const unauth = await fetch(new URL('/api/run-receipt', url))
  assert.equal(unauth.status, 401)
  await page.goto(url)
  const action = page.getByRole('button', { name: zh ? '定时任务验收箱' : 'Run Receipt', exact: true })
  await action.waitFor()
  const notice = page.getByRole('button', { name: /^(Continue|继续)$/u })
  await notice.waitFor({ timeout: 3000 }).then(() => notice.click(), () => {})
  await action.click()
  await page.locator('.rr-panel').waitFor()
  const read = () => page.evaluate(async () => {
    const response = await fetch('/api/run-receipt')
    return { status: response.status, data: await response.json().catch(() => null) }
  })
  const rpc = (method, args) => page.evaluate(async ({ method, args }) => {
    const response = await fetch('/api/' + method, { method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ type: 'client-request', rpcId: crypto.randomUUID(), method, payload: { args } }) })
    return (await response.json()).result
  }, { method, args })
  const { status, data } = await read()
  assert.equal(status, 200)
  const passRows = data.rows.filter(row => row.key === native.passed.key)
  assert.equal(passRows.length, 1)
  assert.deepEqual(passRows[0].artifact, native.passed.artifact)
  if (mode === 'restart') {
    const staleRows = data.rows.filter(row => row.key === native.stale.key)
    assert.equal(staleRows.length, 1)
    assert.equal(staleRows[0].artifact.reason, 'stale')
    assert.ok(staleRows[0].manual.readAt && staleRows[0].manual.emptyAt)
    await page.getByRole('button', { name: 'Plans', exact: true }).click()
    await page.locator(`[data-plan-id="${native.passed.taskId}"]`).getByText(/Tracking/).waitFor()
    await writeFile(join(output, 'restart.json'), JSON.stringify({ delivery: passRows[0].receipt,
      retained: ['subscription', 'report rules', 'native receipt', 'version evidence', 'manual review'], duplicateRows: false }, null, 2))
  }
  if (mode === 'replay') {
    const snapshots = [
      ['第 1 天', '当前验收版本与该轮的一次成功写入吻合。', 'three-workdays-pass.png'],
      ['第 2 天', '文件版本与运行前一致，本次未产生可验证的更新。', 'three-workdays-stale.png'],
      ['第 3 天', '观察窗口内，DSH 持续显示该次计划应投递。', 'three-workdays-no-receipt.png'],
    ]
    assert.equal(data.rows.length, 3)
    for (const [label, message, image] of snapshots) {
      await page.locator('.rr-row').filter({ hasText: label }).click()
      await page.locator('.rr-detail').getByText(message, { exact: false }).waitFor()
      await page.screenshot({ path: join(output, image) })
    }
  }
  if (mode === 'uninstall') {
    // The launch URL belongs to the disposable validation profile that owns this receipt.
    assert.equal(passRows[0].receipt.messageId, native.passed.receipt.messageId)
    assert.equal(basename(resolve(isolatedHome)), 'final-home')
    const path = join(isolatedHome, 'profiles', 'web', 'run-receipt', 'ledger.json')
    const target = await rpc('schedule/create', { request: { title: 'Dispose monitor canary',
      prompt: 'RUN_RECEIPT_NOOP', timing: { kind: 'after', after_seconds: 14 },
      target: { kind: 'new', create: { cwd: native.stale.rule.root } } } })
    assert.equal(target.ok, true, JSON.stringify(target))
    const watched = await page.evaluate(async id => fetch('/api/run-receipt', { method: 'POST',
      headers: { 'content-type': 'application/json', 'x-dsh-plugin': 'dsh-run-receipt' },
      body: JSON.stringify({ op: 'watch', id, on: true, path: '', headings: [] }) }).then(response => response.ok), target.value.id)
    assert.equal(watched, true)
    const before = await readFile(path)
    const result = await rpc('pluginManager/removeBundle', { name: '@jidekaixin2dian/dsh-run-receipt' })
    assert.equal(result?.ok, true, JSON.stringify(result))
    assert.equal(result.value.application, 'applied', JSON.stringify(result))
    for (let i = 0; i < 40 && (await read()).status !== 404; i += 1) await delay(250)
    assert.equal((await read()).status, 404, 'host route disposed')
    await action.waitFor({ state: 'hidden' })
    await page.locator('.rr-panel').waitFor({ state: 'hidden' })
    let receipt
    for (let i = 0; i < 40 && !receipt; i += 1) {
      const page = await rpc('schedule/history', { request: { id: target.value.id, limit: 1 } })
      assert.equal(page.ok, true, JSON.stringify(page))
      receipt = page.value.records[0]
      if (!receipt) await delay(500)
    }
    assert.ok(receipt, 'native schedule continued after uninstall')
    assert.equal(Date.parse(receipt.deliveredAt) > Date.parse(target.value.createdAt), true)
    await delay(1100)
    assert.deepEqual(await readFile(path), before, 'ledger remains unchanged after native delivery')
    await writeFile(join(output, 'uninstall.json'), JSON.stringify({ application: 'applied', route: 404,
      panel: 'unregistered', nativeDeliveryAfterUnload: receipt, ledgerChanged: false }, null, 2))
  }
  assert.deepEqual(errors, [])
  console.log(mode + ' verified in DSH Web')
} finally {
  await browser.close()
}
