'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles, Copy, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { generatePromptWithAI } from '../actions/ai-actions';
import { toast } from 'sonner';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { LoginDialog } from '@/components/auth/LoginDialog';

type AIPromptGeneratorProps = {
  onGenerate: (content: Record<string, unknown>) => void;
};

export const AIPromptGenerator = ({ onGenerate }: AIPromptGeneratorProps) => {
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [userRequest, setUserRequest] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedJSON, setGeneratedJSON] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { isAuthenticated } = useAuthContext();

  const handleGenerate = async () => {
    if (!userRequest.trim()) {
      toast.error('Please describe what you want');
      return;
    }

    setIsLoading(true);
    try {
      const result = await generatePromptWithAI(userRequest);

      if (result.success && result.content) {
        setGeneratedJSON(result.content as string);
        setUserRequest('');
        toast.success('Prompt generated! ✨');
      } else {
        toast.error(result.error || 'Failed to generate prompt');
      }
    } catch (error) {
      console.error('Error generating prompt:', error);
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleCopy = async () => {
    if (generatedJSON) {
      await navigator.clipboard.writeText(generatedJSON);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUse = () => {
    if (generatedJSON) {
      try {
        // Parser le JSON et l'envoyer directement
        const parsedJSON = JSON.parse(generatedJSON);
        onGenerate(parsedJSON);
        toast.success('Prompt added to editor!');
        setGeneratedJSON(null);
        setIsAIDialogOpen(false);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        toast.error('Invalid JSON format');
      }
    }
  };

  const handleAIDialogChange = (open: boolean) => {
    setIsAIDialogOpen(open);
    if (!open) {
      setUserRequest('');
      setGeneratedJSON(null);
      setCopied(false);
    }
  };

  const handleButtonClick = () => {
    if (!isAuthenticated) {
      setIsLoginDialogOpen(true);
      return;
    }
    setIsAIDialogOpen(true);
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="w-full gap-2"
        onClick={handleButtonClick}
      >
        <Sparkles className="h-4 w-4" />
        Generate Prompt with AI
      </Button>
      
      <LoginDialog 
        open={isLoginDialogOpen} 
        onOpenChange={setIsLoginDialogOpen} 
      />
      
      <Dialog open={isAIDialogOpen} onOpenChange={handleAIDialogChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Prompt JSON</DialogTitle>
          <DialogDescription>
            Describe the prompt you want to create and let AI generate the JSON structure
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Describe the prompt you want to create..."
              value={userRequest}
              onChange={(e) => setUserRequest(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="bg-background"
            />
            <Button
              onClick={handleGenerate}
              disabled={isLoading || !userRequest.trim()}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
            </Button>
          </div>

          {generatedJSON && (
            <div className="space-y-3 border rounded-lg p-4 bg-muted/50">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Generated JSON:</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  title="Copy JSON"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded p-3 border border-gray-200 dark:border-gray-700 max-h-48 overflow-auto">
                <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                  {JSON.stringify(JSON.parse(generatedJSON), null, 2)}
                </pre>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleUse} size="sm" className="flex-1">
                  Use This Prompt
                </Button>
                <Button
                  onClick={() => setGeneratedJSON(null)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Discard
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
      </Dialog>
    </>
  );
};
