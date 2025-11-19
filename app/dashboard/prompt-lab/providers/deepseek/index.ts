import { streamText } from 'ai';
import { createDeepSeek } from '@ai-sdk/deepseek';

import { DEFAULT_TEMPERATURE } from '../constants';
import type { ProviderImplementation } from '../types';

export const deepseekProvider: ProviderImplementation = {
  id: 'deepseek',
  name: 'DeepSeek',
  models: [
    { id: 'deepseek-chat', name: 'DeepSeek V3' },
    { id: 'deepseek-reasoner', name: 'DeepSeek R1' },
  ],
  runStream: async ({ prompt, modelId, apiKey }) => {
    const deepseek = createDeepSeek({
      apiKey,
    });

    return streamText({
      model: deepseek(modelId),
      prompt,
      temperature: DEFAULT_TEMPERATURE,
    });
  },
};

