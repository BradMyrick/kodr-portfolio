import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse } from '@/types';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token storage utilities
export const tokenStorage = {
  get: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
  },
  
  set: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('authToken', token);
  },
  
  remove: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  },
  
  getRefresh: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
  },
  
  setRefresh: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('refreshToken', token);
  },
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request logging in development
    if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
      });
    }
    
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development
    if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
      console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized - attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = tokenStorage.getRefresh();
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          
          const { token, expiresIn } = response.data.data;
          tokenStorage.set(token);
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          tokenStorage.remove();
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, redirect to login
        tokenStorage.remove();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      }
    }
    
    // Log errors in development
    if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
      console.error('[API Error]', {
        status: error.response?.status,
        url: error.config?.url,
        data: error.response?.data,
      });
    }
    
    return Promise.reject(error);
  }
);

// Generic API response handler
export const handleApiResponse = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  if (response.data.success && response.data.data) {
    return response.data.data;
  }
  
  throw new Error(response.data.message || response.data.error || 'Unknown API error');
};

// Generic error handler
export const handleApiError = (error: any): never => {
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  
  if (error.response?.data?.error) {
    throw new Error(error.response.data.error);
  }
  
  if (error.message) {
    throw new Error(error.message);
  }
  
  throw new Error('An unexpected error occurred');
};

// Messaging API Endpoints
export const messagingApi = {
  sendMessage: async (content: string, roomId: string): Promise<any> => {
    return apiClient.post('/messages', { content, room_id: roomId }).then(handleApiResponse).catch(handleApiError);
  },
  
  createRoom: async (name: string, isPublic: boolean): Promise<any> => {
    return apiClient.post('/rooms', { name, is_public: isPublic }).then(handleApiResponse).catch(handleApiError);
  },

  joinRoom: async (roomId: string): Promise<any> => {
    return apiClient.post(`/rooms/${roomId}/join`).then(handleApiResponse).catch(handleApiError);
  },

  getPublicRooms: async (): Promise<any> => {
    return apiClient.get('/messages/rooms/public').then(handleApiResponse).catch(handleApiError);
  },

  getRoomMessages: async (roomId: string): Promise<any> => {
    return apiClient.get(`/rooms/${roomId}/messages`).then(handleApiResponse).catch(handleApiError);
  },

  sendDirectMessage: async (recipientId: string, content: string): Promise<any> => {
    return apiClient.post('/direct-messages', { recipient_id: recipientId, content }).then(handleApiResponse).catch(handleApiError);
  },

  getDirectMessages: async (userId: string): Promise<any> => {
    return apiClient.get(`/direct-messages/${userId}`).then(handleApiResponse).catch(handleApiError);
  }
};

export default apiClient;
