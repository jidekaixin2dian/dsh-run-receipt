import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const manifest = JSON.parse(readFileSync('package.json', 'utf8'))
const archive = process.argv[2] ?? `jidekaixin2dian-dsh-run-receipt-${manifest.version}.tgz`
const expected = [
  'LICENSE', 'README.md', 'README.en.md', 'package.json', 'cordis.patch.yml', 'icon.svg',
  'lib/index.js', 'lib/client.js', 'lib/THIRD-PARTY-NOTICES.md',
]
const files = execFileSync('tar', ['-tzf', archive], { encoding: 'utf8' }).trim().split(/\r?\n/u)
assert.deepEqual(files.sort(), expected.map(file => 'package/' + file).sort())
for (const file of expected) {
  const data = execFileSync('tar', ['-xOzf', archive, 'package/' + file])
  assert.deepEqual(data, readFileSync(file), file)
}
console.log(`${manifest.name}@${manifest.version} contains the ${expected.length} expected source files.`)
