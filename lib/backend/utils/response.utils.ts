import { ApiResponse } from '@/lib/backend/types'

/**
 * Type guards for API responses
 */

export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiResponse<T> & { data: T } {
  return response.success === true && response.data !== undefined
}

export function isErrorResponse(
  response: ApiResponse
): response is ApiResponse & { error: NonNullable<ApiResponse['error']> } {
  return response.success === false && response.error !== undefined
}


