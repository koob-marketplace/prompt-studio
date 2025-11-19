/**
 * Model utilities and helper functions
 */

import {
  AVAILABLE_MODELS,
  PROVIDER_MAP,
  ModelId,
  ProviderId,
  SelectedModels,
  getProviderFromModelId,
} from '../types/definitions';

/**
 * Filter selected models and return only active (non-null) model IDs
 */
export const getActiveModels = (selectedModels: SelectedModels): ModelId[] =>
  Object.values(selectedModels).filter((modelId): modelId is ModelId => modelId !== null);

/**
 * Get the count of active models
 */
export const getActiveModelCount = (selectedModels: SelectedModels): number =>
  getActiveModels(selectedModels).length;

/**
 * Get all models for a specific provider
 */
export const getProviderModels = (providerId: ProviderId) =>
  PROVIDER_MAP[providerId]?.models ?? [];

/**
 * Get model information by ID
 */
export const getModelName = (modelId: ModelId): string => {
  const model = AVAILABLE_MODELS.find(m => m.id === modelId);
  return model?.name ?? 'Unknown Model';
};

/**
 * Get provider name from model ID
 */
export const getProviderName = (modelId: ModelId): string => {
  const providerId = getProviderFromModelId(modelId);
  if (!providerId) return 'Unknown Provider';
  const provider = PROVIDER_MAP[providerId];
  return provider?.name ?? 'Unknown Provider';
};

/**
 * Get full model info with name and provider
 */
export const getFullModelInfo = (modelId: ModelId) => ({
  modelId,
  modelName: getModelName(modelId),
  providerId: getProviderFromModelId(modelId),
  providerName: getProviderName(modelId),
});

/**
 * Validate that a model ID is valid
 */
export const isValidModelId = (modelId: string): modelId is ModelId =>
  AVAILABLE_MODELS.some(m => m.id === modelId);

/**
 * Validate that a provider ID is valid
 */
export const isValidProviderId = (providerId: string): providerId is ProviderId =>
  Object.keys(PROVIDER_MAP).includes(providerId);

/**
 * Initialize empty selected models object (all providers, no selection)
 */
export const initializeSelectedModels = (): SelectedModels => {
  const result: Partial<SelectedModels> = {};
  Object.keys(PROVIDER_MAP).forEach(providerId => {
    result[providerId as ProviderId] = null;
  });
  return result as SelectedModels;
};

/**
 * Initialize empty results object for active models
 */
export const initializeResults = (activeModels: ModelId[]): Partial<Record<ModelId, any>> => {
  const results: Partial<Record<ModelId, any>> = {};
  activeModels.forEach(modelId => {
    results[modelId] = { output: '', isLoading: true };
  });
  return results;
};

/**
 * Format model display name with provider
 */
export const formatModelDisplay = (modelId: ModelId): string => {
  const info = getFullModelInfo(modelId);
  return `${info.modelName} (${info.providerName})`;
};

/**
 * Sort models by provider name, then by model name
 */
export const sortModelsByProvider = (models: ModelId[]): ModelId[] =>
  models.sort((a, b) => {
    const providerA = getProviderName(a);
    const providerB = getProviderName(b);

    if (providerA !== providerB) {
      return providerA.localeCompare(providerB);
    }

    const nameA = getModelName(a);
    const nameB = getModelName(b);
    return nameA.localeCompare(nameB);
  });

