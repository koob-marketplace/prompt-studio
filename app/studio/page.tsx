'use client';

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
import { PromptNode } from './types';

export default function EditorPage() {
  const promptHook = usePrompt();

  return (
    <div className="flex h-screen bg-background text-foreground mt-20 mx-auto max-w-7xl">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={25} minSize={20}>
          <div className="p-4 h-full">
            <h2 className="text-lg font-semibold mb-4">Prompt Editor</h2>
            <FrameworkSelector onSelect={(nodes: PromptNode[]) => promptHook.setNodes(nodes)} />
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
                </TabsList>
              </div>
              <TabsContent value="json" className="flex-grow">
                <CodeView code={promptHook.promptAsJson} language="json" />
              </TabsContent>
              <TabsContent value="xml" className="flex-grow">
                <CodeView code={promptHook.promptAsXml} language="xml" />
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
