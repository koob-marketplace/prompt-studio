'use client';

import Link from 'next/link';
import { FrameworkSelector } from './components/FrameworkSelector';
import { PromptEditorForm } from './components/PromptEditorForm';
import { usePrompt } from './hooks/usePrompt';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { CodeView } from './components/CodeView';
import { PromptNode } from '@/lib/types/PromptNode';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';
import { Navbar1 } from '@/components/navigation/nav-bar';
import { Footer } from '@/components/navigation/footer';

function EditorPageContent() {
  const promptHook = usePrompt();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar at the top */}
      <Navbar1 />
      
      {/* Main content area */}
      <main className="flex-grow flex bg-background text-foreground container mx-auto px-4 py-8">
        <ResizablePanelGroup direction="horizontal" className="flex-grow">
          <ResizablePanel defaultSize={25} minSize={20}>
            <div className="p-4 h-full overflow-y-auto">
              <h2 className="text-lg font-semibold mb-4">Prompt Editor</h2>
              <div className="space-y-6">
                <div className="rounded-3xl border border-border bg-card p-5 shadow-sm shadow-border/30 transition-colors duration-150 dark:border-border dark:bg-card">
                  <p className="text-sm font-semibold text-primary">
                    AI prompt.
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Log in to unlock to generate prompts with AI.
                  </p>
                  <div className="mt-4">
                    <Button asChild className="w-full">
                      <Link
                        href="/auth/login"
                        aria-label="Log in to use AI prompt generation"
                        className="block w-full text-center text-sm font-semibold"
                      >
                        Log in
                      </Link>
                    </Button>
                  </div>
                </div>
                <FrameworkSelector onSelect={(nodes: PromptNode[]) => promptHook.setNodes(nodes as PromptNode[])} />
              </div>
              <div className="mt-4">
                <PromptEditorForm promptHook={promptHook} />
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={75}>
            <div className="h-full">
              <Tabs defaultValue="json" className="h-full flex flex-col">
                <div className="p-2">
                  <TabsList>
                    <TabsTrigger value="json">JSON</TabsTrigger>
                    <TabsTrigger value="xml">XML</TabsTrigger>
                    <TabsTrigger value="markdown">Markdown</TabsTrigger>
                    <TabsTrigger value="yaml">YAML</TabsTrigger>
                    <TabsTrigger value="toon">TOON</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="json" className="flex-grow">
                  <CodeView code={promptHook.promptAsJson} language="json" />
                </TabsContent>
                <TabsContent value="xml" className="flex-grow">
                  <CodeView code={promptHook.promptAsXml} language="xml" />
                </TabsContent>
                <TabsContent value="markdown" className="flex-grow">
                  <CodeView code={promptHook.promptAsMarkdown} language="markdown" />
                </TabsContent>
                <TabsContent value="yaml" className="flex-grow">
                  <CodeView code={promptHook.promptAsYaml} language="yaml" />
                </TabsContent>
                <TabsContent value="toon" className="flex-grow">
                  <CodeView code={promptHook.promptAsToon} language="toon" />
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
      
      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">
          Loading studio...
        </div>
      }
    >
      <EditorPageContent />
    </Suspense>
  );
}
