'use client';

import { usePrompt } from '../hooks/usePrompt';
import { NodeEditor } from './NodeEditor';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

type PromptEditorFormProps = {
  promptHook: ReturnType<typeof usePrompt>;
};

export const PromptEditorForm = ({ promptHook }: PromptEditorFormProps) => {
  const { nodes, addNode } = promptHook;

  return (
    <div className="space-y-4">

      <div className="flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Plus size={16} />
              Add Field
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => addNode('string')}>
              Add Text Field
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => addNode('stringArray')}>
              Add Text List
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
