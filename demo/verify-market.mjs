import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { createServer } from 'node:http'
import { basename, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const [marketSource, homePath, newArchive, oldArchive, output] = process.argv.slice(2)
if (![marketSource, homePath, newArchive, oldArchive, output].every(Boolean)) {
  throw new Error('Usage: node verify-market.mjs DSH_MARKET_SOURCE ISOLATED_DSH_HOME NEW_TGZ OLD_TGZ RECEIPT_JSON')
}
const market = resolve(marketSource)
const home = resolve(homePath)
const profile = join(home, 'profiles', 'web')
assert.match(basename(home), /^market-lab-/u)
mkdirSync(home, { recursive: false })
process.env.DSH_HOME = home
process.env.DSH_AGENTS_HOME = join(home, 'agents')
process.env.DSH_TELEMETRY_DISABLED = '1'
const name = '@jidekaixin2dian/dsh-run-receipt'
const archives = new Map()
for (const file of [oldArchive, newArchive]) {
  const metadata = JSON.parse(execFileSync('tar', ['-xOf', resolve(file), 'package/package.json'], { encoding: 'utf8' }))
  assert.equal(metadata.name, name)
  archives.set(metadata.version, { bytes: readFileSync(file), metadata })
}
const [oldVersion, newVersion] = [...archives.keys()]
assert.equal(oldVersion, '0.0.9')
assert.match(newVersion, /^0\.1\.0(?:-beta\.\d+)?$/u)
let latest = oldVersion
let registry
const digest = (kind, bytes, encoding) => createHash(kind).update(bytes).digest(encoding)
const entry = (version, data) => ({ ...data.metadata, dist: {
  tarball: registry + 'tarball/' + version + '.tgz',
  shasum: digest('sha1', data.bytes, 'hex'),
  integrity: 'sha512-' + digest('sha512', data.bytes, 'base64'),
} })
const timestamp = new Date(Date.now() - 7 * 86400000).toISOString()
const server = createServer((req, res) => {
  const path = decodeURIComponent(req.url.split('?')[0])
  const tarball = /^\/tarball\/([^/]+)\.tgz$/u.exec(path)
  if (tarball && archives.has(tarball[1])) {
    res.writeHead(200, { 'content-type': 'application/octet-stream' }).end(archives.get(tarball[1]).bytes)
    return
  }
  const entries = new Map()
  for (const version of latest === oldVersion ? [oldVersion] : [oldVersion, newVersion]) {
    entries.set(version, entry(version, archives.get(version)))
  }
  const body = path === '/' + name
    ? { name, 'dist-tags': { latest }, versions: Object.fromEntries(entries), time: Object.fromEntries([...entries.keys()].map(v => [v, timestamp])) }
    : path === '/' + name + '/latest' ? entries.get(latest) : undefined
  res.writeHead(body ? 200 : 404, { 'content-type': 'application/json' }).end(JSON.stringify(body ?? { error: 'not found' }))
})
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
registry = `http://127.0.0.1:${server.address().port}/`
process.env.PNPM_CONFIG_REGISTRY = registry
try {
  const load = file => import(pathToFileURL(join(market, 'src', file)))
  const { checkUpdates, setUpdateRegistry } = await load('updates.ts')
  const { hasLoadableEntry } = await load('profile.ts')
  const { runDshPlugin } = await load('dsh-cli.ts')
  const { installTargetFor } = await load('sources.ts')
  setUpdateRegistry(registry)
  const marketEntry = { url: 'https://github.com/jidekaixin2dian/dsh-run-receipt', npm: name }
  assert.equal(installTargetFor(marketEntry), name)
  async function install(version) {
    const result = await runDshPlugin('web', ['add', name + '@' + version, '--registry', registry, '-y'])
    assert.equal(result.exitCode, 0, result.stdout + '\n' + result.stderr)
    assert.equal(hasLoadableEntry(profile, name), true)
    const installed = join(profile, 'node_modules', ...name.split('/'))
    for (const path of ['package.json', 'lib/index.js', 'lib/client.js', 'cordis.patch.yml']) {
      assert.deepEqual(readFileSync(join(installed, path)), execFileSync('tar', ['-xOf',
        resolve(version === oldVersion ? oldArchive : newArchive), 'package/' + path]), path)
    }
  }
  const check = async (version, available, force = true) => {
    const state = (await checkUpdates('web', force, profile))[name]
    assert.equal(state.version, version)
    assert.equal(state.latest, latest)
    assert.equal(state.updateAvailable, available)
    assert.equal(state.checkFailed, undefined)
    return state
  }
  await install(oldVersion)
  const initial = await check(oldVersion, false)
  latest = newVersion
  const candidate = await check(oldVersion, true)
  await install(newVersion)
  const updated = await check(newVersion, false, false)
  const rechecked = await check(newVersion, false)
  const result = { marketCommit: execFileSync('git', ['-C', market, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
    registry: 'loopback fixture', checkedAt: new Date().toISOString(), initial, candidate, updated, rechecked }
  writeFileSync(output, JSON.stringify(result, null, 2) + '\n')
  console.log('Market npm selection, version discovery, official install and post-update check passed.')
} finally {
  await new Promise(resolve => server.close(resolve))
}
