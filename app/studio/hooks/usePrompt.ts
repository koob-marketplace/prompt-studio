'use client';

import { useState, useCallback, useMemo } from 'react';
import { PromptNode, NodeType } from '../types';
import { 
  promptNodesToJson, 
  promptNodesToXml, 
  promptNodesToMarkdown,
  promptNodesToYaml,
  promptNodesToToon
} from '@/lib/utils/transform';

const createNewNode = (
  type: NodeType,
  key = ''
): PromptNode => ({
  id: crypto.randomUUID(),
  key,
  value: type === 'string' ? '' : '',
  values: type === 'stringArray' ? [''] : [],
  type,
});

const arrayMove = <T,>(array: T[], from: number, to: number): T[] => {
  const newArray = array.slice();
  const [removed] = newArray.splice(from, 1);
  newArray.splice(to, 0, removed);
  return newArray;
};

export const usePrompt = (initialNodes: PromptNode[] = []) => {
  const [nodes, setNodes] = useState<PromptNode[]>(initialNodes);

  const updateNode = useCallback(
    (id: string, updates: Partial<Omit<PromptNode, 'id'>>) => {
      setNodes((currentNodes) =>
        currentNodes.map((node) => {
          if (node.id === id) {
            const updatedNode = { ...node, ...updates };
            // Reset approprié selon le type
            if (updates.type && updates.type !== node.type) {
              if (updates.type === 'string') {
                updatedNode.value = '';
                updatedNode.values = [];
              } else if (updates.type === 'stringArray') {
                updatedNode.value = '';
                updatedNode.values = [''];
              }
            }
            return updatedNode;
          }
          return node;
        })
      );
    },
    []
  );

  const removeNode = useCallback((id: string) => {
    setNodes((currentNodes) => currentNodes.filter((node) => node.id !== id));
  }, []);

  const addNode = useCallback((type: NodeType) => {
    const newNode = createNewNode(type);
    setNodes((currentNodes) => [...currentNodes, newNode]);
  }, []);

  const moveNode = useCallback((activeId: string, overId: string) => {
    if (activeId === overId) return;
    
    setNodes((currentNodes) => {
      const activeIndex = currentNodes.findIndex((n) => n.id === activeId);
      const overIndex = currentNodes.findIndex((n) => n.id === overId);

      if (activeIndex !== -1 && overIndex !== -1) {
        return arrayMove(currentNodes, activeIndex, overIndex);
      }
      return currentNodes;
    });
  }, []);

  // Gestion des array items
  const addArrayItem = useCallback((nodeId: string) => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.id === nodeId && node.type === 'stringArray') {
          return {
            ...node,
            values: [...node.values, '']
          };
        }
        return node;
      })
    );
  }, []);

  const removeArrayItem = useCallback((nodeId: string, index: number) => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.id === nodeId && node.type === 'stringArray') {
          return {
            ...node,
            values: node.values.filter((_, i) => i !== index)
          };
        }
        return node;
      })
    );
  }, []);

  const updateArrayItem = useCallback((nodeId: string, index: number, value: string) => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.id === nodeId && node.type === 'stringArray') {
          const newValues = [...node.values];
          newValues[index] = value;
          return {
            ...node,
            values: newValues
          };
        }
        return node;
      })
    );
  }, []);

  const promptAsJson = useMemo(() => {
    const jsonObject = promptNodesToJson(nodes);
    return JSON.stringify(jsonObject, null, 2);
  }, [nodes]);

  const promptAsXml = useMemo(() => {
    return promptNodesToXml(nodes);
  }, [nodes]);

  const promptAsMarkdown = useMemo(() => {
    return promptNodesToMarkdown(nodes);
  }, [nodes]);

  const promptAsYaml = useMemo(() => {
    return promptNodesToYaml(nodes);
  }, [nodes]);

  const promptAsToon = useMemo(() => {
    return promptNodesToToon(nodes);
  }, [nodes]);

  return {
    nodes,
    setNodes,
    updateNode,
    removeNode,
    addNode,
    moveNode,
    addArrayItem,
    removeArrayItem,
    updateArrayItem,
    promptAsJson,
    promptAsXml,
    promptAsMarkdown,
    promptAsYaml,
    promptAsToon,
  };
};
