/**
 * Prompt Types
 */

export interface CreatePromptInput {
  title: string
  content: string
  json?: Record<string, unknown>
}

export interface UpdatePromptInput {
  title?: string
  content?: string
  json?: Record<string, unknown>
}

export interface PromptOutput {
  id: string
  userId: string
  title: string
  content: string
  json: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

