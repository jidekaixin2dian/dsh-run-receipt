import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

export function ledgerAt(path) {
  let state
  try {
    state = JSON.parse(readFileSync(path, 'utf8'))
    if (state?.schema !== 1 || !isRecord(state.watches) || !isRecord(state.rows) || !isRecord(state.proofs)) {
      throw new Error('Invalid Run Receipt ledger')
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    state = { schema: 1, watches: {}, rows: {}, proofs: {} }
  }
  return {
    get state() { return state },
    save(next) {
      if (JSON.stringify(state) === JSON.stringify(next)) return
      mkdirSync(dirname(path), { recursive: true })
      const temporary = path + '.next'
      writeFileSync(temporary, JSON.stringify(next) + '\n', { mode: 0o600, flush: true })
      renameSync(temporary, path)
      state = next
    },
  }
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}
