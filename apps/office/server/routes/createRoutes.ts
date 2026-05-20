import * as SCHEMA from '../../common/schema'
import { Hono } from 'hono'
import { createInsertSchema } from 'drizzle-zod'
import type { createMethods } from '../repositories/createMethods'
import { createSelectSchema } from 'drizzle-zod'
import { createUpdateSchema } from 'drizzle-zod'
import { db } from '../db'
import { getTableColumns } from 'drizzle-orm'
import { keysOf } from '@mono/object'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

export function createRoutes<
  Name extends keyof typeof db.query,
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  Schema extends (typeof SCHEMA)[Name] & { id: any; $inferSelect: any; $inferInsert: any },
>(name: Name, schema: Schema, methods: ReturnType<typeof createMethods<Name, Schema>>) {
  type Key = Extract<keyof Schema['$inferSelect'], string>
  const keys = keysOf(getTableColumns(schema))

  const InsertSchema = createInsertSchema(schema).omit({ id: true })
  const SelectSchema = createSelectSchema(schema)
  const UpdateSchema = createUpdateSchema(schema).omit({ id: true })
  const FieldsArraySchema = z.array(z.union(keys.map((k) => z.literal(k))))
  const IdSchema = z.number().nonnegative().int()

  const router = new Hono()
    .get('/findMany', async (c) => {
      const res = await methods.findMany()
      return c.json(res)
    })

    .post('/findOneById', zValidator('json', z.object({ id: IdSchema })), async (c) => {
      const data = c.req.valid('json')
      const res = await methods.findOneById(data)
      return c.json(res)
    })

    .post('/getOneById', zValidator('json', z.object({ id: IdSchema })), async (c) => {
      const data = c.req.valid('json')
      const res = await methods.getOneById(data)
      return c.json(res)
    })

    .post('/insertOne', zValidator('json', z.object({ insert: InsertSchema })), async (c) => {
      const data = c.req.valid('json')
      const res = await methods.insertOne(data)
      return c.json(res)
    })

    .post('/insertMany', zValidator('json', z.array(z.object({ insert: InsertSchema }))), async (c) => {
      const data = c.req.valid('json')
      const res = await methods.insertMany(data)
      return c.json(res)
    })

    .post('/updateOneById', zValidator('json', z.object({ id: IdSchema, update: UpdateSchema })), async (c) => {
      const data = c.req.valid('json')
      const res = await methods.updateOneById(data)
      return c.json(res)
    })

    .post(
      '/upsertOne',
      zValidator('json', z.object({ upsert: InsertSchema, target: FieldsArraySchema })),
      async (c) => {
        const data = c.req.valid('json')
        const res = await methods.upsertOne(data)
        return c.json(res)
      }
    )

    .post('/deleteManyById', zValidator('json', z.object({ ids: z.array(IdSchema) })), async (c) =>
      c.json(await methods.deleteManyById(c.req.valid('json')))
    )

    .post('/deleteOneById', zValidator('json', z.object({ id: IdSchema })), async (c) => {
      const data = c.req.valid('json')
      const res = await methods.deleteOneById(data)
      return c.json(res)
    })

  return router
}
