import apiClient, { handleApiResponse, handleApiError } from './client';
import { User, ApiResponse } from '@/types';

// User update request type
export interface UpdateUserRequest {
  name?: string;
  avatar?: string;
}

export const usersApi = {
  /**
   * Get current user profile
   */
  async getMe(): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<User>>('/users/me');
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update current user profile
   */
  async updateMe(data: UpdateUserRequest): Promise<User> {
    try {
      const response = await apiClient.put<ApiResponse<User>>('/users/me', data);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete current user account
   */
  async deleteMe(): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>('/users/me');
      handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get user by ID (public profile)
   */
  async getUser(id: string): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
