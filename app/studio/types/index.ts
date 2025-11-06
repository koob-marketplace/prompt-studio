export type NodeType = 'object' | 'array' | 'string';

export type PromptNode = {
  id: string;
  key: string;
  value: string;
  type: NodeType;
  children: PromptNode[];
  parentId: string | null;
};
