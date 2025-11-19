-- This migration adds Row Level Security policies to the database.

-- Enable RLS and define policies for the 'users' table
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_select_own_data" ON "users"
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "user_update_own_data" ON "users"
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "user_delete_own_data" ON "users"
  FOR DELETE
  USING (auth.uid() = id);

-- Enable RLS and define policies for the 'user_api_keys' table
ALTER TABLE "user_api_keys" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_manage_own_api_keys" ON "user_api_keys"
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Enable RLS and define policies for the 'prompts' table
ALTER TABLE "prompts" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_manage_own_prompts" ON "prompts"
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Enable RLS and define policies for the 'templates' table
ALTER TABLE "templates" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_templates_read_access" ON "templates"
  FOR SELECT
  USING (true);
