import type { StreamTextResult } from 'ai';

export interface ProviderModel {
  id: string;
  name: string;
}

export interface ProviderRunParams {
  prompt: string;
  modelId: string;
  apiKey: string;
}

export type ProviderRunner = (params: ProviderRunParams) => Promise<StreamTextResult<any, any>>;

export interface ProviderImplementation {
  id: string;
  name: string;
  models: readonly ProviderModel[];
  runStream: ProviderRunner;
}

