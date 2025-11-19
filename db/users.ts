import {
    pgTable,
    text,
    timestamp,
    uuid,
    pgSchema,
    uniqueIndex,
  } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";


  // This defines a representation of Supabase's `auth.users` table
  // so we can establish a foreign key relationship to it.
  const auth = pgSchema("auth");
  export const authUsers = auth.table("users", {
    id: uuid("id").primaryKey(),
  });
  
  /**
   * This table holds our application's specific user data.
   * It is linked one-to-one with Supabase's `auth.users` table.
   */
  export const users = pgTable(
    "users",
    {
      id: uuid("id")
        .primaryKey()
        .references(() => authUsers.id, {
          onDelete: "cascade",
          onUpdate: "no action",
        }),
      name: text("name"),
      email: text("email").notNull(),
      avatarUrl: text("avatar_url"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => ({
      emailIdx: uniqueIndex("email_idx").on(table.email),
    })
  );
  