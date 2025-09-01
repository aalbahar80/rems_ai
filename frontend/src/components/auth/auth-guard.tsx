'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth, usePermissions } from '@/lib/auth-store';
import type { PortalType } from '@/types/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredPortal?: PortalType;
  requiredPermission?: {
    resource: string;
    action: string;
  };
  fallbackPath?: string;
}

export function AuthGuard({
  children,
  requiredPortal,
  requiredPermission,
  fallbackPath = '/login',
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, token } = useAuth();
  const { hasPermission, getPortalAccess } = usePermissions();

  useEffect(() => {
    // Skip auth check for public routes
    const publicRoutes = [
      '/login',
      '/register',
      '/forgot-password',
      '/',
      '/demo',
      '/about',
      '/contact',
      '/privacy',
      '/terms',
      '/support',
    ];
    if (publicRoutes.includes(pathname)) {
      return;
    }

    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push(`${fallbackPath}?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Check portal access
    if (isAuthenticated && requiredPortal) {
      const accessiblePortals = getPortalAccess();
      if (!accessiblePortals.includes(requiredPortal)) {
        router.push('/unauthorized');
        return;
      }
    }

    // Check specific permissions
    if (isAuthenticated && requiredPermission) {
      if (
        !hasPermission(requiredPermission.resource, requiredPermission.action)
      ) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    pathname,
    requiredPortal,
    requiredPermission,
    router,
    fallbackPath,
    hasPermission,
    getPortalAccess,
  ]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Define public routes for the render check as well
  const publicRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/',
    '/demo',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/support',
  ];

  // Don't render children until authentication is verified
  if (!isAuthenticated && !publicRoutes.includes(pathname)) {
    return null;
  }

  return <>{children}</>;
}

// HOC for protecting pages
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<AuthGuardProps, 'children'>
) {
  return function AuthGuardedComponent(props: P) {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}

// Portal-specific guards
export const AdminGuard = ({ children }: { children: React.ReactNode }) => (
  <AuthGuard requiredPortal="admin">{children}</AuthGuard>
);

export const AccountantGuard = ({
  children,
}: {
  children: React.ReactNode;
}) => <AuthGuard requiredPortal="accountant">{children}</AuthGuard>;

export const OwnerGuard = ({ children }: { children: React.ReactNode }) => (
  <AuthGuard requiredPortal="owner">{children}</AuthGuard>
);

export const TenantGuard = ({ children }: { children: React.ReactNode }) => (
  <AuthGuard requiredPortal="tenant">{children}</AuthGuard>
);
