'use client';

import { useCallback } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { projectsApi } from '@/lib/api';
import type { 
  UpdateProjectRequest, 
  ProjectsQuery, 
  AddMemberRequest, 
  UpdateMemberRoleRequest 
} from '@/lib/api';
import { Project, ProjectForm } from '@/types';

export const useProjectsHook = () => {
  const {
    projects,
    setProjects,
    addProject,
    updateProject,
    deleteProject: removeProjectFromStore,
    setProjectsLoading,
    addNotification,
    user,
  } = useAppStore();

  const generateNotificationId = () => Math.random().toString(36).substring(2, 15);

  // Load projects
  const loadProjects = useCallback(async (query: ProjectsQuery = {}) => {
    try {
      setProjectsLoading(true);
      const response = await projectsApi.getProjects(query);
      setProjects(response.data);
      return response;
    } catch (error: any) {
      addNotification({
        id: generateNotificationId(),
        type: 'error',
        title: 'Error Loading Projects',
        message: error.message || 'Failed to load projects',
        read: false,
        userId: user?.id || '',
        createdAt: new Date().toISOString(),
      });
      throw error;
    } finally {
      setProjectsLoading(false);
    }
  }, [setProjects, setProjectsLoading, addNotification, user?.id]);

  // Load user's projects
  const loadUserProjects = useCallback(async (query: ProjectsQuery = {}) => {
    try {
      setProjectsLoading(true);
      const response = await projectsApi.getUserProjects(query);
      setProjects(response.data);
      return response;
    } catch (error: any) {
      addNotification({
        id: generateNotificationId(),
        type: 'error',
        title: 'Error Loading Your Projects',
        message: error.message || 'Failed to load your projects',
        read: false,
        userId: user?.id || '',
        createdAt: new Date().toISOString(),
      });
      throw error;
    } finally {
      setProjectsLoading(false);
    }
  }, [setProjects, setProjectsLoading, addNotification, user?.id]);

  // Get single project
  const getProject = useCallback(async (id: string): Promise<Project> => {
    try {
      const project = await projectsApi.getProject(id);
      return project;
    } catch (error: any) {
      addNotification({
        id: generateNotificationId(),
        type: 'error',
        title: 'Error Loading Project',
        message: error.message || 'Failed to load project details',
        read: false,
        userId: user?.id || '',
        createdAt: new Date().toISOString(),
      });
      throw error;
    }
  }, [addNotification, user?.id]);

  // Create project
  const createProject = useCallback(async (data: ProjectForm): Promise<Project> => {
    try {
      const newProject = await projectsApi.createProject(data);
      addProject(newProject);
      
      addNotification({
        id: generateNotificationId(),
        type: 'success',
        title: 'Project Created',
        message: `Project "${newProject.name}" has been created successfully`,
        read: false,
        userId: user?.id || '',
        createdAt: new Date().toISOString(),
      });
      
      return newProject;
    } catch (error: any) {
      addNotification({
        id: generateNotificationId(),
        type: 'error',
        title: 'Error Creating Project',
        message: error.message || 'Failed to create project',
        read: false,
        userId: user?.id || '',
        createdAt: new Date().toISOString(),
      });
      throw error;
    }
  }, [addProject, addNotification, user?.id]);

  // Update project
  const updateProjectData = useCallback(async (id: string, data: UpdateProjectRequest): Promise<Project> => {
    try {
      const updatedProject = await projectsApi.updateProject(id, data);
      updateProject(id, updatedProject);
      
      addNotification({
        id: generateNotificationId(),
        type: 'success',
        title: 'Project Updated',
        message: `Project "${updatedProject.name}" has been updated successfully`,
        read: false,
        userId: user?.id || '',
        createdAt: new Date().toISOString(),
      });
      
      return updatedProject;
    } catch (error: any) {
      addNotification({
        id: generateNotificationId(),
        type: 'error',
        title: 'Error Updating Project',
        message: error.message || 'Failed to update project',
        read: false,
        userId: user?.id || '',
        createdAt: new Date().toISOString(),
      });
      throw error;
    }
  }, [updateProject, addNotification, user?.id]);

  // Delete project
  const deleteProject = useCallback(async (id: string): Promise<void> => {
    try {
      await projectsApi.deleteProject(id);
      removeProjectFromStore(id);
      
      addNotification({
        id: generateNotificationId(),
        type: 'success',
        title: 'Project Deleted',
        message: 'Project has been deleted successfully',
        read: false,
        userId: user?.id || '',
        createdAt: new Date().toISOString(),
      });
    } catch (error: any) {
      addNotification({
        id: generateNotificationId(),
        type: 'error',
        title: 'Error Deleting Project',
        message: error.message || 'Failed to delete project',
        read: false,
        userId: user?.id || '',
        createdAt: new Date().toISOString(),
      });
      throw error;
    }
  }, [removeProjectFromStore, addNotification, user?.id]);

  // Join project
  const joinProject = useCallback(async (id: string): Promise<void> => {
    try {
      await projectsApi.joinProject(id);
      
      // Refresh projects to get the updated member list
      await loadProjects();
      
      addNotification({
        id: generateNotificationId(),
        type: 'success',
        title: 'Joined Project',
        message: 'You have successfully joined the project',
        read: false,
        userId: user?.id || '',
        createdAt: new Date().toISOString(),
      });
    } catch (error: any) {
      addNotification({
        id: generateNotificationId(),
        type: 'error',
        title: 'Error Joining Project',
        message: error.message || 'Failed to join project',
        read: false,
        userId: user?.id || '',
        createdAt: new Date().toISOString(),
      });
      throw error;
    }
  }, [loadProjects, addNotification, user?.id]);

  // Leave project
  const leaveProject = useCallback(async (id: string): Promise<void> => {
    try {
      await projectsApi.leaveProject(id);
      
      // Refresh projects to get the updated member list
      await loadProjects();
      
      addNotification({
        id: generateNotificationId(),
        type: 'success',
        title: 'Left Project',
        message: 'You have successfully left the project',
        read: false,
        userId: user?.id || '',
        createdAt: new Date().toISOString(),
      });
    } catch (error: any) {
      addNotification({
        id: generateNotificationId(),
        type: 'error',
        title: 'Error Leaving Project',
        message: error.message || 'Failed to leave project',
        read: false,
        userId: user?.id || '',
        createdAt: new Date().toISOString(),
      });
      throw error;
    }
  }, [loadProjects, addNotification, user?.id]);

  // Add member to project
  const addMember = useCallback(async (projectId: string, data: AddMemberRequest): Promise<void> => {
    try {
      await projectsApi.addMember(projectId, data);
      
      // Refresh projects to get the updated member list
      await loadProjects();
      
      addNotification({
        id: generateNotificationId(),
        type: 'success',
        title: 'Member Added',
        message: 'Member has been added to the project successfully',
        read: false,
        userId: user?.id || '',
        createdAt: new Date().toISOString(),
      });
    } catch (error: any) {
      addNotification({
        id: generateNotificationId(),
        type: 'error',
        title: 'Error Adding Member',
        message: error.message || 'Failed to add member to project',
        read: false,
        userId: user?.id || '',
        createdAt: new Date().toISOString(),
      });
      throw error;
    }
  }, [loadProjects, addNotification, user?.id]);

  // Remove member from project
  const removeMember = useCallback(async (projectId: string, userId: string): Promise<void> => {
    try {
      await projectsApi.removeMember(projectId, userId);
      
      // Refresh projects to get the updated member list
      await loadProjects();
      
      addNotification({
        id: generateNotificationId(),
        type: 'success',
        title: 'Member Removed',
        message: 'Member has been removed from the project successfully',
        read: false,
        userId: user?.id || '',
        createdAt: new Date().toISOString(),
      });
    } catch (error: any) {
      addNotification({
        id: generateNotificationId(),
        type: 'error',
        title: 'Error Removing Member',
        message: error.message || 'Failed to remove member from project',
        read: false,
        userId: user?.id || '',
        createdAt: new Date().toISOString(),
      });
      throw error;
    }
  }, [loadProjects, addNotification, user?.id]);

  // Update member role
  const updateMemberRole = useCallback(async (projectId: string, userId: string, data: UpdateMemberRoleRequest): Promise<void> => {
    try {
      await projectsApi.updateMemberRole(projectId, userId, data);
      
      // Refresh projects to get the updated member list
      await loadProjects();
      
      addNotification({
        id: generateNotificationId(),
        type: 'success',
        title: 'Member Role Updated',
        message: 'Member role has been updated successfully',
        read: false,
        userId: user?.id || '',
        createdAt: new Date().toISOString(),
      });
    } catch (error: any) {
      addNotification({
        id: generateNotificationId(),
        type: 'error',
        title: 'Error Updating Member Role',
        message: error.message || 'Failed to update member role',
        read: false,
        userId: user?.id || '',
        createdAt: new Date().toISOString(),
      });
      throw error;
    }
  }, [loadProjects, addNotification, user?.id]);

  return {
    projects,
    loadProjects,
    loadUserProjects,
    getProject,
    createProject,
    updateProject: updateProjectData,
    deleteProject,
    joinProject,
    leaveProject,
    addMember,
    removeMember,
    updateMemberRole,
  };
};

export default useProjectsHook;
