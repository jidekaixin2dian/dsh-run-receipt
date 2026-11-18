import { join } from 'node:path'
import { ledgerAt } from './store.js'
import { createMonitor, SAMPLE_MS } from './monitor.js'

export const name = 'dsh-run-receipt'
export const inject = ['schedule', 'sessionQuery', 'fs', 'profileContext', 'connection']
const route = '/api/run-receipt'

function reply(status, value) {
  return Response.json(value, { status, headers: { 'cache-control': 'no-store' } })
}

export function apply(ctx) {
  let monitor
  try {
    monitor = createMonitor(ctx, ledgerAt(join(ctx.profileContext.dir, 'run-receipt', 'ledger.json')))
  } catch {
    ctx.logger.error('Run Receipt could not open the profile ledger.')
  }
  ctx.connection.fetch.register({
    path: route, methods: ['GET', 'POST'], requestBody: 'buffered',
    fetch: async request => {
      if (!monitor) return reply(503, { error: 'storageUnavailable' })
      try {
        if (request.method === 'GET') return reply(200, monitor.view())
        if (request.headers.get('x-dsh-plugin') !== name
            || !/^application\/json(?:\s*;|$)/iu.test(request.headers.get('content-type') ?? '')) {
          return reply(403, { error: 'denied' })
        }
        const content = await request.text()
        if (content.length > 8192) return reply(413, { error: 'invalidRule' })
        let payload
        try { payload = JSON.parse(content) } catch { return reply(400, { error: 'invalidRule' }) }
        if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return reply(400, { error: 'invalidRule' })
        if (payload.op === 'refresh') return reply(200, await monitor.refresh({ refreshCatalog: true }))
        if (payload.op === 'watch') return reply(200, await monitor.setWatch(payload))
        if (payload.op === 'mark') return reply(200, await monitor.mark(payload))
        if (payload.op === 'current') return reply(200, await monitor.current(payload, request.signal))
        return reply(400, { error: 'invalidRule' })
      } catch (error) {
        if (error.publicCode) return reply(400, { error: error.publicCode })
        if (request.signal.aborted) return reply(408, { error: 'unavailable' })
        ctx.logger.warn('Run Receipt request did not complete.', error.code ?? error.name)
        return reply(503, { error: 'unavailable' })
      }
    },
  })
  if (!monitor) return
  let scheduled
  let inProgress = false
  let again = false
  let stopped = false
  const enqueueSample = (delay = 250) => {
    if (stopped || scheduled) return
    if (inProgress) { again = true; return }
    scheduled = setTimeout(async () => {
      scheduled = undefined
      inProgress = true
      try {
        await monitor.refresh()
      } catch (error) {
        if (!stopped) ctx.logger.warn('Run Receipt observation did not complete.', error.code ?? error.name)
      } finally {
        inProgress = false
        if (again) { again = false; enqueueSample() }
      }
    }, delay)
  }
  ctx.on('schedule/changed', () => enqueueSample())
  ctx.on('session/event', (session, event) => {
    try {
      if (monitor.onSessionEvent(session, event) === true) enqueueSample()
    } catch (error) {
      ctx.logger.warn('Run Receipt could not record a file observation.', error.code ?? error.name)
    }
  })
  ctx.on('fs/observed', (target, observation, actor) => {
    try {
      monitor.onObserved(target, observation, actor)
    } catch (error) {
      ctx.logger.warn('Run Receipt could not read a file observation.', error.code ?? error.name)
    }
  })
  ctx.effect(() => {
    const interval = setInterval(enqueueSample, SAMPLE_MS)
    enqueueSample(0)
    return () => {
      stopped = true
      clearInterval(interval)
      clearTimeout(scheduled)
      return monitor.stop()
    }
  }, 'Run Receipt observation lifecycle')
}
