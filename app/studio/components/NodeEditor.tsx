'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PromptNode, NodeType } from '../types';
import { usePrompt } from '../hooks/usePrompt';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMemo } from 'react';

type NodeEditorProps = {
  node: PromptNode;
  promptHook: ReturnType<typeof usePrompt>;
  isRoot?: boolean;
};

const AddNodeMenu = ({
  trigger,
  onSelect,
}: {
  trigger: React.ReactNode;
  onSelect: (type: NodeType) => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem onSelect={() => onSelect('string')}>
        Add Text
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={() => onSelect('object')}>
        Add Group
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={() => onSelect('array')}>
        Add List
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export const NodeEditor = ({
  node,
  promptHook,
  isRoot = false,
}: NodeEditorProps) => {
  const { updateNode, removeNode, addChildNode } = promptHook;
  const sortable = useSortable({ id: node.id, disabled: isRoot });
  
  const {
    attributes = {},
    listeners = {},
    setNodeRef,
    transform,
    transition,
    isDragging = false,
  } = sortable || {};

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  
  const childIds = useMemo(() => node.children.map(c => c.id), [node.children]);

  const renderNodeContent = () => {
    switch (node.type) {
      case 'string':
        return (
          <Input
            placeholder="Enter value here..."
            value={node.value}
            onChange={(e) => updateNode(node.id, { value: e.target.value })}
            className="flex-1"
          />
        );
      case 'object':
      case 'array':
        return (
          <div className="pl-4 border-l-2 border-dashed border-border space-y-2">
            <SortableContext items={childIds} strategy={verticalListSortingStrategy}>
              {node.children.map((child) => (
                <NodeEditor key={child.id} node={child} promptHook={promptHook} />
              ))}
            </SortableContext>
            <AddNodeMenu
              onSelect={(type) => addChildNode(node.id, type)}
              trigger={
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Plus size={16} />
                  <span>
                    {node.type === 'array' ? 'Add Item' : 'Add Field'}
                  </span>
                </Button>
              }
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="space-y-2">
      <div className="flex items-center gap-2 group">
        <div {...attributes} {...listeners} className="cursor-grab">
           <GripVertical size={18} className="text-muted-foreground" />
        </div>

        {!isRoot && (
          <Input
            placeholder="Field Name"
            value={node.key}
            onChange={(e) => updateNode(node.id, { key: e.target.value })}
            className="w-48 font-medium"
          />
        )}

        {isRoot && <span className="font-bold text-lg">{node.key}</span>}

        {node.type !== 'string' && (
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
            {node.type === 'object' ? 'Group' : 'List'}
          </span>
        )}
        
        <div className="flex-1" />

        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          {!isRoot && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeNode(node.id)}
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      </div>
      <div className="ml-6">{renderNodeContent()}</div>
    </div>
  );
};
