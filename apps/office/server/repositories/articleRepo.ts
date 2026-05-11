import { articles } from '../../common/schema'
import { db } from '../db'
import { desc } from 'drizzle-orm'
import { eq } from 'drizzle-orm'
import { isNull } from 'drizzle-orm'
import { or } from 'drizzle-orm'
import { pick } from 'es-toolkit'
import { publishers } from '../../common/schema'

export async function allArticles<K extends keyof typeof articles.$inferSelect>(fields?: K[]) {
  return await db.query.articles.findMany({
    ...(!fields ? {} : { columns: pick(articles, fields) }),
    with: {
      publisher: true,
    },
  })
}

export async function nonDebaitedArticles() {
  return await db.query.articles.findMany({
    where: or(isNull(articles.debaitedHeading), isNull(articles.debaitedSummary)),
  })
}

export async function selectArticles<Sel extends Parameters<typeof db.select>[0]>(select?: Sel) {
  return await db
    .select(!select ? (undefined as never) : select)
    .from(articles)
    .orderBy(desc(articles.publishedAt))
}

export async function getArticles<K extends keyof typeof articles.$inferSelect>(fields?: K[]) {
  return await db
    .select(!fields ? (undefined as never) : pick(articles, fields))
    .from(articles)
    .orderBy(desc(articles.publishedAt))
}

export async function getArticlesPublisher(article: typeof articles.$inferSelect) {
  const publisher = await db.query.publishers.findFirst({
    where: eq(publishers.id, article.publisherId),
    columns: { url: true },
  })
  if (!publisher) {
    throw new Error(`Publisher with id ${article.publisherId} not found`)
  }
  return publisher
}

export async function getArticleUrl(article: typeof articles.$inferSelect) {
  const publisher = await getArticlesPublisher(article)
  return new URL(article.pathname, publisher.url).href
}
