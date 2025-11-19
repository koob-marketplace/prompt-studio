'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPromptAction } from '@/lib/backend/actions'
import { isSuccessResponse } from '@/lib/backend/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Save } from 'lucide-react'
import { usePrompt } from '@/app/studio/hooks/usePrompt'

interface SavePromptHeaderProps {
  promptHook: ReturnType<typeof usePrompt>
}

export function SavePromptHeader({ promptHook }: SavePromptHeaderProps) {
  const [title, setTitle] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Veuillez entrer un titre pour votre prompt.')
      return
    }

    setIsSaving(true)
    try {
      const response = await createPromptAction({
        title,
        content: promptHook.promptAsJson,
        json: {}, // Can be extended later
      })

      if (isSuccessResponse(response)) {
        toast.success('Prompt sauvegardé avec succès !')
        router.push('/dashboard/prompts')
        router.refresh() // Refresh the page to show the new prompt
      } else {
        toast.error(response.error?.message || 'Échec de la sauvegarde du prompt.')
      }
    } catch (error) {
      toast.error('Une erreur inattendue est survenue.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex items-center gap-4 p-4 border-b bg-background sticky top-0 z-10">
      <Input
        placeholder="Titre du prompt..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1"
      />
      <Button onClick={handleSave} disabled={isSaving || !title.trim() || promptHook.nodes.length === 0}>
        <Save className="w-4 h-4 mr-2" />
        {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
      </Button>
    </div>
  )
}
