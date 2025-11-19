import { notFound } from 'next/navigation'
import { getTemplateBySlugAction } from '@/lib/backend/actions/template.actions'
import { TemplateOutput } from '@/lib/backend/types'
import { TemplateViewer } from '../components/template-viewer'
import { Button } from '@/components/ui/button'
import { createPromptFromTemplate } from '@/lib/backend/actions/prompt.actions'

interface TemplatePageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const { slug } = await params
  const response = await getTemplateBySlugAction(slug)

  if (!response.success || !response.data) {
    notFound()
  }

  const template = response.data as TemplateOutput

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{template.name}</h1>
            <p className="text-muted-foreground">{template.description}</p>
          </div>
          <form action={async (formData) => {
            'use server'
            await createPromptFromTemplate(formData)
          }}>
            <input type="hidden" name="name" value={template.name} />
            <input
              type="hidden"
              name="description"
              value={template.description}
            />
            <input
              type="hidden"
              name="content"
              value={JSON.stringify(template.json)}
            />
            <Button type="submit">Use this Template</Button>
          </form>
        </div>
      </header>

      <TemplateViewer jsonData={template.json} />
    </div>
  )
}

export const revalidate = 60 // Revalidate this page every 60 seconds
