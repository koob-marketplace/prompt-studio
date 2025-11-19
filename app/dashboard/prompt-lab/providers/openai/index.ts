import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

import { DEFAULT_TEMPERATURE } from '../constants';
import type { ProviderImplementation } from '../types';

export const openAIProvider: ProviderImplementation = {
  id: 'openai',
  name: 'OpenAI',
  models: [
    // Latest and Most Advanced Models
    { id: 'gpt-5', name: 'GPT-5' },
    { id: 'gpt-5-pro', name: 'GPT-5 Pro' },
    { id: 'gpt-5-mini', name: 'GPT-5 Mini' },

    // GPT-4 Series
    { id: 'gpt-4o', name: 'GPT-4o (Latest)' },
    { id: 'gpt-4.5', name: 'GPT-4.5' },
    { id: 'gpt-4.1', name: 'GPT-4.1' },
    { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini' },
    { id: 'gpt-4.1-nano', name: 'GPT-4.1 Nano' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },

    // O Series
    { id: 'o3', name: 'O3' },
    { id: 'o3-pro', name: 'O3 Pro' },
    { id: 'o3-mini', name: 'O3 Mini' },
    { id: 'o3-mini-high', name: 'O3 Mini High' },
    { id: 'o4-mini', name: 'O4 Mini' },
    { id: 'o4-mini-high', name: 'O4 Mini High' },
  ],
  runStream: async ({ prompt, modelId, apiKey }) => {
    const client = createOpenAI({ apiKey });
    return streamText({
      model: client(modelId),
      prompt,
      temperature: DEFAULT_TEMPERATURE,
    });
  },
};

