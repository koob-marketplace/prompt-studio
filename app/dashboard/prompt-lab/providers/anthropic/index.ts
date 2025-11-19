import { streamText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';

import { DEFAULT_TEMPERATURE } from '../constants';
import type { ProviderImplementation } from '../types';

export const anthropicProvider: ProviderImplementation = {
  id: 'anthropic',
  name: 'Anthropic',
  models: [
    // Claude 4 Series (Most Advanced)
    { id: 'claude-opus-4-1-20250805', name: 'Claude Opus 4.1' },
    { id: 'claude-sonnet-4-5-20250929', name: 'Claude Sonnet 4.5' },
    { id: 'claude-haiku-4-5-20251001', name: 'Claude Haiku 4.5' },
    { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4' },
    { id: 'claude-opus-4-20250514', name: 'Claude Opus 4' },

    // Claude 3 Series
    { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku' },
    { id: 'claude-3-5-sonnet-20240620', name: 'Claude 3.5 Sonnet' },
    { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' }
  ],
  runStream: async ({ prompt, modelId, apiKey }) => {
    const client = createAnthropic({ apiKey });
    return streamText({
      model: client(modelId),
      prompt,
      temperature: DEFAULT_TEMPERATURE,
    });
  },
};

