'use server'

import { ApiResponse, CreateApiKeyInput, UpdateApiKeyInput } from '@/lib/backend/types'
import * as validators from '@/lib/backend/validators'
import * as apiKeyService from '@/lib/backend/services/api-key.service'
import { requireAuth } from '@/lib/backend/guards'
import { handleError } from '@/lib/backend/utils/error.utils'

/**
 * API Key Server Actions
 */

export async function createApiKeyAction(input: CreateApiKeyInput): Promise<ApiResponse> {
  try {
    const auth = await requireAuth()
    const validated = validators.createApiKeySchema.parse(input)
    const apiKey = await apiKeyService.createApiKey(auth.userId, validated)

    return {
      success: true,
      data: apiKey,
    }
  } catch (error) {
    return handleError(error)
  }
}

export async function getDecryptedApiKeyAction(apiKeyId: string): Promise<ApiResponse> {
  try {
    const auth = await requireAuth()
    const decryptedApiKey = await apiKeyService.getDecryptedApiKey(auth.userId, apiKeyId)

    return {
      success: true,
      data: decryptedApiKey,
    }
  } catch (error) {
    return handleError(error)
  }
}

export async function getApiKeyAction(apiKeyId: string): Promise<ApiResponse> {
  try {
    const auth = await requireAuth()
    const apiKey = await apiKeyService.getApiKey(auth.userId, apiKeyId)

    return {
      success: true,
      data: apiKey,
    }
  } catch (error) {
    return handleError(error)
  }
}

export async function listApiKeysAction(): Promise<ApiResponse> {
  try {
    const auth = await requireAuth()
    const apiKeys = await apiKeyService.listApiKeys(auth.userId)

    return {
      success: true,
      data: apiKeys,
    }
  } catch (error) {
    return handleError(error)
  }
}

export async function updateApiKeyAction(
  apiKeyId: string,
  input: UpdateApiKeyInput
): Promise<ApiResponse> {
  try {
    const auth = await requireAuth()
    const validated = validators.updateApiKeySchema.parse(input)
    const apiKey = await apiKeyService.updateApiKey(auth.userId, apiKeyId, {
      apiKeyId,
      ...validated,
      apiKey: validated.apiKey ?? '',
    })

    return {
      success: true,
      data: apiKey,
    }
  } catch (error) {
    return handleError(error)
  }
}

export async function deleteApiKeyAction(apiKeyId: string): Promise<ApiResponse> {
  try {
    const auth = await requireAuth()
    validators.deleteApiKeySchema.parse({ id: apiKeyId })
    await apiKeyService.deleteApiKey(auth.userId, apiKeyId)

    return {
      success: true,
      data: { message: 'API key deleted successfully' },
    }
  } catch (error) {
    return handleError(error)
  }
}

