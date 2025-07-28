import apiClient, { handleApiResponse, handleApiError } from './client';
import { Project, ProjectForm, ApiResponse, PaginatedResponse } from '@/types';

// Project query parameters
export interface ProjectsQuery {
  limit?: number;
  offset?: number;
  status?: 'active' | 'completed' | 'on-hold' | 'archived';
  search?: string;
}

// Project update request
export interface UpdateProjectRequest {
  title?: string;
  description?: string;
  status?: 'active' | 'completed' | 'on-hold' | 'archived';
  tags?: string[];
  color?: string;
}

export const projectsApi = {
  /**
   * Get all projects with optional filtering
   */
  async getProjects(query: ProjectsQuery = {}): Promise<PaginatedResponse<Project>> {
    try {
      const params = new URLSearchParams();
      if (query.limit) params.append('limit', query.limit.toString());
      if (query.offset) params.append('offset', query.offset.toString());
      if (query.status) params.append('status', query.status);
      if (query.search) params.append('search', query.search);

      const response = await apiClient.get<ApiResponse<PaginatedResponse<Project>>>(
        `/projects?${params.toString()}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get a single project by ID
   */
  async getProject(id: string): Promise<Project> {
    try {
      const response = await apiClient.get<ApiResponse<Project>>(`/projects/${id}`);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create a new project
   */
  async createProject(data: ProjectForm): Promise<Project> {
    try {
      const response = await apiClient.post<ApiResponse<Project>>('/projects', data);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update an existing project
   */
  async updateProject(id: string, data: UpdateProjectRequest): Promise<Project> {
    try {
      const response = await apiClient.put<ApiResponse<Project>>(`/projects/${id}`, data);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete a project
   */
  async deleteProject(id: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`/projects/${id}`);
      handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Join a project
   */
  async joinProject(id: string): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<void>>(`/projects/${id}/join`);
      handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Leave a project
   */
  async leaveProject(id: string): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<void>>(`/projects/${id}/leave`);
      handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
