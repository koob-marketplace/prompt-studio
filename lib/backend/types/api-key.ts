import { providerEnum } from '@/db/user-api-keys'

/**
 * Generic Result Type for consistent error handling
 */
export interface Result<T> {
  success: boolean;
  data?: T | null;
  error?: { message: string };
}

/**
 * API Key Types
 */
export interface CreateApiKeyInput {
  providerId: typeof providerEnum.enumValues[number]
  apiKey: string
}

export interface UpdateApiKeyInput {
  apiKeyId: string;
  apiKey: string;
}

export interface ApiKeyOutput {
  id: string;
  userId: string;
  providerId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Specific result type for API Keys
export type ApiKeyResult = Result<ApiKeyOutput | ApiKeyOutput[]>