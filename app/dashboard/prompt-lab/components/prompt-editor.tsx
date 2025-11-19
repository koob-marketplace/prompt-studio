'use client';

import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface PromptEditorProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onSave?: () => void;
  isLoading?: boolean;
}

const PromptEditor: React.FC<PromptEditorProps> = ({
  prompt,
  onPromptChange,
  onSave,
  isLoading = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onPromptChange(e.target.value);
  };

  const handleSave = () => {
    onSave?.();
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex-1 flex flex-col gap-2 h-full">
        <Textarea
          id="prompt-editor"
          placeholder="Type your prompt here. Be specific and detailed for better results."
          value={prompt}
          onChange={handleChange}
          disabled={isLoading}
          className="flex-1 resize-none h-full"
        />
      </div>
      {onSave && (
        <Button
          onClick={handleSave}
          disabled={isLoading || !prompt.trim()}
          variant="outline"
          className="w-full"
        >
          Save Prompt
        </Button>
      )}
    </div>
  );
};

export default PromptEditor;
