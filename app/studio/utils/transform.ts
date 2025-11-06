import { PromptNode } from '../types';

export const jsonToPromptTree = (
  json: any,
  key: string = 'prompt'
): PromptNode => {
  const rootId = crypto.randomUUID();

  const transform = (
    currentJson: any,
    parentId: string
  ): PromptNode[] => {
    if (typeof currentJson !== 'object' || currentJson === null) {
      return [];
    }

    if (Array.isArray(currentJson)) {
      return currentJson.map((item) => {
        const itemId = crypto.randomUUID();
        const itemType =
          Array.isArray(item)
            ? 'array'
            : typeof item === 'object' && item !== null
            ? 'object'
            : 'string';

        return {
          id: itemId,
          key: '', 
          value: itemType === 'string' ? String(item) : '',
          type: itemType,
          children: transform(item, itemId),
          parentId: parentId,
        };
      });
    } else {
      return Object.entries(currentJson).map(([itemKey, itemValue]) => {
        const itemId = crypto.randomUUID();
        const itemType =
          Array.isArray(itemValue)
            ? 'array'
            : typeof itemValue === 'object' && itemValue !== null
            ? 'object'
            : 'string';

        return {
          id: itemId,
          key: itemKey,
          value: itemType === 'string' ? String(itemValue) : '',
          type: itemType,
          children: transform(itemValue, itemId),
          parentId: parentId,
        };
      });
    }
  };

  return {
    id: rootId,
    key: '',
    value: '',
    type: 'object',
    children: transform(json, rootId),
    parentId: null,
  };
};
