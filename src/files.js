import { MAX_REPORT_BYTES, relativePath } from './evidence.js'

export async function workspaceFile(fs, root, path, { text = false, signal } = {}) {
  if (!root || relativePath(path) !== path) return { state: 'outsideWorkspace' }
  try {
    const parent = await fs.resolve(root, { signal })
    const target = await fs.resolve(path, { cwd: root, signal })
    const absolutePath = fs.processPath(target)
    if (!fs.contains(parent, target) || parent.targetKey === target.targetKey) return { state: 'outsideWorkspace' }
    const entry = await fs.lstat(path, { cwd: root }, signal)
    if (!entry) return { state: 'missing' }
    if (entry.type !== 'file') return { state: 'notFile' }
    const info = await fs.stat(target, signal)
    if (!info) return { state: 'missing' }
    if (info.type !== 'file' || info.version !== entry.version) return { state: 'unstable' }
    const file = { state: 'present', absolutePath, version: info.version, bytes: info.size }
    if (!text) return file
    if (info.size !== undefined && info.size > MAX_REPORT_BYTES) return { ...file, readError: 'tooLarge' }
    const bytes = await fs.readBytes(target, signal, MAX_REPORT_BYTES)
    const after = await fs.stat(target, signal)
    const entryAfter = await fs.lstat(path, { cwd: root }, signal)
    if (after?.version !== info.version || entryAfter?.version !== info.version) return { state: 'unstable' }
    try {
      const markdown = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
      return markdown.includes('\0') ? { ...file, readError: 'notText' } : { ...file, markdown }
    } catch {
      return { ...file, readError: 'notText' }
    }
  } catch (error) {
    if (signal?.aborted) throw error
    return { state: 'fileUnavailable' }
  }
}
