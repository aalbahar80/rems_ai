// Authentication types for multi-tenant REMS system

export interface User {
  id: number;
  email: string;
  username: string;
  user_type: UserType;
  is_active: boolean;
}

export interface Firm {
  firm_id: number;
  firm_name: string;
  legal_business_name?: string;
  is_active: boolean;
}

export interface UserFirmAssignment {
  firm_id: number;
  firm_name: string;
  role: FirmRole;
  is_primary: boolean;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
    firms: UserFirmAssignment[];
    expires_in: string;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  firms: UserFirmAssignment[] | null;
  currentFirm: UserFirmAssignment | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type UserType = 'admin' | 'owner' | 'tenant' | 'vendor';
export type FirmRole =
  | 'admin'
  | 'accountant'
  | 'manager'
  | 'staff'
  | 'readonly';

export type PortalType = 'admin' | 'accountant' | 'owner' | 'tenant';

// Permission system
export interface Permission {
  resource: string;
  action: 'read' | 'write' | 'delete' | 'approve';
  conditions?: Record<string, any>;
}

export interface RolePermissions {
  role: FirmRole;
  permissions: Permission[];
  portalAccess: PortalType[];
}

// Login/logout types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse extends AuthResponse {}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: string;
}
