import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { ThemeToggle } from './ThemeToggle';

interface NavItem {
  to: string;
  label: string;
}

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  const authedItems: NavItem[] = [
    { to: '/dashboard/url', label: '01 URL' },
    { to: '/dashboard/doc', label: '02 DOC' },
    { to: '/dashboard/account', label: '03 ACCOUNT' },
  ];

  const publicItems: NavItem[] = [
    { to: '/about', label: 'ABOUT' },
  ];

  const items = user ? authedItems : publicItems;

  const desktopNav = (
    <nav className="hidden md:flex items-center space-x-7">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'font-mono text-[11px] uppercase tracking-[0.2em] transition-colors',
              isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            )
          }
        >
          {({ isActive }) => (
            <span className="relative inline-flex items-center">
              {isActive && <span className="w-1 h-1 bg-accent mr-2" />}
              {item.label}
              {isActive && <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-accent" />}
            </span>
          )}
        </NavLink>
      ))}
      <a
        href="https://github.com/rishhbh/layerzero"
        target="_blank"
        rel="noreferrer"
        className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
      >
        GITHUB ↗
      </a>
    </nav>
  );

  const mobileNav = (
    <nav className="md:hidden border-t border-border">
      <div className="mx-auto max-w-[1100px] px-6 flex items-center space-x-6 h-11">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'font-mono text-[10px] uppercase tracking-[0.18em] transition-colors',
                isActive ? 'text-foreground' : 'text-muted-foreground'
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 bg-background">
      <div className="border-b border-border">
        <div className="mx-auto max-w-[1100px] px-6 h-16 flex items-center justify-between">
          <Link
            to={user ? '/dashboard/url' : '/'}
            className="font-heading text-2xl tracking-tight text-foreground hover:opacity-80 transition-opacity"
          >
            layerzero
          </Link>

          {desktopNav}

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <>
                <NavLink to="/dashboard/account" className="hidden sm:block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors">
                  {user.name.split(' ')[0]}
                </NavLink>
                <NavLink to="/dashboard/account" className="h-8 w-8 rounded-[4px] bg-secondary border border-border flex items-center justify-center text-xs font-semibold text-foreground">
                  {user.name.trim().charAt(0).toUpperCase()}
                </NavLink>
                <button
                  onClick={logout}
                  className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  LOGOUT ↗
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors">
                  SIGN IN
                </NavLink>
                <NavLink to="/register" className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground border border-border px-3 h-8 inline-flex items-center hover:border-input transition-colors">
                  GET STARTED ↗
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
      {mobileNav}
    </header>
  );
};

export default Navbar;