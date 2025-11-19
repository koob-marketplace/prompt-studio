'use client'
import Link from 'next/link'
import { PromptOutput } from '@/lib/backend/types'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia, EmptyContent } from '@/components/ui/empty'
import { FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PromptCard } from './prompt-card'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { CreatePromptButton } from './create-prompt-button'
import { createEmptyPrompt } from '@/lib/backend/actions/prompt.actions'
import { useState } from 'react'

interface PromptsListProps {
  prompts: PromptOutput[]
}

export function PromptsList({ prompts }: PromptsListProps) {
  if (prompts.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyMedia variant="icon">
          <FileText className="w-6 h-6" />
        </EmptyMedia>
        <EmptyContent>
          <EmptyHeader>
            <EmptyTitle>Aucun prompt créé</EmptyTitle>
            <EmptyDescription>Commencez par créer votre premier prompt pour démarrer!</EmptyDescription>
          </EmptyHeader>
          <form action={async () => { await createEmptyPrompt(); return undefined; }}>
            <CreatePromptButton />
          </form>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {prompts.map((prompt) => (
        <PromptCard 
          key={prompt.id} 
          prompt={prompt} 
        />
      ))}
    </div>
  )
}

