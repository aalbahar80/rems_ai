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
  const { isAuthenticated, isLoading, token, user, currentFirm, hasHydrated } =
    useAuth();
  const { hasPermission, getPortalAccess } = usePermissions();

  useEffect(() => {
    console.log('🛡️  AuthGuard useEffect:', {
      pathname,
      isAuthenticated,
      isLoading,
      hasHydrated,
      hasToken: !!token,
      hasUser: !!user,
      hasFirm: !!currentFirm,
    });

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
      console.log('📄 Public route, skipping auth check');
      return;
    }

    // Wait for store to be hydrated before making auth decisions
    if (!hasHydrated) {
      console.log('⏳ Waiting for store hydration...');
      return;
    }

    // Wait for auth state to be fully loaded from storage
    if (!isLoading && !isAuthenticated) {
      console.log('🚪 Not authenticated, redirecting to login');
      router.push(`${fallbackPath}?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Additional check: if authenticated but missing critical data, wait a bit more
    if (isAuthenticated && (!user || !currentFirm)) {
      console.log('⏳ Authenticated but missing user/firm data, waiting...');
      return;
    }

    // Check portal access
    if (isAuthenticated && requiredPortal) {
      const accessiblePortals = getPortalAccess();
      console.log('🔐 AuthGuard portal check:', {
        requiredPortal,
        accessiblePortals,
        hasAccess: accessiblePortals.includes(requiredPortal),
        pathname,
      });
      if (!accessiblePortals.includes(requiredPortal)) {
        console.log('❌ Access denied, redirecting to /unauthorized');
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
    hasHydrated,
    pathname,
    requiredPortal,
    requiredPermission,
    router,
    fallbackPath,
    hasPermission,
    getPortalAccess,
  ]);

  // Show loading state while hydrating or loading
  if (isLoading || !hasHydrated) {
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
    console.log('🚫 Not rendering: not authenticated and not public route');
    return null;
  }

  // For authenticated protected routes, wait for critical auth data
  if (
    isAuthenticated &&
    !publicRoutes.includes(pathname) &&
    (!user || !currentFirm)
  ) {
    console.log('⏳ Not rendering: authenticated but missing critical data');
    return null;
  }

  console.log('✅ AuthGuard: Rendering children');
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
