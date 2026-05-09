import { Hono } from 'hono'
import { insertEvent } from '../repositories/eventRepo'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const analyticsRouter = new Hono().post(
  '/track',
  zValidator(
    'json',
    z.object({
      event: z.string(),
      url: z.string(),
    })
  ),
  (c) => {
    const { event, url } = c.req.valid('json')
    insertEvent(event, url)
    return c.json({ success: true })
  }
)

export { analyticsRouter }
