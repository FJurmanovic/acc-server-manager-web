// NOTE: intentionally no 'use client' — must remain a Server Component
import { Sidebar } from './Sidebar';

interface AppShellProps {
  children: React.ReactNode;
  showUsers: boolean;
}

export function AppShell({ children, showUsers }: AppShellProps) {
  return (
    <div className="min-h-screen bg-base">
      <Sidebar showUsers={showUsers} />
      {/* Offset for sidebar (desktop: left margin, mobile: bottom padding) */}
      <div className="pb-14 md:pb-0 md:pl-14">
        {children}
      </div>
    </div>
  );
}
