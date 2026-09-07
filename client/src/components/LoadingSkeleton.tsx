import React from 'react';
import { cn } from '../lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  rows?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ className, rows = 3 }) => {
  return (
    <div className={cn("space-y-4 w-full animate-pulse", className)}>
      <div className="h-6 bg-muted rounded-[3px] w-3/4"></div>
      <div className="space-y-2.5">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-4 bg-muted rounded-[3px] w-full"></div>
        ))}
        <div className="h-4 bg-muted rounded-[3px] w-5/6"></div>
      </div>
    </div>
  );
};
