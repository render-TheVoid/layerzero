import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1100px] px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          © {new Date().getFullYear()} layerzero
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          A technical publication for AI summarization
        </span>
        <Link to="/about" className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
          ABOUT ↗
        </Link>
      </div>
    </footer>
  );
};

export default Footer;