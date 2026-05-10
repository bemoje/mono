import { Hono } from 'hono'
import { insertEvent } from '../repositories/eventRepo'
import { userEventsInsertSchema } from '../../common/schema'
import { zValidator } from '@hono/zod-validator'

const analyticsRouter = new Hono().post(
  '/track',
  zValidator('json', userEventsInsertSchema.omit({ id: true, timestamp: true })),
  async (c) => {
    const validData = c.req.valid('json')
    await insertEvent({ ...validData, timestamp: new Date() })
    return c.json({ success: true })
  }
)

export { analyticsRouter }
