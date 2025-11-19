import Link from 'next/link'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PromptsList } from '@/app/dashboard/components/home/prompts-list'
import { listPromptsAction } from '@/lib/backend/actions/prompt.actions'
import { listTemplatesAction } from '@/lib/backend/actions/template.actions'
import { PromptOutput, TemplateOutput } from '@/lib/backend/types'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const promptsResponse = await listPromptsAction()
  const templatesResponse = await listTemplatesAction()

  const prompts =
    promptsResponse.success && promptsResponse.data
      ? (promptsResponse.data as PromptOutput[])
      : []

  const templates =
    templatesResponse.success && templatesResponse.data
      ? (templatesResponse.data as TemplateOutput[])
      : []

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here are your latest prompts and available templates.
        </p>
      </header>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">My Prompts</h2>
          <Button asChild>
            <Link href="/dashboard/prompts">View All</Link>
          </Button>
        </div>
        <PromptsList prompts={prompts.slice(0, 3)} />
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Prompt Library</h2>
          <Button asChild>
            <Link href="/dashboard/library">View All</Link>
          </Button>
        </div>
        {templates.length === 0 ? (
          <p>No templates found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.slice(0, 3).map(
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
                        <CardDescription>
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ),
            )}
          </div>
        )}
      </section>
    </div>
  )
}
