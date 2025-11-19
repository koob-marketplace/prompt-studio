DO $$ BEGIN
 CREATE TYPE "provider" AS ENUM('openai', 'cohere', 'mistral', 'google', 'meta', 'xai', 'anthropic');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
ALTER TABLE "user_api_keys" ALTER COLUMN "provider_id" TYPE "provider" USING "provider_id"::"provider";
