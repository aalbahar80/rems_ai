import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AuthState,
  User,
  UserFirmAssignment,
  LoginCredentials,
  AuthResponse,
} from '@/types/auth';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  switchFirm: (firmId: number) => void;
  refreshToken: () => Promise<boolean>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      firms: null,
      currentFirm: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });

        try {
          // Call the real backend API
          const response = await fetch(
            'http://localhost:3001/api/v1/auth/login',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(credentials),
            }
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Login failed:', errorData);
            set({ isLoading: false });
            return false;
          }

          const authResponse: AuthResponse = await response.json();

          if (!authResponse.success) {
            console.error('Login failed:', authResponse);
            set({ isLoading: false });
            return false;
          }

          // Get user's firm assignments if they exist
          let userFirms: UserFirmAssignment[] = [];

          // For admin users, they can see all firms or get assigned to specific ones
          if (authResponse.data.user.user_type === 'admin') {
            // For now, we'll create a default system admin assignment
            userFirms = [
              {
                firm_id: 0, // System admin doesn't need a specific firm
                firm_name: 'System Administration',
                user_role: 'admin',
                access_level: 'elevated',
                assigned_at: new Date().toISOString(),
                is_primary: true,
              },
            ];
          } else {
            // For non-admin users, get their actual firm assignments
            try {
              const firmsResponse = await fetch(
                'http://localhost:3001/api/v1/users/' +
                  authResponse.data.user.user_id,
                {
                  headers: {
                    Authorization: `Bearer ${authResponse.data.token}`,
                    'Content-Type': 'application/json',
                  },
                }
              );

              if (firmsResponse.ok) {
                const userData = await firmsResponse.json();
                if (userData.success && userData.data.firm_assignments) {
                  userFirms = userData.data.firm_assignments.map(
                    (assignment: any, index: number) => ({
                      firm_id: assignment.firm_id,
                      firm_name: assignment.firm_name,
                      user_role: assignment.user_role,
                      access_level: assignment.access_level,
                      assigned_at: assignment.assigned_at,
                      is_primary: index === 0, // Mark first assignment as primary
                    })
                  );
                }
              }
            } catch (error) {
              console.error('Failed to fetch user firm assignments:', error);
            }
          }

          // Set default firm assignment if none exist
          if (userFirms.length === 0) {
            userFirms = [
              {
                firm_id: 1,
                firm_name: 'Default Firm',
                user_role: authResponse.data.user.user_type as FirmRole,
                access_level: 'standard',
                assigned_at: new Date().toISOString(),
                is_primary: true,
              },
            ];
          }

          const primaryFirm =
            userFirms.find((f) => f.is_primary) || userFirms[0];

          set({
            user: authResponse.data.user,
            token: authResponse.data.token,
            firms: userFirms,
            currentFirm: primaryFirm,
            isAuthenticated: true,
            isLoading: false,
          });

          return true;
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          return false;
        }
      },

      logout: () => {
        const currentToken = get().token;

        // Clear auth state immediately
        set({
          user: null,
          token: null,
          firms: null,
          currentFirm: null,
          isAuthenticated: false,
          isLoading: false,
        });

        // Call logout API to invalidate token server-side
        if (currentToken) {
          fetch('http://localhost:3001/api/v1/auth/logout', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${currentToken}`,
              'Content-Type': 'application/json',
            },
          }).catch(console.error);
        }
      },

      switchFirm: (firmId: number) => {
        const { firms } = get();
        if (!firms) return;

        const targetFirm = firms.find((f) => f.firm_id === firmId);
        if (targetFirm) {
          set({ currentFirm: targetFirm });
        }
      },

      refreshToken: async () => {
        const { token } = get();
        if (!token) return false;

        try {
          const response = await fetch('/api/v1/auth/refresh', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Token refresh failed');
          }

          const authResponse: AuthResponse = await response.json();

          if (authResponse.success) {
            set({
              token: authResponse.data.token,
              user: authResponse.data.user,
              firms: authResponse.data.firms,
            });
            return true;
          }

          return false;
        } catch (error) {
          console.error('Token refresh error:', error);
          get().logout(); // Logout on refresh failure
          return false;
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'rems-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        firms: state.firms,
        currentFirm: state.currentFirm,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Helper hooks
export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    token: store.token,
    firms: store.firms,
    currentFirm: store.currentFirm,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    login: store.login,
    logout: store.logout,
    switchFirm: store.switchFirm,
    refreshToken: store.refreshToken,
  };
};

export const useCurrentFirm = () => {
  return useAuthStore((state) => state.currentFirm);
};

export const usePermissions = () => {
  const { currentFirm, user } = useAuth();

  // Permission logic based on user role in current firm
  const hasPermission = (resource: string, action: string) => {
    if (!currentFirm || !user) return false;

    // Admin users have all permissions
    if (currentFirm.user_role === 'admin') return true;

    // Role-based permission logic
    const rolePermissions: Record<string, string[]> = {
      accountant: [
        'properties:read',
        'tenants:read',
        'invoices:write',
        'expenses:read',
        'financial:write',
        'settings:read',
      ],
      owner: [
        'properties:read',
        'tenants:read',
        'invoices:read',
        'expenses:read',
        'maintenance:read',
        'financial:read',
      ],
      tenant: [
        'properties:read',
        'contracts:read',
        'invoices:read',
        'maintenance:write',
      ],
      vendor: ['maintenance:read', 'maintenance:write', 'invoices:write'],
      maintenance_staff: [
        'properties:read',
        'maintenance:write',
        'vendors:read',
      ],
    };

    const userPermissions = rolePermissions[currentFirm.user_role] || [];
    return userPermissions.includes(`${resource}:${action}`);
  };

  const getPortalAccess = (): string[] => {
    if (!currentFirm || !user) return [];

    const portalAccess: Record<string, string[]> = {
      admin: ['admin', 'accountant', 'owner'],
      accountant: ['accountant'],
      owner: ['owner', 'accountant'],
      tenant: ['tenant'],
      vendor: ['accountant'], // Vendors access accountant portal for invoicing
      maintenance_staff: ['accountant'], // Staff access accountant portal for work orders
    };

    // Get base portals for user role
    const basePortals = portalAccess[currentFirm.user_role] || [];

    // User type determines additional portal access
    const additionalPortals: string[] = [];
    if (user.user_type === 'owner') {
      additionalPortals.push('owner');
    } else if (user.user_type === 'tenant') {
      additionalPortals.push('tenant');
    }

    return [...new Set([...basePortals, ...additionalPortals])];
  };

  return {
    hasPermission,
    getPortalAccess,
    currentRole: currentFirm?.user_role,
  };
};
