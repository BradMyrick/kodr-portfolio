import apiClient, { handleApiResponse, handleApiError, tokenStorage } from './client';
import { LoginForm, RegisterForm, User, ApiResponse } from '@/types';

// Authentication response type matching backend
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// Token refresh response type
export interface RefreshResponse {
  token: string;
  expiresIn: number;
}

export const authApi = {
  /**
   * Register a new user account
   */
  async register(data: RegisterForm): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      
      const authData = handleApiResponse(response);
      
      // Store tokens
      tokenStorage.set(authData.token);
      tokenStorage.setRefresh(authData.refreshToken);
      
      return authData;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Login with email and password
   */
  async login(data: LoginForm): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', {
        email: data.email,
        password: data.password,
      });
      
      const authData = handleApiResponse(response);
      
      // Store tokens
      tokenStorage.set(authData.token);
      tokenStorage.setRefresh(authData.refreshToken);
      
      return authData;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Refresh the access token
   */
  async refresh(): Promise<RefreshResponse> {
    try {
      const refreshToken = tokenStorage.getRefresh();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post<ApiResponse<RefreshResponse>>('/auth/refresh', {
        refreshToken,
      });
      
      const refreshData = handleApiResponse(response);
      
      // Update stored token
      tokenStorage.set(refreshData.token);
      
      return refreshData;
    } catch (error) {
      // Clear tokens on refresh failure
      tokenStorage.remove();
      throw handleApiError(error);
    }
  },

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post<ApiResponse<void>>('/auth/logout');
    } catch (error) {
      // Log the error but don't throw - we want to clear tokens regardless
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear tokens
      tokenStorage.remove();
    }
  },

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    return !!tokenStorage.get();
  },

  /**
   * Get current auth token
   */
  getToken(): string | null {
    return tokenStorage.get();
  },

  /**
   * Google OAuth login
   */
  async loginWithGoogle(): Promise<string> {
    try {
      const response = await apiClient.get<ApiResponse<{ url: string }>>('/auth/oauth/google');
      const data = handleApiResponse(response);
      return data.url;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * GitHub OAuth login
   */
  async loginWithGitHub(): Promise<string> {
    try {
      const response = await apiClient.get<ApiResponse<{ url: string }>>('/auth/oauth/github');
      const data = handleApiResponse(response);
      return data.url;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Handle OAuth callback
   */
  async handleOAuthCallback(provider: 'google' | 'github', code: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(`/auth/oauth/${provider}/callback`, {
        code,
      });
      
      const authData = handleApiResponse(response);
      
      // Store tokens
      tokenStorage.set(authData.token);
      tokenStorage.setRefresh(authData.refreshToken);
      
      return authData;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
