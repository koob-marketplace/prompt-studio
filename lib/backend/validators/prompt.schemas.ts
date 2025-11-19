import { z } from 'zod'

/**
 * Prompt Schemas
 */

// Base schema for prompt ID
const promptIdSchema = z.object({
  id: z.string().uuid(),
})

// Schema for creating a prompt
export const createPromptSchema = z.object({
  title: z.string(),
  content: z.any(),
  json: z.record(z.string(), z.any()).optional(),
})

// Schema for updating a prompt
export const updatePromptSchema = z.object({
  title: z.string().optional(),
  content: z.any().optional(),
  json: z.record(z.string(), z.any()).optional(),
})

// Schema for deleting a prompt
export const deletePromptSchema = promptIdSchema

// TypeScript types inferred from schemas
export type CreatePrompt = z.infer<typeof createPromptSchema>
export type UpdatePrompt = z.infer<typeof updatePromptSchema>
export type DeletePrompt = z.infer<typeof deletePromptSchema>

