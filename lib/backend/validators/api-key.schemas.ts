import { z } from 'zod'
import { providerEnum } from '@/db/user-api-keys'

/**
 * API Key Validators
 */

export const createApiKeySchema = z.object({
  providerId: z.enum(providerEnum.enumValues),
  apiKey: z.string().min(1, 'API key is required'),
})

export const updateApiKeySchema = z.object({
  apiKey: z.string().min(1, 'API key is required').optional(),
})

export const deleteApiKeySchema = z.object({
  id: z.string().uuid('Invalid API key ID'),
})

export type CreateApiKeySchema = z.infer<typeof createApiKeySchema>
export type UpdateApiKeySchema = z.infer<typeof updateApiKeySchema>
export type DeleteApiKeySchema = z.infer<typeof deleteApiKeySchema>

