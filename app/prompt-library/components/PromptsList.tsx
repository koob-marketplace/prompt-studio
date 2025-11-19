import { PromptCard } from './PromptCard'
import { fetchTemplates } from '../actions/prompt-actions'
import nextLink from 'next/link'
import { Link } from 'lucide-react'

export const PromptsList = async () => {
  const templates = await fetchTemplates()

  if (templates.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">No prompts available yet.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <PromptCard key={template.id} template={template} />
      ))}
    </div>
  )
}

