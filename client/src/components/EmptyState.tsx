import React from 'react';
import { Layers } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 md:p-14 text-center">
      <div className="h-12 w-12 rounded-[4px] bg-secondary border border-border flex items-center justify-center text-foreground mb-5">
        {icon || <Layers className="h-6 w-6" />}
      </div>
      <h3 className="text-xl font-heading font-medium text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-sm font-sans">{description}</p>
    </div>
  );
};
