import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { cn } from '../lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className }) => {
  return (
    <div className={cn(
      "prose max-w-none text-foreground dark:prose-invert prose-headings:font-heading prose-headings:font-medium prose-headings:text-foreground prose-strong:text-foreground prose-strong:font-semibold prose-b:text-foreground prose-p:text-muted-foreground prose-p:font-sans prose-li:text-muted-foreground prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:p-4 prose-pre:rounded-[4px]",
      className
    )}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >{content}</ReactMarkdown>
    </div>
  );
};