import { PromptNode } from '@/lib/types/PromptNode';
import yaml from 'js-yaml';

/**
 * Transforme un JSON en liste de PromptNodes simplifiés de manière récursive
 * Gère les objets imbriqués et les tableaux de chaînes.
 */
export const jsonToPromptNodes = (json: Record<string, unknown>): PromptNode[] => {
  const nodes: PromptNode[] = [];

  function processEntry(key: string, value: any, prefix = '') {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
      nodes.push({
        id: crypto.randomUUID(),
        key: fullKey,
        value: '',
        values: value as string[],
        type: 'stringArray',
      });
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // C'est un objet, on continue la récursion
      Object.entries(value).forEach(([subKey, subValue]) => {
        processEntry(subKey, subValue, fullKey);
      });
    } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      // C'est une valeur simple
      nodes.push({
        id: crypto.randomUUID(),
        key: fullKey,
        value: String(value),
        values: [],
        type: 'string',
      });
    }
    // Les autres types (ex: tableaux d'objets) sont ignorés pour le moment
  }

  Object.entries(json).forEach(([key, value]) => {
    processEntry(key, value);
  });

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

/**
 * Convertit une liste de PromptNodes en XML
 */

const jsonToXmlRecursive = (json: Record<string, any>, indent = ''): string => {
  let xml = '';
  for (const key in json) {
    if (!Object.prototype.hasOwnProperty.call(json, key)) continue;

    const value = json[key];
    xml += `${indent}<${key}>`;

    if (Array.isArray(value)) {
      xml += '\n';
      value.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          xml += `${indent}  <item>\n`;
          xml += jsonToXmlRecursive(item, indent + '    ');
          xml += `${indent}  </item>\n`;
        } else {
          xml += `${indent}  <item>${String(item)}</item>\n`;
        }
      });
      xml += `${indent}`;
    } else if (typeof value === 'object' && value !== null) {
      xml += '\n';
      xml += jsonToXmlRecursive(value, indent + '  ');
      xml += `${indent}`;
    } else {
      xml += String(value);
    }

    xml += `</${key}>\n`;
  }
  return xml;
};

export const promptNodesToXml = (nodes: PromptNode[]): string => {
  const json = promptNodesToJson(nodes);
  let xml = '<prompt>\n';
  xml += jsonToXmlRecursive(json, '  ');
  xml += '</prompt>';
  return xml;
};

/**
 * Convertit une liste de PromptNodes en Markdown
 */

const jsonToMarkdownRecursive = (json: Record<string, any>, level: number): string => {
  let markdown = '';
  const heading = '#'.repeat(level);

  for (const key in json) {
    if (!Object.prototype.hasOwnProperty.call(json, key)) continue;

    const value = json[key];
    markdown += `${heading} ${key}\n\n`;

    if (Array.isArray(value)) {
      value.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          // Pour les objets dans des tableaux, on les affiche en bloc de code JSON
          markdown += '```json\n' + JSON.stringify(item, null, 2) + '\n```\n\n';
        } else {
          markdown += `- ${String(item)}\n`;
        }
      });
      markdown += '\n';
    } else if (typeof value === 'object' && value !== null) {
      markdown += jsonToMarkdownRecursive(value, level + 1);
    } else {
      markdown += `${String(value)}\n\n`;
    }
  }
  return markdown;
};

export const promptNodesToMarkdown = (nodes: PromptNode[]): string => {
  const json = promptNodesToJson(nodes);
  return jsonToMarkdownRecursive(json, 2); // Commence avec des titres de niveau 2 (##)
};

/**
 * Convertit une liste de PromptNodes en YAML
 */
export const promptNodesToYaml = (nodes: PromptNode[]): string => {
  const json = promptNodesToJson(nodes);
  return yaml.dump(json);
};

/**
 * Convertit une liste de PromptNodes en TOON (Token-Oriented Object Notation)
 * Basé sur les spécifications fournies par l'utilisateur :
 * - Clés suivies de :
 * - Tableaux avec compteur [N]: item1,item2
 * - Citations intelligentes (si virgule, retour ligne ou double quote)
 * - Indentation par espaces
 * - Double saut de ligne entre les blocs principaux
 */
export const promptNodesToToon = (nodes: PromptNode[]): string => {
  const json = promptNodesToJson(nodes);
  
  const toToonRecursive = (obj: any, indentLevel = 0): string => {
    const indent = '  '.repeat(indentLevel);
    
    if (obj === null) return 'null';
    if (typeof obj === 'undefined') return '';
    
    if (Array.isArray(obj)) {
       // Les tableaux sont gérés au niveau de la clé parente généralement, 
       // mais si on tombe sur un tableau "orphelin" (ex: valeur racine), on le traite.
       return ''; 
    }
    
    if (typeof obj === 'object') {
      const keys = Object.keys(obj);
      return keys.map(key => {
        const value = obj[key];
        const cleanKey = key; // Les clés semblent brutes dans l'exemple
        
        if (Array.isArray(value)) {
          const count = value.length;
          // Format: key[count]: item1,item2
          const items = value.map(item => {
              const str = String(item);
              // Règle de citation: si contient virgule, double quote ou retour ligne -> on cite
              return str.match(/[,"\n]/) ? `"${str.replace(/"/g, '\\"')}"` : str;
          }).join(',');
          return `${indent}${cleanKey}[${count}]: ${items}`;
        } else if (typeof value === 'object' && value !== null) {
          // Format: key:\n  children...
          // Utilise toToonRecursive pour les enfants avec indentation accrue
          return `${indent}${cleanKey}:\n${toToonRecursive(value, indentLevel + 1)}`;
        } else {
          // Format: key: value
          const str = String(value);
          // Règle de citation similaire
          const formattedValue = str.match(/[,"\n]/) ? `"${str.replace(/"/g, '\\"')}"` : str;
          return `${indent}${cleanKey}: ${formattedValue}`;
        }
      }).join('\n'); // Simple saut de ligne entre les propriétés
    }
    
    return String(obj);
  };

  return toToonRecursive(json);
};

/**
 * ============================================================================
 * NOUVELLES FONCTIONS POUR L'ÉDITEUR EN ARBORESCENCE
 * ============================================================================
 */

/**
 * Transforme un JSON en une arborescence de PromptNodes
 */
export const jsonToTreeNodes = (json: Record<string, any>): PromptNode[] => {
  const process = (key: string, value: any): PromptNode => {
    const baseNode = { id: crypto.randomUUID(), key };

    if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
      return { ...baseNode, value: '', values: value, type: 'stringArray' };
    }

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return {
        ...baseNode,
        value: '',
        values: [],
        type: 'object',
        children: Object.entries(value).map(([subKey, subValue]) => process(subKey, subValue)),
      };
    }

    // Gère string, number, boolean
    return { ...baseNode, value: String(value), values: [], type: 'string' };
  };

  return Object.entries(json).map(([key, value]) => process(key, value));
};


/**
 * Convertit une arborescence de PromptNodes en JSON
 */
export const treeNodesToJson = (nodes: PromptNode[]): Record<string, any> => {
  const result: Record<string, any> = {};

  nodes.forEach(node => {
    if (node.type === 'object' && node.children) {
      result[node.key] = treeNodesToJson(node.children);
    } else if (node.type === 'stringArray') {
      result[node.key] = node.values;
    } else { // 'string'
      result[node.key] = node.value;
    }
  });

  return result;
};
