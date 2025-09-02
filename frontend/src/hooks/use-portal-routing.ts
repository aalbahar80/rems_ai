'use client';

import { useRouter } from 'next/navigation';
import { useAuth, usePermissions } from '@/lib/auth-store';
import type { PortalType, UserType } from '@/types/auth';

export function usePortalRouting() {
  const router = useRouter();
  const { user, currentFirm } = useAuth();
  const { getPortalAccess } = usePermissions();

  const getDefaultPortalForUser = (): PortalType | null => {
    console.log('🏠 getDefaultPortalForUser called:', {
      user: user?.username,
      currentFirm: currentFirm?.firm_name,
    });

    if (!user || !currentFirm) {
      console.log('🚫 getDefaultPortalForUser: Missing data, returning null');
      return null;
    }

    const accessiblePortals = getPortalAccess();

    // Priority order based on user type and role
    const priorityOrder: PortalType[] = [];

    // User type based priorities
    if (user.user_type === 'admin') {
      priorityOrder.push('admin');
    } else if (user.user_type === 'owner') {
      priorityOrder.push('owner');
    } else if (user.user_type === 'tenant') {
      priorityOrder.push('tenant');
    }

    // Role based priorities
    if (currentFirm.user_role === 'admin') {
      priorityOrder.push('admin', 'accountant');
    } else if (currentFirm.user_role === 'accountant') {
      priorityOrder.push('accountant');
    }

    // Find first accessible portal
    for (const portal of priorityOrder) {
      if (accessiblePortals.includes(portal)) {
        return portal;
      }
    }

    // Fallback to first accessible portal
    return (accessiblePortals[0] as PortalType) || null;
  };

  const navigateToDefaultPortal = () => {
    console.log('🧭 navigateToDefaultPortal called');
    const defaultPortal = getDefaultPortalForUser();
    console.log('🧭 Default portal determined:', defaultPortal);

    if (defaultPortal) {
      console.log(`✅ Navigating to /${defaultPortal}`);
      router.push(`/${defaultPortal}`);
    } else {
      console.log('❌ No default portal found, redirecting to /unauthorized');
      router.push('/unauthorized');
    }
  };

  const navigateToPortal = (portal: PortalType) => {
    const accessiblePortals = getPortalAccess();

    if (accessiblePortals.includes(portal)) {
      router.push(`/${portal}`);
    } else {
      router.push('/unauthorized');
    }
  };

  const getPortalRoutes = () => {
    const accessiblePortals = getPortalAccess();

    return {
      admin: {
        available: accessiblePortals.includes('admin'),
        path: '/admin',
        name: 'Admin Portal',
        description: 'System administration and configuration',
      },
      accountant: {
        available: accessiblePortals.includes('accountant'),
        path: '/accountant',
        name: 'Accountant Portal',
        description: 'Property and financial management',
      },
      owner: {
        available: accessiblePortals.includes('owner'),
        path: '/owner',
        name: 'Owner Portal',
        description: 'Portfolio monitoring and approvals',
      },
      tenant: {
        available: accessiblePortals.includes('tenant'),
        path: '/tenant',
        name: 'Tenant Portal',
        description: 'Payments and maintenance requests',
      },
    };
  };

  const isCurrentPortal = (portal: PortalType): boolean => {
    // This would need to be implemented based on current route
    // For now, returning false - to be enhanced when routes are defined
    return false;
  };

  return {
    getDefaultPortalForUser,
    navigateToDefaultPortal,
    navigateToPortal,
    getPortalRoutes,
    isCurrentPortal,
    accessiblePortals: getPortalAccess(),
  };
}
