import { pgTable, text, timestamp, uuid, pgEnum, uniqueIndex } from 'drizzle-orm/pg-core'
import { authUsers } from './users'

export const providerEnum = pgEnum('provider', [
  'openai',
  'cohere',
  'mistral',
  'google',
  'deepseek',
  'xai',
  'anthropic',
])

export const userApiKeys = pgTable(
  'user_api_keys',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => authUsers.id, {
        onDelete: 'cascade',
        onUpdate: 'no action',
      }),
    providerId: providerEnum('provider_id').notNull(),
    encryptedApiKey: text('encrypted_api_key').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userId_providerId_unique_idx: uniqueIndex('user_id_provider_id_unique_idx').on(
      table.userId,
      table.providerId
    ),
  })
)
