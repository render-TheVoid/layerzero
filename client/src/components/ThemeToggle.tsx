import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { cn } from '../lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Toggle theme"
      className={cn(
        "h-8 w-8 rounded-[4px] flex items-center justify-center border border-border bg-secondary text-foreground hover:bg-muted transition-colors cursor-pointer",
        className
      )}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-[#f59e0b]" />
      ) : (
        <Moon className="h-4 w-4 text-foreground" />
      )}
    </button>
  );
};

export default ThemeToggle;
