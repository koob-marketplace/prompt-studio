import { createClient } from '@/lib/supabase/server'
import {
  PromptOutput,
  CreatePromptInput,
  UpdatePromptInput,
  NotFoundError,
} from '@/lib/backend/types'
import { db } from '@/db'
import { prompts } from '@/db/prompts'

/**
 * Prompt Repository
 * Handles all prompt-related database operations
 */

export async function createPrompt(
  userId: string,
  data: CreatePromptInput
): Promise<PromptOutput> {
  const [newPrompt] = await db
    .insert(prompts)
    .values({
      userId: userId,
      title: data.title,
      content: data.content as any, // Drizzle expects a string, but content can be an object
      json: data.json,
    })
    .returning()

  if (!newPrompt) {
    throw new Error(`Failed to create prompt`)
  }

  return mapPromptResponse(newPrompt)
}

export async function getPromptById(id: string): Promise<PromptOutput> {
  const supabase = await createClient()

  const { data: prompt, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !prompt) {
    throw new NotFoundError('Prompt not found')
  }

  return mapPromptResponse(prompt)
}

export async function getPromptsByUserId(userId: string): Promise<PromptOutput[]> {
  const supabase = await createClient()

  const { data: prompts, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch prompts: ${error.message}`)
  }

  return prompts.map(mapPromptResponse)
}

export async function updatePrompt(
  id: string,
  data: UpdatePromptInput
): Promise<PromptOutput> {
  const supabase = await createClient()

  const updateData: Record<string, unknown> = {}
  if (data.title !== undefined) updateData.title = data.title
  if (data.content !== undefined) updateData.content = data.content
  if (data.json !== undefined) updateData.json = data.json

  const { data: prompt, error } = await supabase
    .from('prompts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error || !prompt) {
    throw new NotFoundError('Prompt not found')
  }

  return mapPromptResponse(prompt)
}

export async function deletePrompt(id: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase.from('prompts').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete prompt: ${error.message}`)
  }
}

/**
 * Response mapper - transform database object to output type
 */
function mapPromptResponse(data: unknown): PromptOutput {
  const prompt = data as any
  return {
    id: String(prompt.id),
    userId: String(prompt.userId || prompt.user_id),
    title: String(prompt.title),
    content: String(prompt.content),
    json: prompt.json as Record<string, unknown>,
    createdAt: new Date(prompt.createdAt || prompt.created_at),
    updatedAt: new Date(prompt.updatedAt || prompt.updated_at),
  }
}

