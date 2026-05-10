import { articles } from '../../common/schema'
import { db } from '../db'
import { desc } from 'drizzle-orm'
import { pick } from 'es-toolkit'

export async function selectArticles<Sel extends Parameters<typeof db.select>[0]>(select?: Sel) {
  return await db
    .select(!select ? (undefined as never) : select)
    .from(articles)
    .orderBy(desc(articles.time))
}
export async function getArticles<K extends keyof typeof articles.$inferSelect>(fields?: K[]) {
  return await db
    .select(!fields ? (undefined as never) : pick(articles, fields))
    .from(articles)
    .orderBy(desc(articles.time))
}

// const { origin, pathname } = new URL(
//   'https://www.dr.dk/nyheder/seneste/mistanke-om-hantavirus-paa-afsidesliggende-oe'
// )
