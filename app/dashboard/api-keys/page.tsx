import React from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { fetchUserApiKeys } from './actions/api-key-actions'
import { ApiKeysClient, ApiKeyState } from './components/api-keys-client'
import { PROVIDERS } from '@/app/dashboard/prompt-lab/types/definitions'
import { ApiKeyOutput } from '@/lib/backend/types/api-key'

export default async function ApiKeysPage() {
  const result = await fetchUserApiKeys()

  const initialApiKeys: Record<string, ApiKeyState> = {}
  PROVIDERS.forEach((provider) => {
    const existingKey = (result.data as ApiKeyOutput[])?.find((k) => k.providerId === provider.id)
    initialApiKeys[provider.id] = {
      value: existingKey ? '••••••••••••••••' : '',
      isVisible: false,
      isSaving: false,
      isSaved: !!existingKey,
      savedApiKeyId: existingKey?.id,
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
        <p className="text-muted-foreground">
          Configure your API keys for each LLM provider.
        </p>
      </div>

      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Your API keys are encrypted and stored securely. They are never exposed to the client.
        </AlertDescription>
      </Alert>

      <ApiKeysClient initialApiKeys={initialApiKeys} />
    </div>
  )
}
