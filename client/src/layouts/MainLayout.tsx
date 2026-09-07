import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground font-sans">
      <div className="shrink-0">
        <Navbar />
      </div>
      <main className="flex flex-1 min-h-0 flex-col">
        <Outlet />
      </main>
      <div className="shrink-0">
        <Footer />
      </div>
    </div>
  );
};
