import { useAuthStore } from './auth-store';
import type { ApiError } from '@/types/auth';

// Base configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Custom error class for API errors
export class ApiException extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApiException';
  }
}

// API client class with multi-tenant support
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): Record<string, string> {
    const token = useAuthStore.getState().token;
    const currentFirm = useAuthStore.getState().currentFirm;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authentication token
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Add firm context header for multi-tenant requests
    if (currentFirm) {
      headers['X-Firm-Id'] = currentFirm.firm_id.toString();
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      // Handle authentication errors
      if (response.status === 401) {
        useAuthStore.getState().logout();
        throw new ApiException(401, 'AUTH_INVALID', 'Authentication required');
      }

      // Try to parse error response
      try {
        const errorData: ApiError = await response.json();
        throw new ApiException(
          response.status,
          errorData.error.code,
          errorData.error.message,
          errorData.error.details
        );
      } catch {
        throw new ApiException(
          response.status,
          'UNKNOWN_ERROR',
          `HTTP ${response.status}: ${response.statusText}`
        );
      }
    }

    // Handle no-content responses
    if (response.status === 204) {
      return {} as T;
    }

    try {
      return await response.json();
    } catch {
      throw new ApiException(500, 'PARSE_ERROR', 'Failed to parse response');
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);

    // Add query parameters
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async upload<T>(endpoint: string, file: File): Promise<T> {
    const token = useAuthStore.getState().token;
    const currentFirm = useAuthStore.getState().currentFirm;

    const formData = new FormData();
    formData.append('file', file);

    const headers: Record<string, string> = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (currentFirm) {
      headers['X-Firm-Id'] = currentFirm.firm_id.toString();
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    return this.handleResponse<T>(response);
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Utility function for handling API errors in components
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiException) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
};
