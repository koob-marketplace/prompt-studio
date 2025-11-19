export type NodeType = 'string' | 'stringArray';

export type PromptNode = {
  id: string;
  key: string;
  value: string; // Pour type 'string'
  values: string[]; // Pour type 'stringArray'
  type: NodeType;
};
