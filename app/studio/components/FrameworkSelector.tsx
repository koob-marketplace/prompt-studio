'use client';

import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { getFrameworks, loadFramework } from '../actions/framework-actions';
import { jsonToPromptNodes } from '@/lib/utils/transform';
import { PromptNode } from '@/lib/types/PromptNode';

type FrameworkSelectorProps = {
  onSelect: (nodes: PromptNode[]) => void;
};

export const FrameworkSelector = ({ onSelect }: FrameworkSelectorProps) => {
  const [frameworks, setFrameworks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getFrameworks().then(setFrameworks);
  }, []);
 
  const handleSelect = async (name: string) => {
    setIsLoading(true);
    try {
      const jsonContent = await loadFramework(name);
      if (jsonContent) {
        const promptNodes = jsonToPromptNodes(jsonContent);
        onSelect(promptNodes);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Load Framework'}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {frameworks.map((name) => (
          <DropdownMenuItem key={name} onSelect={() => handleSelect(name)}>
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
