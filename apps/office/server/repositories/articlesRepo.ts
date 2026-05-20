import { articles } from '../../common/schema'
import { createMethods } from './createMethods'
import { db } from '../db'
import { isNull } from 'drizzle-orm'
import { or } from 'drizzle-orm'

const methods = createMethods('articles', articles)

async function findAllWithPublisher() {
  return await db.query.articles.findMany({
    with: {
      publisher: true,
    },
  })
}

async function nonDebaited() {
  return await db.query.articles.findMany({
    where: or(isNull(articles.debaitedHeading), isNull(articles.debaitedSummary)),
  })
}

export const articlesRepo = {
  ...methods,
  findAllWithPublisher,
  nonDebaited,
}
