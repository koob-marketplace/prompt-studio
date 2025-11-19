ALTER TYPE "provider" ADD VALUE 'deepseek';--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "slug_unique" ON "templates" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "prompts" USING btree ("user_id");