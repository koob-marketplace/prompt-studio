'use client'

import { Button } from '@/components/ui/button'
import { createEmptyPrompt } from '@/lib/backend/actions/prompt.actions'
import { Plus } from 'lucide-react'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button className="gap-2" type="submit" disabled={pending}>
      <Plus className="w-4 h-4" />
      Nouveau Prompt
    </Button>
  )
}

export function CreatePromptButton() {
  return (
    <form action={async () => { await createEmptyPrompt(); return undefined; }}>
      <SubmitButton />
    </form>
  )
}

