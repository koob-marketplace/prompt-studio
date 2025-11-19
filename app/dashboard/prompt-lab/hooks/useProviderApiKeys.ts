'use client'

import { useEffect, useState } from 'react'
import { listApiKeysAction } from '@/lib/backend/actions/api-key.actions'
import { ProviderId } from '../types/definitions'

/**
 * Hook to check which providers have API keys configured
 * Returns a Set of provider IDs that have API keys and utility functions
 */
export const useProviderApiKeys = () => {
  const [providersWithApiKeys, setProvidersWithApiKeys] = useState<Set<ProviderId>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await listApiKeysAction()

        if (!response.success) {
          setError(response.error?.message || 'Failed to fetch API keys')
          return
        }

        if (response.data && Array.isArray(response.data)) {
          // Create a Set of provider IDs that have API keys
          const providerIds = new Set<ProviderId>(
            response.data.map(apiKey => apiKey.providerId as ProviderId)
          )
          setProvidersWithApiKeys(providerIds)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchApiKeys()
  }, [])

  /**
   * Check if a provider has an API key configured
   */
  const hasApiKey = (providerId: ProviderId): boolean => {
    return providersWithApiKeys.has(providerId)
  }

  return {
    providersWithApiKeys,
    hasApiKey,
    isLoading,
    error,
  }
}

