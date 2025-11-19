'use server'

import { ApiResponse } from '@/lib/backend/types'
import * as userService from '@/lib/backend/services/user.service'
import { requireAuth } from '@/lib/backend/guards'
import { handleError } from '@/lib/backend/utils/error.utils'

/**
 * User Server Actions
 */

export async function getUserAction(): Promise<ApiResponse> {
  try {
    const auth = await requireAuth()
    const user = await userService.getUser(auth.userId)

    return {
      success: true,
      data: user,
    }
  } catch (error) {
    return handleError(error)
  }
}

