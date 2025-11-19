import { User } from '@supabase/supabase-js'

/**
 * Auth Context Types
 */

export interface AuthContext {
  user: User
  userId: string
  email: string
}

/**
 * Standard API Response Wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
  }
}

