import { UserOutput } from '@/lib/backend/types'
import * as userRepository from '@/lib/backend/repositories/user.repository'

/**
 * User Service
 */

export async function getUser(userId: string): Promise<UserOutput> {
  const user = await userRepository.getUserById(userId)
  return user
}





