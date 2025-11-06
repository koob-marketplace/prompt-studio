'use client';

import { Button } from '@/components/ui/button';
import { usePrompt } from '../hooks/usePrompt';
import { Plus } from 'lucide-react';
import dynamic from 'next/dynamic';

const DraggableNodeEditor = dynamic(
  () => import('./DraggableNodeEditor').then(mod => ({ default: mod.DraggableNodeEditor })),
  { ssr: false }
);

type PromptEditorFormProps = {
  promptHook: ReturnType<typeof usePrompt>;
};

export const PromptEditorForm = ({ promptHook }: PromptEditorFormProps) => {
  const { nodes, addChildNode } = promptHook;

  return (
    <div className="space-y-6">
      {nodes.map((node) => (
        <div key={node.id} className="p-4 border rounded-lg bg-background">
          <DraggableNodeEditor node={node} promptHook={promptHook} isRoot />
        </div>
      ))}
    </div>
  );
};
