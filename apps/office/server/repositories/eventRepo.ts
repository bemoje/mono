import { db } from '../db'
import { userEvents } from '../../common/schema'

export async function insertEvent(values: typeof userEvents.$inferInsert) {
  return await db.insert(userEvents).values(values)
}
