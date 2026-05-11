import { Hono } from 'hono'
import z from 'zod'
import { zValidator } from '@hono/zod-validator'
let eventListeners: ((data: string) => void)[] = []

const streamRouter = new Hono()
  .get(
    '/',
    (c) =>
      new Response(
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
              eventListeners = eventListeners.filter((l) => l !== listener)
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
  )
  .post(
    '/debaited',
    zValidator('json', z.object({ id: z.number(), debaitedHeading: z.string(), debaitedSummary: z.string() })),
    (c) => {
      const data = c.req.valid('json')
      for (const listener of eventListeners) {
        try {
          listener(JSON.stringify(data))
        } catch (_e) {
          console.error('Failed to send event to a listener', _e)
        }
      }
      return c.json({ success: true })
    }
  )

export { streamRouter }
