import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { build } from 'esbuild'
import { fileURLToPath } from 'node:url'

const root = new URL('../', import.meta.url)
process.chdir(fileURLToPath(root))
await mkdir('lib', { recursive: true })
await copyFile('node_modules/marked/LICENSE.md', 'lib/THIRD-PARTY-NOTICES.md')
await build({ entryPoints: ['src/index.js'], outfile: 'lib/index.js', bundle: true,
  platform: 'node', target: 'node24', format: 'esm' })
const css = await readFile('src/panel.css', 'utf8')
const client = await build({ entryPoints: ['src/client.jsx'], write: false, bundle: true,
  platform: 'browser', target: 'es2022', format: 'cjs', jsx: 'automatic',
  external: ['react', 'react/jsx-runtime', '@deepseek-ai/dsh-client-ui-primitives'],
  define: { 'process.env.RUN_RECEIPT_CSS': JSON.stringify(css) } })
await writeFile('lib/client.js', `;(() => {
  const factory = (require) => {
    const module = { exports: {} }
    ${client.outputFiles[0].text}
    return module.exports
  }
  window.__ModuleLoader__.load({ id: '@jidekaixin2dian/dsh-run-receipt', factory })
})()
`)
