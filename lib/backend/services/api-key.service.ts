import {
  ApiKeyOutput,
  CreateApiKeyInput,
  UpdateApiKeyInput,
} from '@/lib/backend/types'
import * as apiKeyRepository from '@/lib/backend/repositories/api-key.repository'
import { requireApiKeyOwnership } from '@/lib/backend/guards'
import { encrypt, decrypt } from '@/lib/security/encryption'

/**
 * API Key Service
 */

export async function createApiKey(
  userId: string,
  input: CreateApiKeyInput
): Promise<ApiKeyOutput> {
  const encryptedApiKey = await encrypt(input.apiKey)
  const apiKey = await apiKeyRepository.createApiKey(userId, {
    ...input,
    apiKey: encryptedApiKey,
  })
  return apiKey
}

export async function getApiKey(userId: string, apiKeyId: string): Promise<ApiKeyOutput> {
  await requireApiKeyOwnership(userId, apiKeyId)
  const apiKey = await apiKeyRepository.getApiKeyById(apiKeyId)
  return apiKey
}

export async function getDecryptedApiKey(userId: string, apiKeyId: string): Promise<string> {
  await requireApiKeyOwnership(userId, apiKeyId)
  const apiKey = await apiKeyRepository.getApiKeyById(apiKeyId)
  const decryptedApiKey = await decrypt(apiKey.encryptedApiKey)
  return decryptedApiKey
}

export async function listApiKeys(userId: string): Promise<ApiKeyOutput[]> {
  const apiKeys = await apiKeyRepository.getApiKeysByUserId(userId)
  return apiKeys
}

export async function updateApiKey(
  userId: string,
  apiKeyId: string,
  input: UpdateApiKeyInput
): Promise<ApiKeyOutput> {
  await requireApiKeyOwnership(userId, apiKeyId)
  const encryptedInput = input.apiKey ? { ...input, apiKey: await encrypt(input.apiKey) } : input
  const apiKey = await apiKeyRepository.updateApiKey(apiKeyId, encryptedInput)
  return apiKey
}

export async function deleteApiKey(userId: string, apiKeyId: string): Promise<void> {
  await requireApiKeyOwnership(userId, apiKeyId)
  await apiKeyRepository.deleteApiKey(apiKeyId)
}

