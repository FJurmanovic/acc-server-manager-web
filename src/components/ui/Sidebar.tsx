'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SidebarProps {
  showUsers: boolean; // true if user has membership.view permission
}

function ServerIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={cn('h-5 w-5', active ? 'text-blue' : 'text-subtle')}>
      <rect x="2" y="3" width="20" height="5" rx="1" />
      <rect x="2" y="10" width="20" height="5" rx="1" />
      <rect x="2" y="17" width="20" height="5" rx="1" />
      <circle cx="6" cy="5.5" r="1" fill="currentColor" />
      <circle cx="6" cy="12.5" r="1" fill="currentColor" />
      <circle cx="6" cy="19.5" r="1" fill="currentColor" />
    </svg>
  );
}

function UsersIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={cn('h-5 w-5', active ? 'text-blue' : 'text-subtle')}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

export function Sidebar({ showUsers }: SidebarProps) {
  const pathname = usePathname();
  const isServers = pathname === '/dashboard' || pathname.startsWith('/dashboard/server');
  const isUsers = pathname.startsWith('/dashboard/membership');

  const navItems = [
    { href: '/dashboard', label: 'Servers', active: isServers, icon: <ServerIcon active={isServers} /> },
    ...(showUsers ? [{ href: '/dashboard/membership', label: 'Users', active: isUsers, icon: <UsersIcon active={isUsers} /> }] : []),
  ];

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-14 flex-col items-center border-r border-border-muted bg-sidebar py-3 md:flex">
        <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg bg-blue">
          <svg viewBox="0 0 24 24" fill="none" stroke="#0d1117" strokeWidth={2.5} className="h-4 w-4">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>

        <nav className="flex flex-1 flex-col items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                item.active ? 'bg-blue-bg' : 'hover:bg-overlay'
              )}
            >
              {item.icon}
            </Link>
          ))}
        </nav>

        <div className="mt-auto h-7 w-7 rounded-full border-2 border-border bg-overlay" />
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex h-14 items-center justify-around border-t border-border-muted bg-sidebar md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center gap-0.5 px-4 py-2 text-xs transition-colors',
              item.active ? 'text-blue' : 'text-subtle'
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
