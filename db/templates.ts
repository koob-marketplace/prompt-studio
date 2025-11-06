import { pgTable, serial, text, timestamp, jsonb } from 'drizzle-orm/pg-core'

export const templates = pgTable('templates', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  json: jsonb('json').notNull(),
  markdown: text('markdown').notNull(),
  slug: text('slug').unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

