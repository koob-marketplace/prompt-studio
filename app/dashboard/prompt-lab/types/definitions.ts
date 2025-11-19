/**
 * Comprehensive AI Models & Providers Definition
 * This file contains the COMPLETE list of all supported AI models across all providers
 */

import { PROVIDERS as PROVIDER_CONFIGS } from '../providers';

// ============================================================================
// PROVIDER CONSTANTS - Complete list of ALL providers and their models
// ============================================================================

export const PROVIDERS = PROVIDER_CONFIGS;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Represents a single model object
 */
type Model = typeof PROVIDERS[number]['models'][number];

/**
 * Provider ID type - discriminated union of all provider IDs
 */
export type ProviderId = typeof PROVIDERS[number]['id'];

/**
 * Model ID type - discriminated union of all model IDs
 * Union of all possible model IDs across all providers
 */
export type ModelId = Model['id'];

/**
 * Complete model information including provider context
 */
export interface ModelInfo {
  id: ModelId;
  name: string;
  providerId: ProviderId;
  providerName: string;
}

/**
 * Represents the state of selected models
 * Maps provider IDs to their selected model ID (or null if none selected)
 */
export type SelectedModels = Record<ProviderId, ModelId | null>;

/**
 * Token usage information from API response
 */
export interface TokenUsage {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
}

/**
 * Represents the result of a single model execution
 */
export interface ModelResult {
  output: string;
  isLoading: boolean;
  error?: string;
  tokenUsage?: TokenUsage;
}

/**
 * Represents the state of all results from model tests
 * Maps model IDs to their execution results
 */
export type ResultState = Record<ModelId, ModelResult>;

// ============================================================================
// UTILITY CONSTANTS & FUNCTIONS
// ============================================================================

/**
 * Flattened array of all available models with provider context
 */
export const AVAILABLE_MODELS: readonly ModelInfo[] = PROVIDERS.flatMap(provider =>
  provider.models.map(model => ({
    ...model,
    providerId: provider.id,
    providerName: provider.name,
  }))
);

/**
 * Map of provider IDs to provider objects for quick lookup
 */
export const PROVIDER_MAP = Object.fromEntries(
  PROVIDERS.map(provider => [provider.id, provider])
) as Record<ProviderId, typeof PROVIDERS[number]>;

/**
 * Get a provider by ID
 */
export const getProviderById = (providerId: ProviderId) => PROVIDER_MAP[providerId];

/**
 * Get a model's full information by model ID
 */
export const getModelInfo = (modelId: ModelId): ModelInfo | undefined =>
  AVAILABLE_MODELS.find(m => m.id === modelId);

/**
 * Get provider name from model ID
 */
export const getProviderFromModelId = (modelId: ModelId): ProviderId | undefined =>
  getModelInfo(modelId)?.providerId;

/**
 * Check if a model ID belongs to a specific provider
 */
export const isModelFromProvider = (modelId: ModelId, providerId: ProviderId): boolean =>
  getProviderFromModelId(modelId) === providerId;
