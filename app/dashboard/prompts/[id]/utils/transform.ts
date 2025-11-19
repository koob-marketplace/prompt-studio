import { PromptNode } from '../types';

/**
 * Transforme un JSON en liste de PromptNodes simplifiés
 * Seuls 2 types : 'string' et 'stringArray'
 */
export const jsonToPromptNodes = (json: Record<string, unknown>): PromptNode[] => {
  const nodes: PromptNode[] = [];
  
  const processObject = (obj: Record<string, unknown>) => {
    Object.entries(obj).forEach(([key, value]) => {
      const nodeId = crypto.randomUUID();
      
      if (Array.isArray(value)) {
        // Vérifier que c'est un array de strings
        const isStringArray = value.every(item => typeof item === 'string');
        
        if (isStringArray) {
          nodes.push({
            id: nodeId,
            key,
            value: '',
            values: value as string[],
            type: 'stringArray'
          });
        } else {
          // Si l'array contient des objets, les traiter récursivement
          value.forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              processObject({ [`${key}[${index}]`]: item });
            }
          });
        }
      } else if (typeof value === 'object' && value !== null) {
        // Traiter les objets imbriqués en préfixant les clés
        Object.entries(value).forEach(([subKey, subValue]) => {
          const fullKey = `${key}.${subKey}`;
          if (Array.isArray(subValue)) {
            const isStringArray = subValue.every(item => typeof item === 'string');
            if (isStringArray) {
              nodes.push({
                id: crypto.randomUUID(),
                key: fullKey,
                value: '',
                values: subValue as string[],
                type: 'stringArray'
              });
            }
          } else if (typeof subValue === 'string' || typeof subValue === 'number') {
            nodes.push({
              id: crypto.randomUUID(),
              key: fullKey,
              value: String(subValue),
              values: [],
              type: 'string'
            });
          }
        });
      } else {
        // String simple
        nodes.push({
          id: nodeId,
          key,
          value: String(value),
          values: [],
          type: 'string'
        });
      }
    });
  };

  if (typeof json === 'object' && json !== null) {
    processObject(json);
  }

  return nodes;
};

/**
 * Convertit une liste de PromptNodes en JSON
 */
export const promptNodesToJson = (nodes: PromptNode[]): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  
  nodes.forEach(node => {
    if (node.key.includes('.')) {
      // Gérer les clés imbriquées comme "examples.positive"
      const parts = node.key.split('.');
      let current = result;
      
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {} as Record<string, unknown>;
        }
        current = current[parts[i]] as Record<string, unknown>;
      }
      
      const lastKey = parts[parts.length - 1];
      if (node.type === 'string') {
        current[lastKey] = node.value;
      } else if (node.type === 'stringArray') {
        current[lastKey] = node.values;
      }
    } else {
      // Clés simples
      if (node.type === 'string') {
        result[node.key] = node.value;
      } else if (node.type === 'stringArray') {
        result[node.key] = node.values;
      }
    }
  });
  
  return result;
};
