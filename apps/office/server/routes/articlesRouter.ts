import { articles } from '../../common/schema'
import { articlesRepo } from '../repositories/articlesRepo'
import { createRoutes } from './createRoutes'

export const articlesRouter = createRoutes('articles', articles, articlesRepo)
  //
  .get('/findAllWithPublisher', async (c) => {
    const res = await articlesRepo.findAllWithPublisher()
    return c.json(res)
  })

  //
  .get('/nonDebaited', async (c) => {
    const res = await articlesRepo.nonDebaited()
    return c.json(res)
  })
