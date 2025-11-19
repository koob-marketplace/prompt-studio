import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

import { DEFAULT_TEMPERATURE } from '../constants';
import type { ProviderImplementation } from '../types';

export const xaiProvider: ProviderImplementation = {
  id: 'xai',
  name: 'XAI (Grok)',
  models: [
    // Latest Models
    { id: 'grok-4-0709', name: 'Grok 4' },
    { id: 'grok-3', name: 'Grok 3' },
    { id: 'grok-3-mini', name: 'Grok 3 Mini' },

    // Previous Generations
    { id: 'grok-2', name: 'Grok 2' },
    { id: 'grok-2-vision', name: 'Grok 2 Vision' },
    { id: 'grok-1', name: 'Grok 1' }
  ],
  runStream: async ({ prompt, modelId, apiKey }) => {
    const client = createOpenAI({
      apiKey,
      baseURL: 'https://api.x.ai/v1',
    });

    return streamText({
      model: client(modelId),
      prompt,
      temperature: DEFAULT_TEMPERATURE,
    });
  },
};

