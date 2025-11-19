'use server'

import { ApiResponse, CreatePromptInput, UpdatePromptInput } from '@/lib/backend/types'
import * as validators from '@/lib/backend/validators'
import * as promptService from '@/lib/backend/services/prompt.service'
import { requireAuth } from '@/lib/backend/guards'
import { handleError } from '@/lib/backend/utils/error.utils'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import {
  isErrorResponse,
  isSuccessResponse,
} from "@/lib/backend/utils/response.utils";

/**
 * Prompt Server Actions
 */

export async function createPromptAction(
  input: CreatePromptInput
): Promise<ApiResponse> {
  try {
    const auth = await requireAuth()
    const validated = validators.createPromptSchema.parse(input)
    const prompt = await promptService.createPrompt(auth.userId, validated)

    return {
      success: true,
      data: prompt,
    }
  } catch (error) {
    return handleError(error)
  }
}

export async function getPromptAction(promptId: string): Promise<ApiResponse> {
  try {
    const auth = await requireAuth()
    const prompt = await promptService.getPrompt(auth.userId, promptId)

    return {
      success: true,
      data: prompt,
    }
  } catch (error) {
    return handleError(error)
  }
}

export async function listPromptsAction(): Promise<ApiResponse> {
  try {
    const auth = await requireAuth()
    const prompts = await promptService.listPrompts(auth.userId)

    return {
      success: true,
      data: prompts,
    }
  } catch (error) {
    return handleError(error)
  }
}

export async function updatePromptAction(
  promptId: string,
  input: UpdatePromptInput
): Promise<ApiResponse> {
  try {
    const auth = await requireAuth()
    const validated = validators.updatePromptSchema.parse(input)
    const prompt = await promptService.updatePrompt(auth.userId, promptId, validated)

    return {
      success: true,
      data: prompt,
    }
  } catch (error) {
    return handleError(error)
  }
}

export async function deletePromptAction(promptId: string): Promise<ApiResponse> {
  try {
    const auth = await requireAuth()
    validators.deletePromptSchema.parse({ id: promptId })
    await promptService.deletePrompt(auth.userId, promptId)

    return {
      success: true,
      data: { message: 'Prompt deleted successfully' },
    }
  } catch (error) {
    return handleError(error)
  }
}

export async function createPromptFromTemplate(formData: FormData) {
  try {
    const auth = await requireAuth()

    const name = formData.get('name') as string
    const content = formData.get('content') as string

    // Le contenu vient d'un template de confiance, mais une validation de base est une bonne pratique
    const validatedInput: CreatePromptInput = {
      title: name,
      content: content,
      json: {},
    }

    // Valider avec le schéma existant pour assurer la cohérence
    const validated = validators.createPromptSchema.parse(validatedInput)

    const prompt = await promptService.createPrompt(auth.userId, validated)

    // Invalider le cache pour la page des prompts si elle existe
    revalidatePath('/dashboard/prompts')

    // Rediriger vers la page d'édition du nouveau prompt
    redirect(`/dashboard/prompts/${prompt.id}`)
  } catch (error) {
    // Re-throw redirect errors - Next.js handles them internally
    if (error instanceof Error && (error as any).digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    // En cas d'erreur réelle, retourner une erreur gérable
    return handleError(error)
  }
}

export async function createEmptyPrompt() {
  const user = await requireAuth();

  const result = await promptService.createPrompt(user.userId, {
    title: "",
    content: ""
  });

  revalidatePath("/prompts");
  redirect(`/dashboard/prompts/${result.id}`);
}

export async function getPromptById(id: string) {
  const user = await requireAuth();
}

