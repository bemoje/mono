import { db } from '../db'
import { pick } from 'es-toolkit'
import { publishers } from '../../common/schema'

export async function selectPublishers<K extends keyof typeof publishers.$inferSelect>(fields?: K[]) {
  return await db.query.publishers.findMany({
    ...(!fields ? {} : { columns: pick(publishers, fields) }),
    with: {
      articles: true,
    },
  })
}

export async function insertPublishers(data: typeof publishers.$inferInsert) {
  return await db.insert(publishers).values(data)
}

// export async function updatePublishers(data: typeof publishers.$inferInsert) {
//   return await db.update(publishers).set(data)
// }
