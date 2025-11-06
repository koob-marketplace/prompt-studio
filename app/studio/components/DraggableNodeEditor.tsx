'use client';

import { NodeEditor } from './NodeEditor';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { usePrompt } from '../hooks/usePrompt';
import { PromptNode } from '../types';

type DraggableNodeEditorProps = {
  node: PromptNode;
  promptHook: ReturnType<typeof usePrompt>;
  isRoot?: boolean;
};

export const DraggableNodeEditor = ({ node, promptHook, isRoot }: DraggableNodeEditorProps) => {
  const { moveNode } = promptHook;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      moveNode(active.id as string, over.id as string);
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <NodeEditor node={node} promptHook={promptHook} isRoot={isRoot} />
    </DndContext>
  );
};
