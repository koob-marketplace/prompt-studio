import { notFound } from 'next/navigation'
import { unstable_cache } from 'next/cache'
import { db } from '@/db'
import { templates } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'

const getTemplateBySlug = unstable_cache(
  async (slug: string) => {
    const result = await db.select().from(templates).where(eq(templates.slug, slug)).limit(1)
    return result[0] || null
  },
  [],
  {
    revalidate: 3600,
    tags: ['templates'],
  }
)

interface PromptDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PromptDetailPageProps) {
  const { slug } = await params
  const template = await getTemplateBySlug(slug)

  if (!template) {
    return {
      title: 'Prompt Not Found',
    }
  }

  return {
    title: template.name,
    description: template.description,
  }
}

export default async function PromptDetailPage({ params }: PromptDetailPageProps) {
  const { slug } = await params
  const template = await getTemplateBySlug(slug)

  if (!template) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="mx-auto max-w-4xl">
        <Link href="/prompts">
          <Button variant="ghost" className="mb-6">
            ← Back to Library
          </Button>
        </Link>

        <div className="bg-card rounded-lg border p-8">
          <h1 className="text-4xl font-bold mb-2">{template.name}</h1>
          <p className="text-lg text-muted-foreground mb-8">{template.description}</p>

          <Tabs defaultValue="markdown" className="w-full">
            <TabsList className="mb-4">
              {template.markdown ? <TabsTrigger value="markdown">Markdown</TabsTrigger> : null}
              {template.json ? <TabsTrigger value="json">JSON</TabsTrigger> : null}
            </TabsList>

            {template.markdown ? (
              <TabsContent value="markdown">
                <div className="bg-muted rounded p-4 overflow-auto">
                  <pre className="text-sm whitespace-pre-wrap break-words">{template.markdown}</pre>
                </div>
              </TabsContent>
            ) : null}

            {template.json ? (
              <TabsContent value="json">
                <div className="bg-muted rounded p-4 overflow-auto">
                  <pre className="text-sm">
                    {JSON.stringify(template.json, null, 2) ?? '{}'}
                  </pre>
                </div>
              </TabsContent>
            ) : null}
          </Tabs>
        </div>
      </div>
    </div>
  )
}

