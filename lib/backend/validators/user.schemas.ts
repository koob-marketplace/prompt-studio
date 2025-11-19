import { z } from 'zod'

/**
 * User Validators
 */

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must not exceed 255 characters')
    .optional(),
  avatarUrl: z.string().url('Invalid avatar URL').optional(),
  email: z.string().email('Invalid email address').optional(),
})

export type UpdateUserSchema = z.infer<typeof updateUserSchema>

