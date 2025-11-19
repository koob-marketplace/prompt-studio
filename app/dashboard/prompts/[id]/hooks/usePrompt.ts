'use client';

import { useState, useCallback, useMemo } from 'react';
import { PromptNode, NodeType } from '@/lib/types/PromptNode';
import { 
  treeNodesToJson, 
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
  value: '',
  values: type === 'stringArray' ? [''] : [],
  type,
  children: type === 'object' ? [] : undefined,
});

// Helper récursif pour trouver et mettre à jour un nœud dans l'arbre
const updateNodeInTree = (nodes: PromptNode[], id: string, updates: Partial<Omit<PromptNode, 'id'>>): PromptNode[] => {
  return nodes.map(node => {
    if (node.id === id) {
      return { ...node, ...updates };
    }
    if (node.children) {
      return { ...node, children: updateNodeInTree(node.children, id, updates) };
    }
    return node;
  });
};

// Helper récursif pour trouver et supprimer un nœud dans l'arbre
const removeNodeInTree = (nodes: PromptNode[], id: string): PromptNode[] => {
  return nodes.filter(node => node.id !== id).map(node => {
    if (node.children) {
      return { ...node, children: removeNodeInTree(node.children, id) };
    }
    return node;
  });
};

// Helper récursif pour ajouter un enfant à un nœud parent
const addChildNodeInTree = (nodes: PromptNode[], parentId: string, childNode: PromptNode): PromptNode[] => {
  return nodes.map(node => {
    if (node.id === parentId) {
      if (node.type !== 'object') return node; // Ne peut ajouter qu'à un objet
      const newChildren = [...(node.children || []), childNode];
      return { ...node, children: newChildren };
    }
    if (node.children) {
      return { ...node, children: addChildNodeInTree(node.children, parentId, childNode) };
    }
    return node;
  });
};


