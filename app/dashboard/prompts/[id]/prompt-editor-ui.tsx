'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

import { updatePromptAction } from '@/lib/backend/actions';
import { PromptOutput} from '@/lib/backend/types';
import { isSuccessResponse } from '@/lib/backend/utils';

import { usePrompt } from './hooks/usePrompt';
import { jsonToTreeNodes } from '@/lib/utils/transform';
import { PromptNode } from '@/lib/types/PromptNode';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { FrameworkSelector } from './components/FrameworkSelector';
import { NodeEditor } from './components/NodeEditor';
import { AIPromptGenerator } from './components/AIPromptGenerator';
import { CodeView } from './components/CodeView';

export function PromptEditorUI({ prompt }: { prompt: PromptOutput }) {
  const router = useRouter();

  const initialNodes = useMemo(() => {
    if (!prompt.content) {
      return [];
    }
    try {
      const content = JSON.parse(prompt.content);
      return jsonToTreeNodes(content);
    } catch (e) {
      console.error("Failed to parse prompt content", e);
      toast.error("Failed to load prompt content.");
      return [];
    }
  }, [prompt.content]);

  const promptHook = usePrompt(initialNodes);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState(prompt.title);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Veuillez entrer un titre pour votre prompt.');
      return;
    }
    setIsSaving(true);
    try {
      const response = await updatePromptAction(prompt.id, {
        title,
        content: promptHook.promptAsJson,
      });

      if (isSuccessResponse(response)) {
        toast.success('Prompt mis à jour avec succès !');
        router.push('/dashboard/prompts');
        router.refresh();
      } else {
        toast.error(response.error?.message || 'Échec de la mise à jour du prompt.');
      }
    } catch (error) {
      toast.error('Une erreur inattendue est survenue.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAIGenerated = useCallback(
    (content: Record<string, unknown>) => {
      try {
        const jsonData = typeof content === 'string' ? JSON.parse(content) : content;
        const promptNodes = jsonToTreeNodes(jsonData);
        promptHook.setNodes(promptNodes);
      } catch (error) {
        console.error('Failed to parse AI generated content:', error);
        toast.error("Failed to parse AI's response.");
      }
    },
    [promptHook.setNodes]
  );

  return (
    <div className="flex flex-col h-full w-full max-w-full bg-background text-foreground overflow-hidden">
      <div className="flex items-center gap-4 p-4 border-b bg-background sticky top-0 z-10 flex-shrink-0 min-w-0">
        <Input
          placeholder="Titre du prompt..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 min-w-0"
        />
        <Button onClick={handleSave} disabled={isSaving || !title.trim() || promptHook.nodes.length === 0}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>
      
      <div className="flex-grow flex w-full min-w-0 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="w-full min-w-0">
          <ResizablePanel defaultSize={25} minSize={20} className="min-w-0">
            <div className="p-4 h-full overflow-y-auto overflow-x-hidden">
              <h2 className="text-lg font-semibold mb-4">Prompt Editor</h2>
              <div className="space-y-4">
                <AIPromptGenerator onGenerate={handleAIGenerated} />
                <FrameworkSelector
                  onSelect={(nodes: PromptNode[]) => promptHook.setNodes(nodes)}
                />
              </div>
              <div className="mt-4">
                 <NodeEditor nodes={promptHook.nodes} promptHook={promptHook} />
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={75} className="min-w-0">
            <div className="h-full w-full min-w-0 overflow-hidden">
              <Tabs defaultValue="json" className="h-full flex flex-col w-full min-w-0">
                <div className="p-2 flex-shrink-0">
                  <TabsList>
                    <TabsTrigger value="json">JSON</TabsTrigger>
                    <TabsTrigger value="xml">XML</TabsTrigger>
                    <TabsTrigger value="markdown">Markdown</TabsTrigger>
                    <TabsTrigger value="yaml">YAML</TabsTrigger>
                    <TabsTrigger value="toon">TOON</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="json" className="flex-grow min-w-0 overflow-hidden">
                  <CodeView code={promptHook.promptAsJson} language="json" />
                </TabsContent>
                <TabsContent value="xml" className="flex-grow min-w-0 overflow-hidden">
                  <CodeView code={promptHook.promptAsXml} language="xml" />
                </TabsContent>
                <TabsContent value="markdown" className="flex-grow min-w-0 overflow-hidden">
                  <CodeView code={promptHook.promptAsMarkdown} language="markdown" />
                </TabsContent>
                <TabsContent value="yaml" className="flex-grow min-w-0 overflow-hidden">
                  <CodeView code={promptHook.promptAsYaml} language="yaml" />
                </TabsContent>
                <TabsContent value="toon" className="flex-grow min-w-0 overflow-hidden">
                  <CodeView code={promptHook.promptAsToon} language="toon" />
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
