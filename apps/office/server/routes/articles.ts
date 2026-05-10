import { Hono } from 'hono'
import { getArticles } from '../repositories/articleRepo'

const articlesRouter = new Hono().get('/', async (c) => {
  const articles = await getArticles()
  return c.json(articles)
})

export { articlesRouter }
