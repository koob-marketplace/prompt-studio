import { TemplateOutput } from '@/lib/backend/types'
import * as templateRepository from '@/lib/backend/repositories/template.repository'

/**
 * Template Service (Read-only)
 * Templates are a shared library accessible to all users
 */

export async function getTemplate(id: number): Promise<TemplateOutput> {
  const template = await templateRepository.getTemplateById(id)
  return template
}

export async function listTemplates(): Promise<TemplateOutput[]> {
  const templates = await templateRepository.getAllTemplates()
  return templates
}

export async function getTemplateBySlug(slug: string): Promise<TemplateOutput> {
  const template = await templateRepository.getTemplateBySlug(slug)
  return template
}





