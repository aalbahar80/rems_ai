'use client';

import { useEffect } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Header } from '@/components/shared/header';
import { Sidebar } from '@/components/shared/sidebar';
import { cn } from '@/lib/utils';
import type { PortalType } from '@/types/auth';

interface LayoutProps {
  children: React.ReactNode;
  portal?: PortalType;
  className?: string;
  showSidebar?: boolean;
}

export function Layout({
  children,
  portal,
  className,
  showSidebar = true,
}: LayoutProps) {
  // Apply portal-specific theme
  useEffect(() => {
    if (portal) {
      document.body.className = `theme-${portal}`;
    }

    return () => {
      document.body.className = '';
    };
  }, [portal]);

  return (
    <AuthGuard requiredPortal={portal}>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          {showSidebar && portal && (
            <div className="hidden md:flex">
              <Sidebar portal={portal} />
            </div>
          )}

          {/* Page Content */}
          <main
            className={cn(
              'flex-1 overflow-y-auto bg-background',
              showSidebar && 'md:border-l-0',
              className
            )}
          >
            <div className="container mx-auto px-4 py-6 max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

// Portal-specific layouts
export function AdminLayout({ children }: { children: React.ReactNode }) {
  return <Layout portal="admin">{children}</Layout>;
}

export function AccountantLayout({ children }: { children: React.ReactNode }) {
  return <Layout portal="accountant">{children}</Layout>;
}

export function OwnerLayout({ children }: { children: React.ReactNode }) {
  return <Layout portal="owner">{children}</Layout>;
}

export function TenantLayout({ children }: { children: React.ReactNode }) {
  return <Layout portal="tenant">{children}</Layout>;
}

// Public layout (no authentication required)
export function PublicLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {children}
    </div>
  );
}
