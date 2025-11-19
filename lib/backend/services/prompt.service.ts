import {
  PromptOutput,
  CreatePromptInput,
  UpdatePromptInput,
} from '@/lib/backend/types'
import * as promptRepository from '@/lib/backend/repositories/prompt.repository'
import { requirePromptOwnership } from '@/lib/backend/guards'

/**
 * Prompt Service
 * Business logic for prompt operations
 */

export async function createPrompt(
  userId: string,
  input: CreatePromptInput
): Promise<PromptOutput> {
  const prompt = await promptRepository.createPrompt(userId, input)
  return prompt
}

export async function getPrompt(
  userId: string,
  promptId: string
): Promise<PromptOutput> {
  await requirePromptOwnership(userId, promptId)
  const prompt = await promptRepository.getPromptById(promptId)
  return prompt
}

export async function listPrompts(userId: string): Promise<PromptOutput[]> {
  const prompts = await promptRepository.getPromptsByUserId(userId)
  return prompts
}

export async function updatePrompt(
  userId: string,
  promptId: string,
  input: UpdatePromptInput
): Promise<PromptOutput> {
  await requirePromptOwnership(userId, promptId)
  const prompt = await promptRepository.updatePrompt(promptId, input)
  return prompt
}

export async function deletePrompt(userId: string, promptId: string): Promise<void> {
  await requirePromptOwnership(userId, promptId)
  await promptRepository.deletePrompt(promptId)
}


