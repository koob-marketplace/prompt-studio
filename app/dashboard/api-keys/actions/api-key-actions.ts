'use server'

import { CreateApiKeyInput, UpdateApiKeyInput } from '@/lib/backend/types'
import {
  createApiKeyAction,
  deleteApiKeyAction,
  getDecryptedApiKeyAction,
  listApiKeysAction,
  updateApiKeyAction,
} from '@/lib/backend/actions/api-key.actions'

/**
 * Fetch all API keys for the current user
 */
export async function fetchUserApiKeys() {
  return await listApiKeysAction()
}

/**
 * Add a new API key for the current user
 */
export async function addApiKey(input: CreateApiKeyInput) {
  return await createApiKeyAction(input)
}

/**
 * Update an existing API key
 */
export async function updateApiKey(apiKeyId: string, input: UpdateApiKeyInput) {
  return await updateApiKeyAction(apiKeyId, input)
}

/**
 * Delete an API key
 */
export async function deleteApiKey(input: { apiKeyId: string }) {
  return await deleteApiKeyAction(input.apiKeyId)
}

/**
 * Get a decrypted API key
 */
export async function getDecryptedApiKey(apiKeyId: string) {
  return await getDecryptedApiKeyAction(apiKeyId)
}

