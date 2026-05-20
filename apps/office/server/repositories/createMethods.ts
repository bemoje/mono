import * as SCHEMA from '../../common/schema'
import type { IndexColumn } from 'drizzle-orm/pg-core'
import { db } from '../db'
import { eq } from 'drizzle-orm'
import { inArray } from 'drizzle-orm'

export function createMethods<
  Name extends keyof typeof db.query,
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  Schema extends (typeof SCHEMA)[Name] & { id: any; $inferSelect: any; $inferInsert: any },
>(name: Name, schema: Schema) {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const dbQuery = db.query[name] as any

  type Insert = Schema['$inferInsert']
  type Update = Partial<Schema['$inferInsert']>
  type Select = Schema['$inferSelect']

  async function findMany() {
    return (await db.select().from(schema)) as Select[]
  }

  async function findOneById(options: { id: number }) {
    const result = await dbQuery.findFirst({
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      where: (table: any, ops: any) => ops.eq(table.id, options.id),
    })
    return (result || undefined) as Select | undefined
  }

  async function getOneById(options: { id: number }) {
    const result = await findOneById(options)
    if (!result) {
      throw new Error(`Record with id ${options.id} not found`)
    }
    return result as Select
  }

  async function insertOne(options: { insert: Insert }) {
    return ((await db.insert(schema).values(options.insert).returning()) as Select[])[0]!
  }

  async function insertMany(options: { insert: Insert }[]) {
    return (await db
      .insert(schema)
      .values(options.map((o) => o.insert))
      .returning()) as Select[]
  }

  async function upsertOne<K extends keyof Insert>(options: { upsert: Insert; target: K[] }) {
    return (await db
      .insert(schema)
      .values(options.upsert)
      .onConflictDoUpdate({
        set: options.upsert,
        target: options.target.map((key) => schema[key] as IndexColumn),
      })
      .returning()) as Select[]
  }

  async function deleteManyById(options: { ids: number[] }) {
    return (await db.delete(schema).where(inArray(schema.id, options.ids)).returning()) as Select[]
  }

  async function deleteOneById(options: { id: number }) {
    return (await db.delete(schema).where(eq(schema.id, options.id)).returning()) as Select[]
  }

  async function updateOneById(options: { id: number; update: Update }) {
    return (await db.update(schema).set(options.update).where(eq(schema.id, options.id)).returning()) as Select[]
  }

  return {
    findMany,
    findOneById,
    getOneById,
    insertOne,
    insertMany,
    updateOneById,
    upsertOne,
    deleteManyById,
    deleteOneById,
  }
}
