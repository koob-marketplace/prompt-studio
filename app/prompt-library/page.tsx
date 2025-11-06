import { PromptsList } from './components/PromptsList'

export const metadata = {
  title: 'Prompt Library',
  description: 'Discover and explore our collection of prompts.',
}

export default function PromptsPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Prompt Library</h1>
          <p className="mt-2 text-lg text-muted-foreground">Discover and explore our collection of prompts</p>
        </div>

        <PromptsList />
      </div>
    </div>
  )
}

