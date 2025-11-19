import { getPromptAction } from '@/lib/backend/actions'
import { isSuccessResponse, PromptOutput } from '@/lib/backend'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { PromptEditorUI } from './prompt-editor-ui'

interface PromptPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PromptPage({ params }: PromptPageProps) {
  const { id } = await params
  const response = await getPromptAction(id)

  if (!isSuccessResponse(response)) {
    if (response.error?.message === 'Prompt not found') {
      notFound()
    }
  return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-red-500">
          Erreur: {response.error?.message || 'Could not load the prompt.'}
      </div>
    </div>
  )
}

  const prompt = response.data as PromptOutput

  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">
          Loading studio...
        </div>
      }
    >
      <PromptEditorUI prompt={prompt} />
    </Suspense>
  )
}


