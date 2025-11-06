'use server'

import { unstable_cache } from 'next/cache'
import { db } from '@/db'
import { templates } from '@/db/schema'
import { desc } from 'drizzle-orm'

export type Template = {
  id: number
  name: string
  description: string
  slug: string | null
}

const getTemplates = unstable_cache(
  async () => {
    const result = await db
      .select({
        id: templates.id,
        name: templates.name,
        description: templates.description,
        slug: templates.slug,
      })
      .from(templates)
      .orderBy(desc(templates.createdAt))

    return result
  },
  ['templates-list'],
  {
    revalidate: 3600,
    tags: ['templates'],
  }
)

export async function fetchTemplates(): Promise<Template[]> {
  return getTemplates()
}

