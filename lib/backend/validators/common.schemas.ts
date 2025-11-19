import { z } from 'zod'

/**
 * Common Validators
 */

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
})

export type PaginationSchema = z.infer<typeof paginationSchema>