export const usePrompt = (initialNodes: PromptNode[] = []) => {
  const [nodes, setNodes] = useState<PromptNode[]>(initialNodes);

  const updateNode = useCallback(
    (id: string, updates: Partial<Omit<PromptNode, 'id'>>) => {
      setNodes(currentNodes => updateNodeInTree(currentNodes, id, updates));
    },
    []
  );

  const removeNode = useCallback((id: string) => {
    setNodes(currentNodes => removeNodeInTree(currentNodes, id));
  }, []);
  
  const addNode = useCallback((type: NodeType) => {
    const newNode = createNewNode(type);
    setNodes((currentNodes) => [...currentNodes, newNode]);
  }, []);

  const addChildNode = useCallback((parentId: string, type: NodeType) => {
    const newNode = createNewNode(type);
    setNodes(currentNodes => addChildNodeInTree(currentNodes, parentId, newNode));
  }, []);

  // const moveNode = useCallback((activeId: string, overId: string) => {
  //   // TODO: La logique de déplacement dans un arbre est complexe et nécessite une approche différente.
  //   // À implémenter si le drag-and-drop hiérarchique est nécessaire.
  // }, []);

  // Gestion des array items (nécessite aussi une recherche récursive)
  const updateArrayItemsInTree = (
    nodes: PromptNode[],
    nodeId: string,
    updateFn: (values: string[]) => string[]
  ): PromptNode[] => {
     return nodes.map(node => {
      if (node.id === nodeId && node.type === 'stringArray') {
        return { ...node, values: updateFn(node.values) };
      }
      if (node.children) {
        return { ...node, children: updateArrayItemsInTree(node.children, nodeId, updateFn) };
      }
      return node;
    });
  };
  
  const addArrayItem = useCallback((nodeId: string) => {
    setNodes(currentNodes =>
      updateArrayItemsInTree(currentNodes, nodeId, values => [...values, ''])
    );
  }, []);

  const removeArrayItem = useCallback((nodeId: string, index: number) => {
    setNodes(currentNodes =>
      updateArrayItemsInTree(currentNodes, nodeId, values => values.filter((_, i) => i !== index))
    );
  }, []);

  const updateArrayItem = useCallback((nodeId: string, index: number, value: string) => {
    setNodes(currentNodes =>
      updateArrayItemsInTree(currentNodes, nodeId, values => {
        const newValues = [...values];
        newValues[index] = value;
        return newValues;
      })
    );
  }, []);

  const generatedPrompt = useMemo(() => {
    return treeNodesToJson(nodes);
  }, [nodes]);

  const promptAsJson = useMemo(() => {
    return JSON.stringify(generatedPrompt, null, 2);
  }, [generatedPrompt]);

  const promptAsXml = useMemo(() => {
    // La conversion se fait à partir de la liste de nœuds de base,
    // qui sera transformée en JSON, puis en XML par la fonction utilitaire.
    // Pour cela, il faut aplatir l'arbre en liste simple pour la fonction.
    // NOTE: Idéalement, promptNodesToXml devrait accepter un arbre directement.
    // Pour l'instant, nous allons utiliser une conversion JSON intermédiaire.
    const tempJson = treeNodesToJson(nodes);
    const flattenNodes = (json: Record<string, any>, prefix = ''): PromptNode[] => {
      let result: PromptNode[] = [];
      for (const key in json) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        const value = json[key];
        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
          result = result.concat(flattenNodes(value, fullKey));
        } else if (Array.isArray(value)) {
          result.push({ id: '', key: fullKey, type: 'stringArray', values: value, value: '' });
        } else {
          result.push({ id: '', key: fullKey, type: 'string', value: String(value), values: [] });
        }
      }
      return result;
    };
    return promptNodesToXml(flattenNodes(tempJson));
  }, [nodes]);

  const promptAsMarkdown = useMemo(() => {
    const tempJson = treeNodesToJson(nodes);
     const flattenNodes = (json: Record<string, any>, prefix = ''): PromptNode[] => {
      let result: PromptNode[] = [];
      for (const key in json) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        const value = json[key];
        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
          result = result.concat(flattenNodes(value, fullKey));
        } else if (Array.isArray(value)) {
          result.push({ id: '', key: fullKey, type: 'stringArray', values: value, value: '' });
        } else {
          result.push({ id: '', key: fullKey, type: 'string', value: String(value), values: [] });
        }
      }
      return result;
    };
    return promptNodesToMarkdown(flattenNodes(tempJson));
  }, [nodes]);

  const promptAsYaml = useMemo(() => {
    const tempJson = treeNodesToJson(nodes);
    const flattenNodes = (json: Record<string, any>, prefix = ''): PromptNode[] => {
      let result: PromptNode[] = [];
      for (const key in json) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        const value = json[key];
        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
          result = result.concat(flattenNodes(value, fullKey));
        } else if (Array.isArray(value)) {
          result.push({ id: '', key: fullKey, type: 'stringArray', values: value, value: '' });
        } else {
          result.push({ id: '', key: fullKey, type: 'string', value: String(value), values: [] });
        }
      }
      return result;
    };
    return promptNodesToYaml(flattenNodes(tempJson));
  }, [nodes]);

  const promptAsToon = useMemo(() => {
    const tempJson = treeNodesToJson(nodes);
    const flattenNodes = (json: Record<string, any>, prefix = ''): PromptNode[] => {
      let result: PromptNode[] = [];
      for (const key in json) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        const value = json[key];
        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
          result = result.concat(flattenNodes(value, fullKey));
        } else if (Array.isArray(value)) {
          result.push({ id: '', key: fullKey, type: 'stringArray', values: value, value: '' });
        } else {
          result.push({ id: '', key: fullKey, type: 'string', value: String(value), values: [] });
        }
      }
      return result;
    };
    return promptNodesToToon(flattenNodes(tempJson));
  }, [nodes]);


  return {
    nodes,
    setNodes,
    updateNode,
    removeNode,
    addNode,
    addChildNode,
    // moveNode,
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
