import { Hono } from 'hono'

let eventListeners: ((data: string) => void)[] = []

const streamRouter = new Hono()
  .get('/', (c) => {
    return new Response(
      new ReadableStream({
        start(controller) {
          const listener = (data: string) => {
            try {
              controller.enqueue(`data: ${data}\n\n`)
            } catch (_e) {
              // Ignore closed controller
            }
          }
          eventListeners.push(listener)
          // Keep connection alive
          const keepAlive = setInterval(() => {
            controller.enqueue(': keepalive\n\n')
          }, 15000)

          // Clean up on disconnect
          c.req.raw.signal.addEventListener('abort', () => {
            clearInterval(keepAlive)
            eventListeners = eventListeners.filter((l) => {
              return l !== listener
            })
          })
        },
      }),
      {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      }
    )
  })
  .post('/scraped', async (c) => {
    const body = await c.req.text()
    eventListeners.forEach((listener) => {
      return listener(body)
    })
    return c.text('ok')
  })

export { streamRouter }
