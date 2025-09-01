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
          // For development - simulate login with mock data
          // TODO: Replace with actual API call when backend is ready
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

          // Determine user type and firm based on email
          let userType: 'admin' | 'owner' | 'tenant' | 'vendor' = 'admin';
          let firmName = 'Demo Property Management';
          let role: 'admin' | 'accountant' | 'manager' | 'staff' | 'readonly' =
            'admin';

          // Handle expected database credentials
          if (credentials.email === 'admin@rems.local') {
            userType = 'admin';
            firmName = 'Kuwait Properties LLC';
            role = 'admin';
          } else if (credentials.email.includes('admin')) {
            userType = 'admin';
            role = 'admin';
          } else if (credentials.email.includes('accountant')) {
            userType = 'admin';
            role = 'accountant';
          } else if (credentials.email.includes('owner')) {
            userType = 'owner';
            role = 'admin';
          } else if (credentials.email.includes('tenant')) {
            userType = 'tenant';
            role = 'readonly';
          }

          // Mock successful login response
          const mockAuthResponse: AuthResponse = {
            success: true,
            data: {
              token: 'mock-jwt-token-' + Date.now(),
              user: {
                id: 1,
                email: credentials.email,
                username: credentials.email.split('@')[0],
                user_type: userType,
                is_active: true,
              },
              firms: [
                {
                  firm_id: 1,
                  firm_name: firmName,
                  role: role,
                  is_primary: true,
                },
              ],
              expires_in: '24h',
            },
          };

          const primaryFirm =
            mockAuthResponse.data.firms.find((f) => f.is_primary) ||
            mockAuthResponse.data.firms[0];

          set({
            user: mockAuthResponse.data.user,
            token: mockAuthResponse.data.token,
            firms: mockAuthResponse.data.firms,
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
        // Clear auth state
        set({
          user: null,
          token: null,
          firms: null,
          currentFirm: null,
          isAuthenticated: false,
          isLoading: false,
        });

        // Call logout API to invalidate token server-side
        fetch('/api/v1/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${get().token}`,
          },
        }).catch(console.error);
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
    if (currentFirm.role === 'admin') return true;

    // Role-based permission logic
    const rolePermissions: Record<string, string[]> = {
      accountant: [
        'properties:read',
        'tenants:read',
        'invoices:write',
        'expenses:read',
      ],
      manager: ['properties:read', 'tenants:write', 'maintenance:write'],
      staff: ['properties:read', 'tenants:read'],
      readonly: ['properties:read'],
    };

    const userPermissions = rolePermissions[currentFirm.role] || [];
    return userPermissions.includes(`${resource}:${action}`);
  };

  const getPortalAccess = (): string[] => {
    if (!currentFirm || !user) return [];

    const portalAccess: Record<string, string[]> = {
      admin: ['admin', 'accountant', 'owner'],
      accountant: ['accountant'],
      manager: ['accountant'],
      staff: ['accountant'],
      readonly: ['accountant'],
    };

    // Add user-type specific portals
    const basePortals = portalAccess[currentFirm.role] || [];

    if (user.user_type === 'owner') {
      basePortals.push('owner');
    } else if (user.user_type === 'tenant') {
      basePortals.push('tenant');
    }

    return [...new Set(basePortals)];
  };

  return {
    hasPermission,
    getPortalAccess,
    currentRole: currentFirm?.role,
  };
};
