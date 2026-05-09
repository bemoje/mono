import { Hono } from 'hono'
import { getArticles } from '../repositories/articleRepo'

const articlesRouter = new Hono().get('/', (c) => {
  const articles = getArticles()
  return c.json(articles)
})

export { articlesRouter }
