import type { SupabaseClient } from '@supabase/supabase-js';

import { decrypt } from '@/lib/security/encryption';

import { ProviderId } from '../types/definitions';

export async function getProviderApiKey(
  supabase: SupabaseClient,
  userId: string,
  providerId: ProviderId
): Promise<string> {
  const { data, error } = await supabase
    .from('user_api_keys')
    .select('encrypted_api_key')
    .eq('user_id', userId)
    .eq('provider_id', providerId)
    .single();

  if (error || !data) {
    throw new Error(
      `Missing ${providerId.toUpperCase()} API key. Configure it in API Settings.`
    );
  }

  return decrypt(data.encrypted_api_key);
}


