import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Project, Notification, Theme } from '@/types';

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // UI state
  theme: Theme;
  sidebarCollapsed: boolean;
  
  // Data state
  projects: Project[];
  currentProject: Project | null;
  notifications: Notification[];
  
  // Loading states
  isLoading: boolean;
  isProjectsLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (project: Project | null) => void;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => void;
  removeNotification: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setProjectsLoading: (loading: boolean) => void;
  logout: () => void;
  reset: () => void;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  theme: 'light' as Theme,
  sidebarCollapsed: false,
  projects: [],
  currentProject: null,
  notifications: [],
  isLoading: false,
  isProjectsLoading: false,
};

export const useAppStore = create<AppState>()(  
  persist(
    (set, get) => ({
      ...initialState,
      
      // User actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),
      
      // Theme actions
      setTheme: (theme) => set({ theme }),
      
      // Sidebar actions
      toggleSidebar: () => set((state) => ({ 
        sidebarCollapsed: !state.sidebarCollapsed 
      })),
      setSidebarCollapsed: (collapsed) => set({ 
        sidebarCollapsed: collapsed 
      }),
      
      // Project actions
      setProjects: (projects) => set({ projects }),
      
      addProject: (project) => set((state) => ({
        projects: [...state.projects, project]
      })),
      
      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(project =>
          project.id === id ? { ...project, ...updates } : project
        ),
        currentProject: state.currentProject?.id === id
          ? { ...state.currentProject, ...updates }
          : state.currentProject
      })),
      
      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter(project => project.id !== id),
        currentProject: state.currentProject?.id === id 
          ? null 
          : state.currentProject
      })),
      
      setCurrentProject: (project) => set({ currentProject: project }),
      
      // Notification actions
      setNotifications: (notifications) => set({ notifications }),
      
      addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications]
      })),
      
      markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(notification =>
          notification.id === id 
            ? { ...notification, read: true }
            : notification
        )
      })),
      
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(
          notification => notification.id !== id
        )
      })),
      
      // Loading actions
      setLoading: (loading) => set({ isLoading: loading }),
      setProjectsLoading: (loading) => set({ isProjectsLoading: loading }),
      
      // Reset actions
      logout: () => set({
        user: null,
        isAuthenticated: false,
        currentProject: null,
        notifications: [],
      }),
      
      reset: () => set(initialState),
    }),
    {
      name: 'kodr-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        projects: state.projects,
        currentProject: state.currentProject,
      }),
      skipHydration: false,
    }
  )
);

// Selectors for better performance with memoization
export const useUser = () => useAppStore((state) => state.user);
export const useIsAuthenticated = () => useAppStore((state) => state.isAuthenticated);
export const useTheme = () => useAppStore((state) => state.theme);
export const useProjects = () => useAppStore((state) => state.projects);
export const useCurrentProject = () => useAppStore((state) => state.currentProject);
export const useNotifications = () => useAppStore((state) => state.notifications);
export const useUnreadNotifications = () => {
  const notifications = useAppStore((state) => state.notifications);
  return notifications.filter(n => !n.read);
};
export const useSidebarCollapsed = () => useAppStore((state) => state.sidebarCollapsed);
export const useIsLoading = () => useAppStore((state) => state.isLoading);
export const useIsProjectsLoading = () => useAppStore((state) => state.isProjectsLoading);
