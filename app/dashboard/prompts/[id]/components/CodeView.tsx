'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

type CodeViewProps = {
  code: string;
  language: 'json' | 'xml' | 'markdown' | 'yaml' | 'toon';
}; 

export const CodeView = ({ code, language }: CodeViewProps) => {
  const [copied, setCopied] = useState(false);

  // Map specific languages to Prism/Highlight classes if needed
  // 'toon' uses json highlighting as it's similar
  const languageClass = language === 'toon' ? 'json' : language;

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative h-full w-full max-w-full bg-muted/50 rounded-lg overflow-hidden">
      <div className="absolute top-2 right-2 z-10">
        <Button onClick={handleCopy} variant="ghost" size="sm">
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
      <pre className="h-full w-full max-w-full p-4 rounded-md overflow-auto text-sm min-w-0">
        <code className={`language-${languageClass} break-words whitespace-pre-wrap`}>{code}</code>
      </pre>
    </div>
  );
};
