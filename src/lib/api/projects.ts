import apiClient, { handleApiResponse, handleApiError } from './client';
import { Project, ProjectForm, ApiResponse, PaginatedResponse } from '@/types';

// Project query parameters
export interface ProjectsQuery {
  limit?: number;
  offset?: number;
  status?: 'active' | 'completed' | 'on_hold' | 'archived';
  search?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  owner?: string;
  public_only?: boolean;
}

// Project update request
export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  avatar?: string;
  color?: string;
  status?: 'active' | 'completed' | 'on_hold' | 'archived';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  tags?: string[];
  category?: string;
  isPublic?: boolean;
  aiEnabled?: boolean;
  autoGenerateIdeas?: boolean;
}

// Member management interfaces
export interface AddMemberRequest {
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
}

export interface UpdateMemberRoleRequest {
  role: 'owner' | 'admin' | 'member' | 'viewer';
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
      if (query.priority) params.append('priority', query.priority);
      if (query.category) params.append('category', query.category);
      if (query.owner) params.append('owner', query.owner);
      if (query.public_only !== undefined) params.append('public_only', query.public_only.toString());

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

  /**
   * Add member to a project
   */
  async addMember(projectId: string, data: AddMemberRequest): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<void>>(`/projects/${projectId}/members`, data);
      handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Remove member from a project
   */
  async removeMember(projectId: string, userId: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`/projects/${projectId}/members/${userId}`);
      handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update member role in a project
   */
  async updateMemberRole(projectId: string, userId: string, data: UpdateMemberRoleRequest): Promise<void> {
    try {
      const response = await apiClient.put<ApiResponse<void>>(`/projects/${projectId}/members/${userId}`, data);
      handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get user's projects (projects where user is a member)
   */
  async getUserProjects(query: ProjectsQuery = {}): Promise<PaginatedResponse<Project>> {
    try {
      const params = new URLSearchParams();
      if (query.limit) params.append('limit', query.limit.toString());
      if (query.offset) params.append('offset', query.offset.toString());
      if (query.status) params.append('status', query.status);
      if (query.search) params.append('search', query.search);
      if (query.priority) params.append('priority', query.priority);
      if (query.category) params.append('category', query.category);

      const response = await apiClient.get<ApiResponse<PaginatedResponse<Project>>>(
        `/projects/my?${params.toString()}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
