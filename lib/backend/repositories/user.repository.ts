import { createClient } from '@/lib/supabase/server'
import { UserOutput, NotFoundError } from '@/lib/backend/types'

/**
 * User Repository
 */

export async function getUserById(id: string): Promise<UserOutput> {
  const supabase = await createClient()

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !user) {
    throw new NotFoundError('User not found')
  }

  return mapUserResponse(user)
}

/**
 * Response mapper - transform database object to output type
 */
function mapUserResponse(data: unknown): UserOutput {
  const user = data as Record<string, unknown>
  return {
    id: String(user.id),
    email: String(user.email),
    name: user.name ? String(user.name) : null,
    avatarUrl: user.avatar_url ? String(user.avatar_url) : null,
    createdAt: new Date(user.created_at as string),
    updatedAt: new Date(user.updated_at as string),
  }
}





