import { streamText } from 'ai';
import { createCohere } from '@ai-sdk/cohere';

import { DEFAULT_TEMPERATURE } from '../constants';
import type { ProviderImplementation } from '../types';

export const cohereProvider: ProviderImplementation = {
  id: 'cohere',
  name: 'Cohere',
  models: [
    // Latest and Most Advanced Models
    { id: 'cohere.command-a-03-2025', name: 'Command A (March 2025) - 111B Params' },
    { id: 'cohere.command-a-reasoning-08-2025', name: 'Command A Reasoning (Advanced)' },

    // High-Performance Models
    { id: 'cohere.command-r-plus', name: 'Command R Plus' },
    { id: 'cohere.command-r-08-2024', name: 'Command R (August 2024)' },
    { id: 'cohere.command-r7b-12-2024', name: 'Command R7B (December 2024)' },

    // Previous Generations
    { id: 'cohere.command-r', name: 'Command R' },
    { id: 'cohere.command', name: 'Command' }
  ],
  runStream: async ({ prompt, modelId, apiKey }) => {
    const client = createCohere({ apiKey });
    return streamText({
      model: client(modelId),
      prompt,
      temperature: DEFAULT_TEMPERATURE,
    });
  },
};

