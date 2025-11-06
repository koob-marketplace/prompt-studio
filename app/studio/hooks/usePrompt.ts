'use client';

import { useState, useCallback, useMemo } from 'react';
import { PromptNode, NodeType } from '../types';

const createNewNode = (
  type: NodeType,
  parentId: string | null = null,
  key = ''
): PromptNode => ({
  id: crypto.randomUUID(),
  key,
  value: '',
  type,
  children: [],
  parentId,
});

const recursivelyUpdateNode = (
  nodes: PromptNode[],
  id: string,
  updates: Partial<Omit<PromptNode, 'id'>>
): PromptNode[] => {
  return nodes.map((node) => {
    if (node.id === id) {
      const updatedNode = { ...node, ...updates };
      // When changing type, reset value/children
      if (updates.type && updates.type !== node.type) {
        if (updates.type === 'string') {
          updatedNode.children = [];
        } else {
          updatedNode.value = '';
        }
      }
      return updatedNode;
    }
    if (node.children.length > 0) {
      return {
        ...node,
        children: recursivelyUpdateNode(node.children, id, updates),
      };
    }
    return node;
  });
};

const recursivelyRemoveNode = (
  nodes: PromptNode[],
  id: string
): PromptNode[] => {
  return nodes.filter((node) => node.id !== id).map((node) => {
    if (node.children.length > 0) {
      return { ...node, children: recursivelyRemoveNode(node.children, id) };
    }
    return node;
  });
};

const recursivelyAddChildNode = (
  nodes: PromptNode[],
  parentId: string,
  newNode: PromptNode
): PromptNode[] => {
  return nodes.map((node) => {
    if (node.id === parentId) {
      return { ...node, children: [...node.children, newNode] };
    }
    if (node.children.length > 0) {
      return {
        ...node,
        children: recursivelyAddChildNode(node.children, parentId, newNode),
      };
    }
    return node;
  });
};

const arrayMove = <T,>(array: T[], from: number, to: number): T[] => {
  const newArray = array.slice();
  const [removed] = newArray.splice(from, 1);
  newArray.splice(to, 0, removed);
  return newArray;
};

const recursivelyMoveNode = (
  nodes: PromptNode[],
  activeId: string,
  overId: string
): PromptNode[] => {
  const activeIndex = nodes.findIndex((n) => n.id === activeId);
  const overIndex = nodes.findIndex((n) => n.id === overId);

  if (activeIndex !== -1 && overIndex !== -1) {
    return arrayMove(nodes, activeIndex, overIndex);
  }

  return nodes.map((node) => {
    if (node.children && node.children.length > 0) {
      return {
        ...node,
        children: recursivelyMoveNode(node.children, activeId, overId),
      };
    }
    return node;
  });
};


const convertToJSON = (nodes: PromptNode[]): any => {
  const result: { [key: string]: any } = {};
  nodes.forEach((node) => {
    if (!node.key) {
      if (node.type === 'object') {
        Object.assign(result, convertToJSON(node.children));
      }
      return;
    }
    if (node.type === 'string') {
      result[node.key] = node.value;
    } else if (node.type === 'object') {
      result[node.key] = convertToJSON(node.children);
    } else if (node.type === 'array') {
      result[node.key] = node.children.map((child) => {
        if (child.type === 'string') return child.value;
        if (child.type === 'object') return convertToJSON(child.children);
        return null;
      });
    }
  });
  return result;
};

const convertToXML = (nodes: PromptNode[], indent = '  '): string => {
  return nodes
    .map((node) => {
      const tag = node.key || 'item';
      if (node.type === 'string') {
        return `${indent}<${tag}>${node.value}</${tag}>`;
      }
      if (node.type === 'object' || node.type === 'array') {
        return `${indent}<${tag}>\n${convertToXML(
          node.children,
          indent + '  '
        )}\n${indent}</${tag}>`;
      }
      return '';
    })
    .join('\n');
};

export const usePrompt = (initialNodes: PromptNode[] = []) => {
  const [nodes, setNodes] = useState<PromptNode[]>(
    initialNodes.length > 0 ? initialNodes : [createNewNode('object', null, 'prompt')]
  );

  const updateNode = useCallback(
    (id: string, updates: Partial<Omit<PromptNode, 'id'>>) => {
      setNodes((currentNodes) =>
        recursivelyUpdateNode(currentNodes, id, updates)
      );
    },
    []
  );

  const removeNode = useCallback((id: string) => {
    setNodes((currentNodes) => recursivelyRemoveNode(currentNodes, id));
  }, []);

  const addChildNode = useCallback((parentId: string, type: NodeType) => {
    const newNode = createNewNode(type, parentId);
    setNodes((currentNodes) =>
      recursivelyAddChildNode(currentNodes, parentId, newNode)
    );
  }, []);

  const moveNode = useCallback((activeId: string, overId: string) => {
    if (activeId === overId) return;
    setNodes((currentNodes) =>
      recursivelyMoveNode(currentNodes, activeId, overId)
    );
  }, []);

  const promptAsJson = useMemo(() => {
    const jsonObject = convertToJSON(nodes);
    return JSON.stringify(jsonObject, null, 2);
  }, [nodes]);

  const promptAsXml = useMemo(() => {
    return `<root>\n${convertToXML(nodes)}\n</root>`;
  }, [nodes]);

  return {
    nodes,
    setNodes,
    updateNode,
    removeNode,
    addChildNode,
    moveNode,
    promptAsJson,
    promptAsXml,
  };
};
