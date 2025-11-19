import { db } from '@/db'
import { userApiKeys } from '@/db/user-api-keys'
import { eq, and } from 'drizzle-orm'
import {
  ApiKeyOutput,
  CreateApiKeyInput,
  UpdateApiKeyInput,
  NotFoundError,
} from '@/lib/backend/types'

/**
 * API Key Repository
 */

export async function createApiKey(
  userId: string,
  data: CreateApiKeyInput & { apiKey: string }
): Promise<ApiKeyOutput> {
  const [apiKey] = await db
    .insert(userApiKeys)
    .values({
      userId,
      providerId: data.providerId,
      encryptedApiKey: data.apiKey,
    })
    .returning()

  if (!apiKey) {
    throw new Error('Failed to create API key')
  }

  return mapApiKeyResponse(apiKey)
}

export async function getApiKeyById(id: string): Promise<ApiKeyOutput & { encryptedApiKey: string }> {
  const apiKey = await db.query.userApiKeys.findFirst({
    where: eq(userApiKeys.id, id),
  })

  if (!apiKey) {
    throw new NotFoundError('API key not found')
  }

  return mapApiKeyResponse(apiKey) as ApiKeyOutput & { encryptedApiKey: string }
}

export async function getApiKeysByUserId(userId: string): Promise<ApiKeyOutput[]> {
  const apiKeys = await db.query.userApiKeys.findMany({
    where: eq(userApiKeys.userId, userId),
    orderBy: (keys, { desc }) => [desc(keys.createdAt)],
  })

  return apiKeys.map(mapApiKeyResponse)
}

export async function updateApiKey(
  id: string,
  data: UpdateApiKeyInput & { apiKey?: string }
): Promise<ApiKeyOutput> {
  const updateData: { encryptedApiKey?: string; updatedAt: Date } = {
    updatedAt: new Date(),
  }
  if (data.apiKey) {
    updateData.encryptedApiKey = data.apiKey
  }

  const [apiKey] = await db
    .update(userApiKeys)
    .set(updateData)
    .where(eq(userApiKeys.id, id))
    .returning()

  if (!apiKey) {
    throw new NotFoundError('API key not found')
  }

  return mapApiKeyResponse(apiKey)
}

export async function deleteApiKey(id: string): Promise<void> {
  await db.delete(userApiKeys).where(eq(userApiKeys.id, id))
}

/**
 * Response mapper - transform database object to output type
 */
function mapApiKeyResponse(data: unknown): ApiKeyOutput {
  const apiKey = data as Record<string, unknown>
  return {
    id: String(apiKey.id),
    userId: String(apiKey.userId),
    providerId: String(apiKey.providerId),
    createdAt: new Date(apiKey.createdAt as string),
    updatedAt: new Date(apiKey.updatedAt as string),
    ...(apiKey.encryptedApiKey ? { encryptedApiKey: String(apiKey.encryptedApiKey) } : {}),
  }
}

