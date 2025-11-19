import { streamText } from 'ai';
import { createMistral } from '@ai-sdk/mistral';

import { DEFAULT_TEMPERATURE } from '../constants';
import type { ProviderImplementation } from '../types';

export const mistralProvider: ProviderImplementation = {
  id: 'mistral',
  name: 'Mistral',
  models: [
    // Latest and Most Advanced Models
    { id: 'mistral-large-2411', name: 'Mistral Large (24.11)' },
    { id: 'mistral-large-latest', name: 'Mistral Large (Latest)' },

    // Medium and Small Models
    { id: 'mistral-medium-3', name: 'Mistral Medium 3' },
    { id: 'mistral-medium-latest', name: 'Mistral Medium (Latest)' },
    { id: 'mistral-small-3200', name: 'Mistral Small 3.2' },
    { id: 'mistral-small-2503', name: 'Mistral Small 3.1 (25.03)' },
    { id: 'mistral-small-latest', name: 'Mistral Small' },
    { id: 'mistral-tiny', name: 'Mistral Tiny' },

    // Open Source and Specialized Models
    { id: 'mistral-7b', name: 'Mistral 7B' },
    { id: 'open-mistral-7b', name: 'Open Mistral 7B' },
    { id: 'mistral-8x7b', name: 'Mistral 8x7B' },
    { id: 'mixtral-8x22b', name: 'Mixtral 8x22B' }
  ],
  runStream: async ({ prompt, modelId, apiKey }) => {
    const client = createMistral({ apiKey });
    return streamText({
      model: client(modelId),
      prompt,
      temperature: DEFAULT_TEMPERATURE,
    });
  },
};

