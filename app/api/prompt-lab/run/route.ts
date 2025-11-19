import { z } from 'zod';

import { createClient } from '@/lib/supabase/server';
import { createPromptLabStream } from '@/app/dashboard/prompt-lab/server/prompt-stream';
import { getProviderApiKey } from '@/app/dashboard/prompt-lab/server/get-provider-api-key';
import {
  getProviderFromModelId,
  type ModelId,
  type ProviderId,
} from '@/app/dashboard/prompt-lab/types/definitions';
import { isValidModelId } from '@/app/dashboard/prompt-lab/utils/models';

const RunPromptSchema = z.object({
  modelId: z
    .string()
    .refine(isValidModelId, 'Unsupported model'),
  prompt: z.string().min(1, 'Prompt is required'),
});

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { modelId: rawModelId, prompt } = RunPromptSchema.parse(payload);

    const modelId = rawModelId as ModelId;
    const providerId = getProviderFromModelId(modelId) as ProviderId | undefined;

    if (!providerId) {
      return new Response(JSON.stringify({ error: 'Unable to determine provider for model' }), {
        status: 400,
      });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const apiKey = await getProviderApiKey(supabase, user.id, providerId);
    const stream = await createPromptLabStream({
      providerId,
      modelId,
      prompt,
      apiKey,
    });

    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': 'application/x-ndjson; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: error.issues[0]?.message ?? 'Invalid payload' }), {
        status: 400,
      });
    }

    console.error('[PromptLab] Failed to run prompt:', error);
    const message = error instanceof Error ? error.message : 'Failed to run prompt';

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
    });
  }
}

