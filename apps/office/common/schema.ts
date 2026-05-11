import { createInsertSchema } from 'drizzle-zod'
import { createSelectSchema } from 'drizzle-zod'
import { createUpdateSchema } from 'drizzle-zod'
import { crudPolicy } from 'drizzle-orm/neon'
import { integer } from 'drizzle-orm/pg-core'
import { pgRole } from 'drizzle-orm/pg-core'
import { pgTable } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { text } from 'drizzle-orm/pg-core'
import { timestamp } from 'drizzle-orm/pg-core'
import { uniqueIndex } from 'drizzle-orm/pg-core'
import { z } from 'zod'

export const guest = pgRole('guest')
export const user = pgRole('user')
export const admin = pgRole('admin')

const defaultColumns = () => ({
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
  deletedAt: timestamp('deleted_at'),
})

export const tenants = pgTable(
  'tenants',
  {
    ...defaultColumns(),
    name: text('name').unique().notNull(),
  },
  (_t) => [crudPolicy({ role: admin, read: true, modify: false })]
)

export const publishers = pgTable('publishers', {
  ...defaultColumns(),
  name: text('name').notNull(),
  // eg. https://www.dr.dk
  url: text('url').unique().notNull(),
})

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

// 1. Define relations for publishers
export const publishersRelations = relations(publishers, ({ many }) => ({
  articles: many(articles), // A publisher has many articles
}))

// 2. Define relations for articles
export const articlesRelations = relations(articles, ({ one }) => ({
  publisher: one(publishers, {
    fields: [articles.publisherId], // Local foreign key
    references: [publishers.id], // Target primary key
  }),
}))

export const userEvents = pgTable('user_events', {
  ...defaultColumns(),
  event: text('event').notNull(),
  articleId: integer('article_id').references(() => articles.id),
})

export const tenantsInsertSchema = createInsertSchema(tenants)
export const tenantsSelectSchema = createSelectSchema(tenants)
export const tenantsUpdateSchema = createUpdateSchema(tenants)

export type TenantSelect = z.infer<typeof tenantsSelectSchema>
export type TenantInsert = z.infer<typeof tenantsInsertSchema>
export type TenantUpdate = z.infer<typeof tenantsUpdateSchema>

export const publishersInsertSchema = createInsertSchema(publishers)
export const publishersSelectSchema = createSelectSchema(publishers)
export const publishersUpdateSchema = createUpdateSchema(publishers)

export type PublisherSelect = z.infer<typeof publishersSelectSchema>
export type PublisherInsert = z.infer<typeof publishersInsertSchema>
export type PublisherUpdate = z.infer<typeof publishersUpdateSchema>

export const articlesInsertSchema = createInsertSchema(articles)
export const articlesSelectSchema = createSelectSchema(articles)
export const articlesUpdateSchema = createUpdateSchema(articles)

export type ArticleSelect = z.infer<typeof articlesSelectSchema>
export type ArticleInsert = z.infer<typeof articlesInsertSchema>
export type ArticleUpdate = z.infer<typeof articlesUpdateSchema>

export const userEventsInsertSchema = createInsertSchema(userEvents)
export const userEventsSelectSchema = createSelectSchema(userEvents)
export const userEventsUpdateSchema = createUpdateSchema(userEvents)

export type UserEventSelect = z.infer<typeof userEventsSelectSchema>
export type UserEventInsert = z.infer<typeof userEventsInsertSchema>
export type UserEventUpdate = z.infer<typeof userEventsUpdateSchema>
