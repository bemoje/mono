import { Hono } from 'hono'
import { insertEvent } from '../repositories/eventRepo'
import { userEventsInsertSchema } from '../../common/schema'
import { zValidator } from '@hono/zod-validator'

export const analyticsRouter = new Hono()
  //
  .post('/track', zValidator('json', userEventsInsertSchema), async (c) => {
    const validData = c.req.valid('json')
    await insertEvent(validData)
    return c.json({ success: true })
  })
