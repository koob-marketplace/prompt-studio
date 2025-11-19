import { ApiResponse, AppError } from '@/lib/backend/types'

/**
 * Centralized error handling for server actions
 */

export function handleError(error: unknown): ApiResponse {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    }
  }

  if (error instanceof Error) {
    // Don't expose internal error details to client
    console.error('[Backend Error]', error)
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    }
  }

  console.error('[Unknown Error]', error)
  return {
    success: false,
    error: {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
    },
  }
}


