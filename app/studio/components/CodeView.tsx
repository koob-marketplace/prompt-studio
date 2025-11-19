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
    <div className="relative h-full bg-muted/50 rounded-lg">
      <div className="absolute top-2 right-2">
        <Button onClick={handleCopy} variant="ghost" size="sm">
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
      <pre className="h-full w-full p-4 rounded-md overflow-auto text-sm">
        <code className={`language-${languageClass}`}>{code}</code>
      </pre>
    </div>
  );
};
