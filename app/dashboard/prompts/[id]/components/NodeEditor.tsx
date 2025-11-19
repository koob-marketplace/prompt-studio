'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PromptNode, NodeType } from '@/lib/types/PromptNode';
import { usePrompt } from '../hooks/usePrompt';
import { GripVertical, Plus, Trash2, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type NodeEditorProps = {
  nodes: PromptNode[];
  promptHook: ReturnType<typeof usePrompt>;
  parentId?: string; // ID du parent pour l'ajout de nouveaux nœuds
};

const NodeDisplay = ({ node, promptHook }: { node: PromptNode; promptHook: ReturnType<typeof usePrompt> }) => {
  const { updateNode, removeNode, removeArrayItem, updateArrayItem, addArrayItem, addChildNode } = promptHook;
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderNodeContent = () => {
    switch (node.type) {
      case 'string':
        return (
          <Input
            placeholder="Enter text value..."
            value={node.value}
            onChange={(e) => updateNode(node.id, { value: e.target.value })}
            className="flex-1"
          />
        );
      case 'stringArray':
        return (
          <div className="space-y-2">
            {node.values.map((value, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder={`Item ${index + 1}...`}
                  value={value}
                  onChange={(e) => updateArrayItem(node.id, index, e.target.value)}
                  className="flex-1"
                />
                {node.values.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => removeArrayItem(node.id, index)}>
                    <X size={16} />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => addArrayItem(node.id)}>
              <Plus size={16} />
              Add Item
            </Button>
          </div>
        );
      case 'object':
        return (
          <>
            {!isCollapsed && (
              <div className="space-y-3">
                <NodeEditor nodes={node.children || []} promptHook={promptHook} parentId={node.id} />
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  const getTypeLabel = (type: NodeType) => {
    if (type === 'string') return 'Text';
    if (type === 'stringArray') return 'List';
    return 'Object';
  }

  return (
    <div className="space-y-3 p-4 border rounded-lg bg-background/80">
      <div className="flex items-center gap-2 group">
        
        {node.type === 'object' && (
          <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
          </Button>
        )}

        <Input
          placeholder="Field name..."
          value={node.key}
          onChange={(e) => updateNode(node.id, { key: e.target.value })}
          className="w-48 font-medium"
        />

        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
          {getTypeLabel(node.type)}
        </span>
        
        <div className="flex-1" />

        {node.type === 'object' && (
           <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Plus size={16} />
                    Add Field
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => addChildNode(node.id, 'string')}>Text</DropdownMenuItem>
                <DropdownMenuItem onClick={() => addChildNode(node.id, 'stringArray')}>List</DropdownMenuItem>
                <DropdownMenuItem onClick={() => addChildNode(node.id, 'object')}>Object</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
           </div>
        )}

        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={() => removeNode(node.id)}>
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
      
      <div className="pl-6">{renderNodeContent()}</div>
    </div>
  );
}


export const NodeEditor = ({ nodes, promptHook, parentId }: NodeEditorProps) => {

  const { addNode } = promptHook;

  const handleAdd = (type: NodeType) => {
    if (parentId) {
      promptHook.addChildNode(parentId, type);
    } else {
      addNode(type);
    }
  };

  return (
    <div className="space-y-4">
      {nodes.map(node => (
        <NodeDisplay key={node.id} node={node} promptHook={promptHook} />
      ))}
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Plus size={16} />
            Add New Field
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleAdd('string')}>Text</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAdd('stringArray')}>List</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAdd('object')}>Object</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};