import type { PartialOnUndefinedDeep } from 'type-fest'
import { createInsertSchema } from 'drizzle-zod'
import { createSelectSchema } from 'drizzle-zod'
import { createUpdateSchema } from 'drizzle-zod'
import { getTableColumns } from 'drizzle-orm'
// import { crudPolicy } from 'drizzle-orm/neon'
import { integer } from 'drizzle-orm/pg-core'
import { keysOf } from '@mono/object'
// import { pgRole } from 'drizzle-orm/pg-core'
import { pgTable } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { text } from 'drizzle-orm/pg-core'
import { timestamp } from 'drizzle-orm/pg-core'
import { uniqueIndex } from 'drizzle-orm/pg-core'
import { z } from 'zod'

// const guest = pgRole('guest')
// const user = pgRole('user')
// const admin = pgRole('admin')

const defaultColumns = () => ({
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
})

export const users = pgTable('users', {
  ...defaultColumns(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  displayName: text('display_name'),
  tenantId: integer('tenant_id').references(() => tenants.id),
})

export const usersRelations = relations(users, ({ one }) => ({
  tenant: one(tenants, {
    fields: [users.tenantId],
    references: [tenants.id],
  }),
}))

export const usersInsertSchema = createInsertSchema(users)
export const usersSelectSchema = createSelectSchema(users)
export const usersUpdateSchema = createUpdateSchema(users)

export type UserInsert = z.infer<typeof usersInsertSchema>
export type UserUpdate = z.infer<typeof usersUpdateSchema>
export type UserSelect = z.infer<typeof usersSelectSchema>
export type User = PartialOnNull<UserSelect>

export const tenants = pgTable('tenants', {
  ...defaultColumns(),
  VAT: text('VAT').unique().notNull(),
  companyName: text('company_name').unique().notNull(),
})

export const tenantsRelations = relations(tenants, ({ many }) => ({
  users: many(users),
}))

export const tenantsInsertSchema = createInsertSchema(tenants)
export const tenantsSelectSchema = createSelectSchema(tenants)
export const tenantsUpdateSchema = createUpdateSchema(tenants)

export type TenantInsert = z.infer<typeof tenantsInsertSchema>
export type TenantUpdate = z.infer<typeof tenantsUpdateSchema>
export type TenantSelect = z.infer<typeof tenantsSelectSchema>
export type Tenant = PartialOnNull<TenantSelect>

export const publishers = pgTable('publishers', {
  ...defaultColumns(),
  name: text().notNull(),
  // eg. https://www.dr.dk
  url: text().unique().notNull(),
})

export const publishersRelations = relations(publishers, ({ many }) => ({
  articles: many(articles), // A publisher has many articles
}))

export const publishersInsertSchema = createInsertSchema(publishers)
export const publishersSelectSchema = createSelectSchema(publishers)
export const publishersUpdateSchema = createUpdateSchema(publishers)
export const publishersFieldsArraySchema = z.object({
  fields: z.array(z.enum(keysOf(getTableColumns(publishers)))).optional(),
})

export type PublisherInsert = z.infer<typeof publishersInsertSchema>
export type PublisherUpdate = z.infer<typeof publishersUpdateSchema>
export type PublisherSelect = z.infer<typeof publishersSelectSchema>
export type Publisher = PartialOnNull<PublisherSelect>

export const articles = pgTable(
  'articles',
  {
    ...defaultColumns(),
    publisherId: integer('publisher_id')
      .references(() => publishers.id)
      .notNull(),
    pathname: text('pathname').notNull(),
    publishedAt: timestamp('published_at').notNull(),
    category: text('category').notNull(),
    heading: text('heading').notNull(),
    summary: text('summary').notNull(),
    debaitedHeading: text('debaited_heading'),
    debaitedSummary: text('debaited_summary'),
  },
  (t) => [uniqueIndex('idx_publisher_pathname').on(t.publisherId, t.pathname)]
)

export const articlesRelations = relations(articles, ({ one }) => ({
  publisher: one(publishers, {
    fields: [articles.publisherId], // Local foreign key
    references: [publishers.id], // Target primary key
  }),
}))

export const articlesInsertSchema = createInsertSchema(articles)
export const articlesSelectSchema = createSelectSchema(articles)
export const articlesUpdateSchema = createUpdateSchema(articles)

export type ArticleInsert = z.infer<typeof articlesInsertSchema>
export type ArticleUpdate = z.infer<typeof articlesUpdateSchema>
export type ArticleSelect = z.infer<typeof articlesSelectSchema>
export type Article = PartialOnNull<ArticleSelect>

type PartialOnNull<T> = PartialOnUndefinedDeep<{
  [K in keyof T]: null extends T[K] ? T[K] | undefined : T[K]
}>
