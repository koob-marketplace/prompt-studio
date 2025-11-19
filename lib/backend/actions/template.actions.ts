'use server'

import { ApiResponse } from '@/lib/backend/types'
import * as templateService from '@/lib/backend/services/template.service'
import { handleError } from '@/lib/backend/utils/error.utils'

/**
 * Template Server Actions (Public - no auth required)
 * Templates are a shared library accessible to all users
 */

export async function getTemplateAction(id: number): Promise<ApiResponse> {
  try {
    const template = await templateService.getTemplate(id)

    return {
      success: true,
      data: template,
    }
  } catch (error) {
    return handleError(error)
  }
}

export async function listTemplatesAction(): Promise<ApiResponse> {
  try {
    const templates = await templateService.listTemplates()

    return {
      success: true,
      data: templates,
    }
  } catch (error) {
    return handleError(error)
  }
}

export async function getTemplateBySlugAction(slug: string): Promise<ApiResponse> {
  try {
    const template = await templateService.getTemplateBySlug(slug)

    return {
      success: true,
      data: template,
    }
  } catch (error) {
    return handleError(error)
  }
}

