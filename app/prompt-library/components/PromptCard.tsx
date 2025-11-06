'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Template } from '../actions/prompt-actions'

interface PromptCardProps {
  template: Template
}

export const PromptCard = ({ template }: PromptCardProps) => {
  return (
    <Link href={`/prompts/${template.slug}`}>
      <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:border-primary">
        <CardHeader>
          <CardTitle className="line-clamp-2">{template.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-3">{template.description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  )
}

