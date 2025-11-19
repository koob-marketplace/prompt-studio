import { 
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { authUsers } from "./users";

export const prompts = pgTable(
  "prompts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => authUsers.id, {
        onDelete: "cascade",
        onUpdate: "no action",
      }),
    title: text("title").notNull(),
    content: text("content").notNull(),
    json: jsonb("json"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    // Performance index
    userIdIdx: index("user_id_idx").on(table.userId),
  })
);
