import { createClient } from '@/lib/supabase/server';
import { User } from '@supabase/supabase-js';

/**
 * A server-side utility to get the authenticated user.
 * Throws an error if the user is not authenticated.
 * @returns {Promise<User>} The authenticated user object.
 */
export async function getAuthenticatedUser(): Promise<User> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Authentication required. Please sign in.');
  }

  return user;
}
