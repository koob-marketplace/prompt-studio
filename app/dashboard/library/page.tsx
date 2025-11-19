import Link from 'next/link'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { listTemplatesAction } from '@/lib/backend/actions/template.actions'
import { TemplateOutput } from '@/lib/backend/types'

export default async function LibraryPage() {
  const response = await listTemplatesAction()

  if (!response.success) {
    // TODO: Add a proper error component
    return <div>Error loading templates.</div>
  }

  const templates = response.data as TemplateOutput[]

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Prompt Library</h1>
        <p className="text-muted-foreground">
          Browse our collection of curated prompt templates to get started.
        </p>
      </header>

      {templates.length === 0 ? (
        <p>No templates found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map(
            (template) =>
              template.slug && (
                <Link
                  href={`/dashboard/library/${template.slug}`}
                  key={template.id}
                  className="block"
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                      <CardTitle>{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ),
          )}
        </div>
      )}
    </div>
  )
}
