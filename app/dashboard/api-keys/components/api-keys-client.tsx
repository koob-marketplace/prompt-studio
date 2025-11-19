'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Eye, EyeOff, Check } from 'lucide-react'
import { toast } from 'sonner'
import { PROVIDERS } from '@/app/dashboard/prompt-lab/types/definitions'
import { providerEnum } from '@/db/user-api-keys'
import {
  addApiKey,
  updateApiKey,
  getDecryptedApiKey,
} from '../actions/api-key-actions'
import { ApiKeyOutput } from '@/lib/backend/types/api-key'

export type ApiKeyState = {
  value: string
  isVisible: boolean
  isSaving: boolean
  isSaved: boolean
  savedApiKeyId?: string
}

type ApiKeysClientProps = {
  initialApiKeys: Record<string, ApiKeyState>
}

export function ApiKeysClient({ initialApiKeys }: ApiKeysClientProps) {
  const [apiKeys, setApiKeys] = useState<Record<string, ApiKeyState>>(initialApiKeys)

  const handleInputChange = (providerId: string, value: string) => {
    setApiKeys((prev) => ({
      ...prev,
      [providerId]: {
        ...prev[providerId],
        value: prev[providerId].value === '••••••••••••••••' && value ? '' : value,
      },
    }))
  }

  const toggleVisibility = async (providerId: string) => {
    const state = apiKeys[providerId]

    if (state.isSaved && !state.isVisible && state.value === '••••••••••••••••') {
      try {
        const result = await getDecryptedApiKey(state.savedApiKeyId!)
        if (result.success && result.data) {
          setApiKeys((prev) => ({
            ...prev,
            [providerId]: {
              ...prev[providerId],
              value: result.data as string,
              isVisible: true,
            },
          }))
        } else {
          toast.error(result.error?.message || 'Failed to load API key')
        }
      } catch (error) {
        toast.error('Failed to load API key')
      }
    } else {
      setApiKeys((prev) => ({
        ...prev,
        [providerId]: {
          ...prev[providerId],
          isVisible: !state.isVisible,
        },
      }))
    }
  }

  const handleSave = async (providerId: string) => {
    const state = apiKeys[providerId]

    if (!state.value.trim()) {
      toast.error('API key cannot be empty')
      return
    }

    setApiKeys((prev) => ({
      ...prev,
      [providerId]: { ...prev[providerId], isSaving: true },
    }))

    try {
      let result
      if (state.isSaved && state.savedApiKeyId) {
        result = await updateApiKey(
          state.savedApiKeyId,
          {
            apiKeyId: state.savedApiKeyId,
            apiKey: state.value,
          }
        )
      } else {
        result = await addApiKey({
          providerId: providerId as typeof providerEnum.enumValues[number],
          apiKey: state.value,
        })
      }

      if (result.success) {
        toast.success('API key saved successfully')
        setApiKeys((prev) => ({
          ...prev,
          [providerId]: {
            ...prev[providerId],
            isSaved: true,
            isSaving: false,
            savedApiKeyId: (result.data as ApiKeyOutput)?.id ?? state.savedApiKeyId,
          },
        }))
      } else {
        toast.error(result.error?.message || 'Failed to save API key')
        setApiKeys((prev) => ({
          ...prev,
          [providerId]: { ...prev[providerId], isSaving: false },
        }))
      }
    } catch (error) {
      console.error('Error saving API key:', error)
      toast.error('An unexpected error occurred')
      setApiKeys((prev) => ({
        ...prev,
        [providerId]: { ...prev[providerId], isSaving: false },
      }))
    }
  }

  return (
    <div className="grid gap-4">
      {PROVIDERS.map((provider) => {
        const state = apiKeys[provider.id]
        if (!state) return null

        return (
          <Card key={provider.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{provider.name}</CardTitle>
              <CardDescription>
                {state.isSaved ? 'API key configured' : 'No API key configured'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor={`api-key-${provider.id}`}>API Key</Label>
                <div className="relative flex gap-2">
                  <Input
                    id={`api-key-${provider.id}`}
                    type={state.isVisible ? 'text' : 'password'}
                    value={state.value}
                    onChange={(e) => handleInputChange(provider.id, e.target.value)}
                    placeholder="Enter your API key..."
                    disabled={state.isSaving}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleVisibility(provider.id)}
                    disabled={state.isSaving}
                    className="px-3"
                  >
                    {state.isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleSave(provider.id)}
                    disabled={state.isSaving || !state.value.trim()}
                    size="sm"
                    className="gap-2"
                  >
                    {state.isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : state.isSaved ? (
                      <>
                        <Check className="h-4 w-4 text-green-600" />
                        Saved
                      </>
                    ) : (
                      'Save'
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your API key is encrypted before being stored.
                </p>
              </div>
              <div className="pt-3 border-t">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Available models:
                </p>
                <div className="flex flex-wrap gap-1">
                  {provider.models.map((model) => (
                    <span
                      key={model.id}
                      className="inline-block px-2 py-1 text-xs bg-muted text-muted-foreground rounded"
                    >
                      {model.name}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
