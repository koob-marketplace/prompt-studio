'use client';

import React, { type ComponentPropsWithoutRef } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { ModelId, ResultState } from '../types/definitions';
import { getFullModelInfo } from '../utils/models';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

type MarkdownCodeProps = ComponentPropsWithoutRef<'code'> & {
  inline?: boolean;
};

const markdownComponents: Components = {
  code({ inline, children, ...props }: MarkdownCodeProps) {
    if (inline) {
      return (
        <code
          className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <code
        className="block font-mono text-[0.85em] leading-relaxed whitespace-pre-wrap break-words"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre({ children, ...props }) {
    return (
      <pre
        className="overflow-x-auto rounded-md bg-muted/50 border border-border/50 p-4 text-[0.85em] leading-relaxed my-2 shadow-sm"
        {...props}
      >
        {children}
      </pre>
    );
  },
  h1({ children, ...props }) {
    return (
      <h1 className="text-xl font-bold mt-4 mb-2" {...props}>
        {children}
      </h1>
    );
  },
  h2({ children, ...props }) {
    return (
      <h2 className="text-lg font-bold mt-3 mb-2" {...props}>
        {children}
      </h2>
    );
  },
  h3({ children, ...props }) {
    return (
      <h3 className="text-base font-bold mt-2 mb-1" {...props}>
        {children}
      </h3>
    );
  },
  blockquote({ children, ...props }) {
    return (
      <blockquote
        className="border-l-4 border-muted-foreground pl-4 italic text-muted-foreground my-2"
        {...props}
      >
        {children}
      </blockquote>
    );
  },
  p({ children, ...props }) {
    return (
      <p className="mb-2 leading-relaxed" {...props}>
        {children}
      </p>
    );
  },
  table({ children, ...props }) {
    return (
      <div className="overflow-x-auto my-2">
        <table
          className="w-full text-left text-xs border-collapse border border-border"
          {...props}
        >
          {children}
        </table>
      </div>
    );
  },
  th({ children, ...props }) {
    return (
      <th
        className="border border-border bg-muted/70 px-3 py-2 font-semibold"
        {...props}
      >
        {children}
      </th>
    );
  },
  td({ children, ...props }) {
    return (
      <td className="border border-border px-3 py-2" {...props}>
        {children}
      </td>
    );
  },
  ul({ children, ...props }) {
    return (
      <ul className="list-disc pl-6 space-y-1 my-2" {...props}>
        {children}
      </ul>
    );
  },
  ol({ children, ...props }) {
    return (
      <ol className="list-decimal pl-6 space-y-1 my-2" {...props}>
        {children}
      </ol>
    );
  },
  li({ children, ...props }) {
    return (
      <li className="text-sm" {...props}>
        {children}
      </li>
    );
  },
  a({ children, ...props }) {
    return (
      <a className="text-primary underline hover:underline-offset-2" {...props}>
        {children}
      </a>
    );
  },
};

interface ResultsDisplayProps {
  modelIds: ModelId[];
  results: ResultState;
  isEmpty?: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  modelIds,
  results,
  isEmpty = false,
}) => {
  const normalizeOutput = (output: string) => output;

  if (isEmpty || modelIds.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center border-dashed p-8 text-center">
        <div>
          <p className="text-muted-foreground font-medium">No models selected</p>
          <p className="text-sm text-muted-foreground mt-1">
            Select models and run a test to see results
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full w-full rounded-md border bg-card/30">
      <div className="flex h-full w-max min-h-full divide-x divide-border">
        {modelIds.map((modelId) => {
          const result = results[modelId];
          const modelInfo = getFullModelInfo(modelId);

          return (
            <div
              key={modelId}
              className="flex min-h-full w-[420px] flex-shrink-0 flex-grow-0 flex-col gap-4 p-6 lg:w-[520px]"
            >
              {/* Model Header */}
              <div className="border-b pb-4 space-y-3">
                <div>
                  <h3 className="text-lg font-semibold">{modelInfo.modelName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {modelInfo.providerName}
                  </p>
                </div>
                
                {/* Token Usage Display */}
                {result?.tokenUsage && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {result.tokenUsage.promptTokens !== undefined && (
                      <Badge variant="outline" className="text-xs">
                        Prompt: {result.tokenUsage.promptTokens.toLocaleString()} tokens
                      </Badge>
                    )}
                    {result.tokenUsage.completionTokens !== undefined && (
                      <Badge variant="outline" className="text-xs">
                        Completion: {result.tokenUsage.completionTokens.toLocaleString()} tokens
                      </Badge>
                    )}
                    {result.tokenUsage.totalTokens !== undefined && (
                      <Badge variant="secondary" className="text-xs">
                        Total: {result.tokenUsage.totalTokens.toLocaleString()} tokens
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Model Content */}
              <div className="flex-1 space-y-3">
                {result?.error ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{result.error}</AlertDescription>
                  </Alert>
                ) : (
                  <>
                    {result?.isLoading && !result?.output && (
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    )}

                    {(result?.output || !result?.isLoading) && (
                      <div className="text-sm text-foreground p-4 pr-6 leading-relaxed shadow-inner overflow-y-auto rounded-md bg-muted/30 space-y-3">
                        {result?.isLoading && (
                          <Badge variant="outline" className="text-xs">
                            Streaming...
                          </Badge>
                        )}

                        {result?.output ? (
                          <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed">
                            {normalizeOutput(result.output)}
                          </pre>
                        ) : (
                          <span className="text-muted-foreground">No output yet</span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default ResultsDisplay;
