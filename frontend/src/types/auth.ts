// Authentication types for multi-tenant REMS system

export interface User {
  user_id: number;
  email: string;
  username: string;
  user_type: UserType;
  related_entity_id?: number;
  related_entity_type?: 'owner' | 'tenant' | 'vendor';
  preferred_language: string;
  timezone: string;
  is_active: boolean;
  email_verified: boolean;
  last_login?: string;
  phone?: string;
}

export interface Firm {
  firm_id: number;
  firm_name: string;
  description?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserFirmAssignment {
  firm_id: number;
  firm_name: string;
  user_role: FirmRole;
  access_level: 'standard' | 'elevated' | 'restricted';
  assigned_at: string;
  is_primary?: boolean; // Calculated field for frontend use
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

export type UserType =
  | 'admin'
  | 'accountant'
  | 'owner'
  | 'tenant'
  | 'vendor'
  | 'maintenance_staff';
export type FirmRole =
  | 'admin'
  | 'accountant'
  | 'owner'
  | 'tenant'
  | 'vendor'
  | 'maintenance_staff';

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
