import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Link as LinkIcon, LogOut, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { ThemeToggle } from '../components/ThemeToggle';

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="h-screen overflow-hidden flex bg-background text-foreground font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link to="/" className="flex items-center cursor-pointer hover:opacity-85 transition-opacity">
            <span className="font-heading font-normal text-2xl tracking-tight text-foreground">layerzero</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          <NavLink
            to="/dashboard/url"
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-3 px-4 py-2.5 rounded-full text-sm font-medium transition-all",
                isActive ? "bg-secondary text-secondary-foreground font-semibold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <LinkIcon className="h-4 w-4" />
            <span>URL Summarizer</span>
          </NavLink>
          <NavLink
            to="/dashboard/doc"
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-3 px-4 py-2.5 rounded-full text-sm font-medium transition-all",
                isActive ? "bg-secondary text-secondary-foreground font-semibold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <FileText className="h-4 w-4" />
            <span>Doc Summarizer</span>
          </NavLink>
          <NavLink
            to="/dashboard/account"
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-3 px-4 py-2.5 rounded-full text-sm font-medium transition-all",
                isActive ? "bg-secondary text-secondary-foreground font-semibold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <User className="h-4 w-4" />
            <span>Account</span>
          </NavLink>
        </nav>
        <div className="p-4 border-t border-border">
          <button
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-2.5 w-full rounded-full text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-background">
        {/* Topbar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-end px-6 space-x-4">
          <ThemeToggle />
          <div className="flex items-center space-x-3 text-sm">
            <div className="flex flex-col items-end">
              <span className="font-medium text-foreground">{user?.name || 'User'}</span>
              <span className="text-muted-foreground text-xs">{user?.email || ''}</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-foreground">
              <User className="h-4 w-4" />
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 md:p-8 pb-24 md:pb-8">
          <div className="max-w-4xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
      
      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex items-center justify-around h-16">
        <NavLink
          to="/dashboard/url"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center space-y-1 px-6 py-2 text-xs transition-colors font-medium",
              isActive ? "text-foreground font-semibold" : "text-muted-foreground"
            )
          }
        >
          <LinkIcon className="h-5 w-5" />
          <span>URL</span>
        </NavLink>
        <NavLink
          to="/dashboard/doc"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center space-y-1 px-6 py-2 text-xs transition-colors font-medium",
              isActive ? "text-foreground font-semibold" : "text-muted-foreground"
            )
          }
        >
          <FileText className="h-5 w-5" />
          <span>Doc</span>
        </NavLink>
        <NavLink
          to="/dashboard/account"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center space-y-1 px-6 py-2 text-xs transition-colors font-medium",
              isActive ? "text-foreground font-semibold" : "text-muted-foreground"
            )
          }
        >
          <User className="h-5 w-5" />
          <span>Account</span>
        </NavLink>
        <button
          onClick={logout}
          className="flex flex-col items-center justify-center space-y-1 px-6 py-2 text-xs text-muted-foreground transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default DashboardLayout;
