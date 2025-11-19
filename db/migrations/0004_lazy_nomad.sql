DO $$ BEGIN
 CREATE TYPE "public"."provider" AS ENUM('openai', 'cohere', 'mistral', 'google', 'meta', 'xai', 'anthropic');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user_api_keys" ALTER COLUMN "provider_id" SET DATA TYPE provider;