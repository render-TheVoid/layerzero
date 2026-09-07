import React from 'react';
import { Label } from './ui/label';

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ value, onChange, disabled }) => {
  const isDevelopment = import.meta.env.DEV;

  return (
    <div className="space-y-2">
      <Label htmlFor="model-select" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
        AI Model Engine
      </Label>
      <select
        id="model-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="flex h-11 w-full rounded-[4px] border border-border bg-surface px-4 py-2 text-sm text-foreground transition-all focus-visible:outline-none focus-visible:border-accent/60 focus-visible:ring-1 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-50 appearance-none font-sans"
      >
        <option value="gemini" className="bg-surface text-foreground">Gemini 3.5 Flash (Cloud Reasoning)</option>
        <option value="groq" className="bg-surface text-foreground">Groq GPT-OSS-120B (High-Speed Inference)</option>
        <option value="sarvam" className="bg-surface text-foreground">Sarvam 30B (Hinglish & Multilingual)</option>
        {isDevelopment && <option value="gemma" className="bg-surface text-foreground">Gemma 4 (Local Offline Inference)</option>}
      </select>
    </div>
  );
};
