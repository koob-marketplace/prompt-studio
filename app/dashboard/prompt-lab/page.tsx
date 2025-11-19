'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Zap } from 'lucide-react';

import PromptEditor from './components/prompt-editor';
import ModelSelector from './components/model-selector';
import ResultsDisplay from './components/results-display';

import { usePromptLab } from './hooks/usePromptLab';
import { getActiveModels } from './utils/models';
import { ModelId, ResultState } from './types/definitions';

const PromptLabPage = () => {
  const promptLab = usePromptLab(
    'Create a short poem about the beauty of coding.'
  );

  const activeModels = getActiveModels(promptLab.selectedModels);
  const hasError = Object.values(promptLab.results).some(r => r?.error);

  const streamModelResult = async (modelId: ModelId, promptText: string) => {
    const response = await fetch('/api/prompt-lab/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: promptText,
        modelId,
      }),
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const data = await response.json();
        if (data?.error) {
          errorMessage = data.error;
        }
      } catch {
        // ignore parse errors
      }
      throw new Error(errorMessage);
    }

    if (!response.body) {
      throw new Error('Streaming not supported in this environment.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let finished = false;

    const processBuffer = () => {
      // Process all complete lines in the buffer
      let newlineIndex = buffer.indexOf('\n');

      while (newlineIndex !== -1) {
        const line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);

        if (line) {
          try {
            const event = JSON.parse(line);
            const eventType = event?.type;

            switch (eventType) {
              case 'text': {
                if (typeof event.data === 'string' && event.data.length > 0) {
                  // Append text chunk immediately for real-time visibility
                  promptLab.appendToModelResult(modelId, event.data);
                }
                break;
              }
              case 'usage': {
                // Update token usage without adding text
                promptLab.updateModelResult(modelId, {
                  tokenUsage: event.data,
                  // Don't set isLoading here - let 'done' event handle it
                });
                break;
              }
              case 'error': {
                promptLab.finishModelResult(
                  modelId,
                  typeof event.data === 'string'
                    ? event.data
                    : 'Unknown provider error'
                );
                finished = true;
                break;
              }
              case 'done': {
                console.log(`[${modelId}] Stream finished - setting isLoading to false`);
                promptLab.finishModelResult(modelId);
                finished = true;
                break;
              }
              default:
                // Unknown event type - log it for debugging
                break;
            }
          } catch (parseError) {
            // Log but don't fail on invalid JSON lines
            console.debug('Failed to parse event line:', line, parseError);
          }
        }

        if (finished) {
          return;
        }

        newlineIndex = buffer.indexOf('\n');
      }
    };

    try {
      while (!finished) {
        const { done, value } = await reader.read();

        if (value) {
          // Decode the chunk and add to buffer
          buffer += decoder.decode(value, { stream: true });
          // Process complete lines immediately
          processBuffer();
        }

        if (done) {
          // Flush any remaining data
          const remaining = decoder.decode();
          if (remaining) {
            buffer += remaining;
          }
          // Process any final lines
          processBuffer();
          break;
        }
      }
    } finally {
      reader.releaseLock();
    }

    // Ensure result is marked as finished
    if (!finished) {
      promptLab.finishModelResult(modelId);
    }
  };

  /**
   * Handle running the prompt test
   */
  const handleRunTest = async () => {
    if (!promptLab.prompt.trim() || activeModels.length === 0) {
      return;
    }

    const promptToSend = promptLab.prompt;

    promptLab.setTestLoading(true);
    promptLab.initializeTestResults();

    try {
      await Promise.all(
        activeModels.map(async modelId => {
          try {
            await streamModelResult(modelId, promptToSend);
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : 'Unknown error';
            promptLab.finishModelResult(modelId, errorMessage);
          }
        })
      );
    } finally {
      promptLab.setTestLoading(false);
    }
  };

  const isRunTestDisabled =
    promptLab.isLoading ||
    activeModels.length === 0 ||
    !promptLab.prompt.trim();

  return (
    <div className="flex min-h-full flex-col bg-background">
      <section className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col">
        <div className="sticky top-0 z-20 border-b border-border/70 bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">Prompt Lab</h1>
              <p className="text-sm text-muted-foreground">
                Build, test, and compare prompts across your preferred AI models.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-w-fit sm:flex-row sm:items-center sm:justify-end">
              <Button
                onClick={handleRunTest}
                disabled={isRunTestDisabled}
                className="w-full sm:w-auto"
                aria-label="Run prompt test on selected models"
              >
                <Zap className="mr-2 h-4 w-4" />
                {promptLab.isLoading ? 'Running...' : 'Run Test'}
              </Button>
              <p className="text-xs text-muted-foreground text-center sm:text-right">
                {promptLab.activeModelCount > 0
                  ? `${promptLab.activeModelCount} active model${promptLab.activeModelCount > 1 ? 's' : ''}`
                  : 'Select models to run a test'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6 px-6 pb-10 pt-6">
          {hasError && (
            <Alert variant="destructive" className="py-3">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Some models encountered issues. Review the error messages inside their result cards.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid items-stretch gap-4 xl:grid-cols-[2fr,1fr]">
            <section className="rounded-lg p-4 shadow-sm">
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-semibold">Models</h2>
                <p className="text-sm text-muted-foreground">
                  Choose which providers and versions to benchmark.
                </p>
              </div>
              <Separator className="my-4" />
              <div className="pr-2">
                <ModelSelector
                  selectedModels={promptLab.selectedModels}
                  onModelSelectionChange={promptLab.handleModelSelectionChange}
                  isLoading={promptLab.isLoading}
                />
              </div>
            </section>
            <section className="rounded-lg p-4 shadow-sm flex flex-col">
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-semibold">Prompt</h2>
                <p className="text-sm text-muted-foreground">
                  Draft or refine the prompt you want to evaluate.
                </p>
              </div>
              <Separator className="my-4" />
              <div className="flex-1 min-h-0">
                <PromptEditor
                  prompt={promptLab.prompt}
                  onPromptChange={promptLab.handlePromptChange}
                  isLoading={promptLab.isLoading}
                />
              </div>
            </section>
          </div>

          <section className="rounded-lg shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
              <div>
                <h2 className="text-base font-semibold">Results</h2>
                <p className="text-xs text-muted-foreground">
                  Scroll horizontally to explore each model output. Each card keeps its own vertical scroll.
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                {activeModels.length} model{activeModels.length === 1 ? '' : 's'} selected
              </span>
            </div>
            <Separator className="my-4" />
            <div className="px-2 py-4">
              <div className="h-[520px] w-full min-w-0 rounded-md bg-background/60 lg:h-[calc(100vh-360px)]">
                <ResultsDisplay
                  modelIds={activeModels}
                  results={promptLab.results as ResultState}
                  isEmpty={activeModels.length === 0}
                />
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default PromptLabPage;


