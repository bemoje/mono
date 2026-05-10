import { createInsertSchema } from 'drizzle-zod'
import { createSelectSchema } from 'drizzle-zod'
import { createUpdateSchema } from 'drizzle-zod'
import { integer } from 'drizzle-orm/pg-core'
import { pgTable } from 'drizzle-orm/pg-core'
import { serial } from 'drizzle-orm/pg-core'
import { text } from 'drizzle-orm/pg-core'
import { timestamp } from 'drizzle-orm/pg-core'

export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  origin: text('origin').notNull(),
  pathname: text('pathname').notNull(),
  time: integer('time').notNull(),
  heading: text('heading').notNull(),
  summary: text('summary'),
})

export const userEvents = pgTable('user_events', {
  id: serial('id').primaryKey(),
  timestamp: timestamp('timestamp', { mode: 'date' }).notNull(),
  event: text('event').notNull(),
  articleId: integer('articleId').references(() => articles.id),
})

export const articlesInsertSchema = createInsertSchema(articles)
export const articlesSelectSchema = createSelectSchema(articles)
export const articlesUpdateSchema = createUpdateSchema(articles)
export const userEventsInsertSchema = createInsertSchema(userEvents)
export const userEventsSelectSchema = createSelectSchema(userEvents)
export const userEventsUpdateSchema = createUpdateSchema(userEvents)
