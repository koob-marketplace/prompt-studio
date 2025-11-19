import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

import { DEFAULT_TEMPERATURE } from '../constants';
import type { ProviderImplementation } from '../types';

const normalizeModelId = (modelId: string) =>
  modelId.startsWith('models/') ? modelId : `models/${modelId}`;

export const googleProvider: ProviderImplementation = {
  id: 'google',
  name: 'Google',
  models: [
    // Latest and Most Advanced Models
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
    { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite' },
    { id: 'gemini-2.0-flash-live-001', name: 'Gemini 2.0 Flash Live 001' },

    // Previous Generations
    { id: 'gemini-pro', name: 'Gemini Pro' },
    { id: 'gemini-pro-vision', name: 'Gemini Pro Vision' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' }
  ],
  runStream: async ({ prompt, modelId, apiKey }) => {
    const client = createGoogleGenerativeAI({ apiKey });
    return streamText({
      model: client(normalizeModelId(modelId)),
      prompt,
      temperature: DEFAULT_TEMPERATURE,
    });
  },
};

