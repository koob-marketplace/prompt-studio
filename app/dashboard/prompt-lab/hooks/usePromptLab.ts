'use client';

import { useState, useCallback } from 'react';
import {
  ModelId,
  SelectedModels,
  ResultState,
  ModelResult,
  PROVIDERS,
} from '../types/definitions';
import {
  initializeSelectedModels,
  getActiveModels,
} from '../utils/models';

/**
 * Main hook for managing Prompt Lab state and logic
 * Handles prompt text, selected models, and results
 */
export const usePromptLab = (initialPrompt: string = '') => {
  const [prompt, setPrompt] = useState<string>(initialPrompt);
  const [selectedModels, setSelectedModels] = useState<SelectedModels>(
    initializeSelectedModels()
  );
  
  // Initialize empty results with proper typing
  const createEmptyResults = (): Partial<ResultState> => ({});
  const [results, setResults] = useState<Partial<ResultState>>(createEmptyResults());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const activeModels = getActiveModels(selectedModels);
  const activeModelCount = activeModels.length;

  /**
   * Update the prompt text
   */
  const handlePromptChange = useCallback((newPrompt: string) => {
    setPrompt(newPrompt);
  }, []);

  /**
   * Update selected models for a provider
   */
  const handleModelSelectionChange = useCallback(
    (providerId: string, modelId: ModelId | null) => {
      setSelectedModels(prev => ({
        ...prev,
        [providerId]: modelId,
      }));
    },
    []
  );

  /**
   * Initialize results for active models (call before running test)
   */
  const initializeTestResults = useCallback(() => {
    const initialResults: Partial<ResultState> = {};
    activeModels.forEach(modelId => {
      initialResults[modelId] = { output: '', isLoading: true };
    });
    setResults(initialResults);
  }, [activeModels]);

  /**
   * Update a specific model's result
   */
  const updateModelResult = useCallback(
    (modelId: ModelId, result: Partial<ModelResult>) => {
      setResults(prev => {
        const prevResult: ModelResult =
          prev[modelId] ?? {
            output: '',
            isLoading: true,
          };

        const nextResult: ModelResult = {
          ...prevResult,
          ...result,
          output: result.output ?? prevResult.output,
          isLoading: result.isLoading ?? prevResult.isLoading,
        };

        return {
          ...prev,
          [modelId]: nextResult,
        };
      });
    },
    []
  );

  /**
   * Append output to a model's result (for streaming)
   */
  const appendToModelResult = useCallback((modelId: ModelId, chunk: string) => {
    setResults(prev => {
      const prevResult: ModelResult =
        prev[modelId] ?? {
          output: '',
          isLoading: true,
        };

      return {
        ...prev,
        [modelId]: {
          ...prevResult,
          output: (prevResult.output ?? '') + chunk,
        },
      };
    });
  }, []);

  /**
   * Mark a model's result as finished loading
   */
  const finishModelResult = useCallback((modelId: ModelId, error?: string) => {
    setResults(prev => {
      const prevResult: ModelResult =
        prev[modelId] ?? {
          output: '',
          isLoading: false,
        };

      return {
        ...prev,
        [modelId]: {
          ...prevResult,
          isLoading: false,
          ...(error ? { error } : {}),
        },
      };
    });
  }, []);

  /**
   * Set global loading state
   */
  const setTestLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  /**
   * Clear all results
   */
  const clearResults = useCallback(() => {
    setResults(createEmptyResults());
  }, []);

  /**
   * Reset everything to initial state
   */
  const resetLab = useCallback(() => {
    setPrompt('');
    setSelectedModels(initializeSelectedModels());
    setResults(createEmptyResults());
    setIsLoading(false);
  }, []);

  return {
    // State
    prompt,
    selectedModels,
    results,
    isLoading,
    activeModels,
    activeModelCount,

    // Setters
    setPrompt: handlePromptChange,
    setSelectedModels: (models: SelectedModels) => setSelectedModels(models),

    // Handlers
    handlePromptChange,
    handleModelSelectionChange,

    // Result management
    initializeTestResults,
    updateModelResult,
    appendToModelResult,
    finishModelResult,
    setTestLoading,
    clearResults,
    resetLab,
  };
};

export type UsePromptLabReturn = ReturnType<typeof usePromptLab>;

