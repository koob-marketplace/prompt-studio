import { createClient } from '@/lib/supabase/server'
import { TemplateOutput, NotFoundError } from '@/lib/backend/types'

/**
 * Template Repository (Read-only)
 * Templates are shared library - only GET operations allowed
 */

export async function getTemplateById(id: number): Promise<TemplateOutput> {
  const supabase = await createClient()

  const { data: template, error } = await supabase
    .from('templates')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !template) {
    throw new NotFoundError('Template not found')
  }

  return mapTemplateResponse(template)
}

export async function getAllTemplates(): Promise<TemplateOutput[]> {
  const supabase = await createClient()

  const { data: templates, error } = await supabase
    .from('templates')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch templates: ${error.message}`)
  }

  return templates.map(mapTemplateResponse)
}

export async function getTemplateBySlug(slug: string): Promise<TemplateOutput> {
  const supabase = await createClient()

  const { data: template, error } = await supabase
    .from('templates')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !template) {
    throw new NotFoundError('Template not found')
  }

  return mapTemplateResponse(template)
}

/**
 * Response mapper - transform database object to output type
 */
function mapTemplateResponse(data: unknown): TemplateOutput {
  const template = data as Record<string, unknown>
  return {
    id: Number(template.id),
    name: String(template.name),
    description: String(template.description),
    json: (template.json as Record<string, unknown>) || {},
    markdown: String(template.markdown),
    slug: template.slug ? String(template.slug) : null,
    createdAt: new Date(template.created_at as string),
    updatedAt: new Date(template.updated_at as string),
  }
}





