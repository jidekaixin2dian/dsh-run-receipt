import { createServer } from 'node:http'

// Loopback OpenAI-compatible fixture for the real DSH adapter.
const id = 'chatcmpl-run-receipt-demo'
const port = Number(process.argv[2] || 18974)
const report = '# Morning report\n\n## Highlights\n\n- Delivery check complete.\n'
const server = createServer(async (req, res) => {
  if (req.method !== 'POST' || req.url !== '/v1/chat/completions') {
    res.writeHead(404).end()
    return
  }
  try {
    let body = ''
    for await (const chunk of req) body += chunk
    const request = JSON.parse(body)
    const messages = request.messages ?? []
    const prompt = JSON.stringify(messages.filter(message => message.role === 'user'))
    if (prompt.includes('RUN_RECEIPT_FAIL')) {
      res.writeHead(400, { 'content-type': 'application/json' })
        .end(JSON.stringify({ error: { message: 'Controlled demo failure', type: 'invalid_request_error' } }))
      return
    }
    const results = messages.filter(message => message.role === 'tool').length
    const rewrite = prompt.includes('RUN_RECEIPT_REWRITE')
    const action = rewrite ? ['read', 'write'][results] : prompt.includes('RUN_RECEIPT_WRITE') && results === 0 ? 'write' : undefined
    const args = { file_path: 'morning.md' }
    if (action === 'write') args.content = rewrite ? report + '\nSibling task updated this file.\n' : report
    const delta = action
      ? { role: 'assistant', tool_calls: [{ index: 0, id: 'call_morning_demo_' + results, type: 'function', function: {
        name: action, arguments: JSON.stringify(args),
      } }] }
      : { role: 'assistant', content: 'Morning report run finished.' }
    const frame = (value, finish = null) => ({ id, object: 'chat.completion.chunk', created: 1,
      model: request.model, choices: [{ index: 0, delta: value, finish_reason: finish }] })
    const finish = action ? 'tool_calls' : 'stop'
    if (request.stream) {
      res.writeHead(200, { 'content-type': 'text/event-stream' })
      res.end(`data: ${JSON.stringify(frame(delta))}\n\ndata: ${JSON.stringify(frame({}, finish))}\n\ndata: [DONE]\n\n`)
    } else {
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ ...frame({}, finish), object: 'chat.completion', choices: [{ index: 0, message: delta, finish_reason: finish }] }))
    }
  } catch {
    res.writeHead(400).end()
  }
})
server.listen(port, '127.0.0.1', () => console.log(`Demo model on 127.0.0.1:${port}`))
