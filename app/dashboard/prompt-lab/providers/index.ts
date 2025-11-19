import type { ProviderImplementation } from './types';

import { anthropicProvider } from './anthropic';
import { cohereProvider } from './cohere';
import { deepseekProvider } from './deepseek';
import { googleProvider } from './google';
import { mistralProvider } from './mistral';
import { openAIProvider } from './openai';
import { xaiProvider } from './xai';

const providerList = [
  openAIProvider,
  anthropicProvider,
  googleProvider,
  mistralProvider,
  xaiProvider,
  deepseekProvider,
  cohereProvider,
] as const;

export const PROVIDERS = providerList;

export const PROVIDER_REGISTRY = PROVIDERS.reduce<Record<string, ProviderImplementation>>(
  (registry, provider) => {
    registry[provider.id] = provider;
    return registry;
  },
  {}
);

export const getProviderDefinition = (providerId: string) => PROVIDER_REGISTRY[providerId];
