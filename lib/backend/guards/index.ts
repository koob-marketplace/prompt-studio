import { getAuthenticatedUser } from '@/lib/auth/utils'
import { AuthContext, UnauthorizedError, ForbiddenError, NotFoundError } from '@/lib/backend/types'
import { createClient } from '@/lib/supabase/server'

/**
 * Get authenticated user context
 * Throws UnauthorizedError if user is not authenticated
 */
export async function requireAuth(): Promise<AuthContext> {
  try {
    const user = await getAuthenticatedUser()
    return {
      user,
      userId: user.id,
      email: user.email || '',
    }
  } catch {
    throw new UnauthorizedError('You must be logged in to perform this action')
  }
}

/**
 * Verify that the authenticated user owns the prompt
 * Throws ForbiddenError if user doesn't own the resource
 */
export async function requirePromptOwnership(
  userId: string,
  promptId: string
): Promise<void> {
  const supabase = await createClient()

  const result = await supabase
    .from('prompts')
    .select('user_id')
    .eq('id', promptId)
    .single()

  if (!result.data) {
    throw new NotFoundError('Prompt not found')
  }

  if (result.data.user_id !== userId) {
    throw new ForbiddenError('You do not have permission to access this prompt')
  }
}

/**
 * Verify that the authenticated user owns the API key
 * Throws ForbiddenError if user doesn't own the resource
 */
export async function requireApiKeyOwnership(
  userId: string,
  apiKeyId: string
): Promise<void> {
  const supabase = await createClient()

  const result = await supabase
    .from('user_api_keys')
    .select('user_id')
    .eq('id', apiKeyId)
    .single()

  if (!result.data) {
    throw new NotFoundError('API key not found')
  }

  if (result.data.user_id !== userId) {
    throw new ForbiddenError('You do not have permission to access this API key')
  }
}

/**
 * Simple permission check (can be extended for RBAC)
 */
export async function requirePermission(
  _userId: string,
  _permission: string
): Promise<void> {
  // Simple implementation - can be extended with role-based access control
  // For now, authenticated users have all permissions
  // In future: check user roles/permissions from database
}

