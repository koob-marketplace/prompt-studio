import type { ProviderId, ModelId, TokenUsage } from '../types/definitions';
import { getProviderDefinition } from '../providers';

import type { ProviderRunner } from '../providers/types';

const encoder = new TextEncoder();

type RunnerParams = {
  providerId: ProviderId;
  modelId: ModelId;
  prompt: string;
  apiKey: string;
};

export async function createPromptLabStream({
  providerId,
  modelId,
  prompt,
  apiKey,
}: RunnerParams): Promise<ReadableStream<Uint8Array>> {
  const provider = getProviderDefinition(providerId);

  if (!provider) {
    throw new Error(`Unsupported provider: ${providerId}`);
  }

  const streamResult = await provider.runStream({
    modelId,
    prompt,
    apiKey,
  });
  const usagePromise = safeGetUsage(streamResult);

  return convertResultToStream(streamResult, modelId, usagePromise);
}

function convertResultToStream(
  streamResult: Awaited<ReturnType<ProviderRunner>>,
  modelId: ModelId,
  usagePromise: Promise<TokenUsage | undefined>
): ReadableStream<Uint8Array> {
  return new ReadableStream({
    async start(controller) {
      let accumulated = '';

      try {
        for await (const chunk of streamResult.textStream) {
          if (typeof chunk !== 'string' || chunk.length === 0) {
            continue;
          }

          console.log('[PromptLab stream chunk]', JSON.stringify(chunk));

          let delta = chunk;

          // Some providers emit full cumulative text per chunk instead of deltas.
          // Detect that pattern and only forward the new portion.
          if (chunk.length >= accumulated.length && chunk.startsWith(accumulated)) {
            delta = chunk.slice(accumulated.length);
            accumulated = chunk;
          } else {
            accumulated += chunk;
          }

          if (delta.length === 0) {
            continue;
          }

          controller.enqueue(
            encodeEvent({
              type: 'text',
              modelId,
              data: delta,
            })
          );
        }

        const usage = await resolveWithTimeout(usagePromise, 1000);
        if (usage) {
          controller.enqueue(
            encodeEvent({
              type: 'usage',
              modelId,
              data: usage,
            })
          );
        }

        controller.enqueue(
          encodeEvent({
            type: 'done',
            modelId,
          })
        );
      } catch (error) {
        controller.enqueue(
          encodeEvent({
            type: 'error',
            modelId,
            data: error instanceof Error ? error.message : 'Unknown stream error',
          })
        );
      } finally {
        controller.close();
      }
    },
  });
}

async function safeGetUsage(
  streamResult: Awaited<ReturnType<ProviderRunner>>
): Promise<TokenUsage | undefined> {
  try {
    const usage = await streamResult.usage;

    if (!usage) {
      return undefined;
    }

    return {
      promptTokens: usage.inputTokens || usage.inputTokens,
      completionTokens: usage.outputTokens || usage.outputTokens,
      totalTokens: usage.totalTokens,
    };
  } catch {
    return undefined;
  }
}

async function resolveWithTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T | undefined> {
  return Promise.race([
    promise,
    new Promise<undefined>(resolve => {
      setTimeout(() => resolve(undefined), timeoutMs);
    }),
  ]);
}

type PromptLabStreamEvent =
  | { type: 'text'; modelId: ModelId; data: string }
  | { type: 'usage'; modelId: ModelId; data: TokenUsage }
  | { type: 'done'; modelId: ModelId }
  | { type: 'error'; modelId: ModelId; data: string };

function encodeEvent(event: PromptLabStreamEvent): Uint8Array {
  return encoder.encode(`${JSON.stringify(event)}\n`);
}

