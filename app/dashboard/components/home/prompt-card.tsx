'use client'

import Link from 'next/link'
import { PromptOutput } from '@/lib/backend/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2 } from 'lucide-react'
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog'
import { deletePromptAction } from '@/lib/backend/actions/prompt.actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface PromptCardProps {
  prompt: PromptOutput
}

export function PromptCard({ prompt }: PromptCardProps) {
  const router = useRouter()
  const truncatedContent = prompt.content.substring(0, 150) + (prompt.content.length > 150 ? '...' : '')

  const handleDelete = async () => {
    try {
      const result = await deletePromptAction(prompt.id)
      if (result.success) {
        toast.success('Prompt deleted successfully')
        router.refresh()
      } else {
        toast.error('Failed to delete prompt')
      }
    } catch (error) {
      toast.error('An error occurred while deleting the prompt')
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow relative">
      <CardHeader>
        <CardTitle className="line-clamp-2 pr-8">{prompt.title}</CardTitle>
        <CardDescription>{new Date(prompt.createdAt).toLocaleDateString()}</CardDescription>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button 
              className="absolute top-4 right-4 text-destructive hover:text-destructive/80 transition-colors"
              aria-label="Delete prompt"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your prompt.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent className="space-y-4">

        <Button asChild variant="default" size="sm" className="flex-1">
          <Link href={`/dashboard/prompts/${prompt.id}`}>Éditer</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

