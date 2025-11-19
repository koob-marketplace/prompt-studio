/**
 * Template Types (Read-only for all users)
 */

export interface TemplateOutput {
  id: number
  name: string
  description: string
  json: Record<string, unknown>
  markdown: string
  slug: string | null
  createdAt: Date
  updatedAt: Date
}

