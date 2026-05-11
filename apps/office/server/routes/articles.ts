import { Hono } from 'hono'
import { allArticles } from '../repositories/articleRepo'
import { insertPublishers } from '../repositories/publisherRepo'
import { publishersInsertSchema } from '../../common/schema'
import { publishersSelectSchema } from '../../common/schema'
import { selectPublishers } from '../repositories/publisherRepo'
import { zValidator } from '@hono/zod-validator'

export const articlesRouter = new Hono().get('/', async (c) => {
  const data = await allArticles()

  return c.json(data)
})

export const publishersRouter = new Hono()
  //
  .get('/', zValidator('json', publishersSelectSchema), async (c) => {
    const data = await selectPublishers()
    return c.json(data)
  })
  .put('/', zValidator('json', publishersInsertSchema), async (c) => {
    const data = c.req.valid('json')
    await insertPublishers(data)
    return c.json(data)
  })
// .patch('/', zValidator('json', publishersUpdateSchema), async (c) => {
//   const data = c.req.valid('json')
//   await updatePublishers(data)
//   return c.json(data)
// })
