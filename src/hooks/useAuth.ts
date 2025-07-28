import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/stores/useAppStore';
import { authApi, usersApi } from '@/lib/api';
import { LoginForm, RegisterForm } from '@/types';

export const useAuth = () => {
  const router = useRouter();
  const { user, setUser, logout: logoutStore, addNotification } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Initialize authentication state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have a token and try to get current user
        if (authApi.isAuthenticated() && !user) {
          const currentUser = await usersApi.getMe();
          setUser(currentUser);
        }
      } catch (error) {
        // Token might be invalid, clear it
        authApi.logout();
        logoutStore();
      } finally {
        setInitializing(false);
      }
    };

    initializeAuth();
  }, [user, setUser, logoutStore]);

  const login = async (formData: LoginForm) => {
    setLoading(true);
    try {
      const authResponse = await authApi.login(formData);
      setUser(authResponse.user);
      
      addNotification({
        id: `login-${Date.now()}`,
        type: 'success',
        title: 'Welcome back!',
        message: 'You have successfully signed in.',
        read: false,
        userId: authResponse.user.id,
        createdAt: new Date().toISOString(),
      });

      router.push('/dashboard');
      return authResponse;
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData: RegisterForm) => {
    setLoading(true);
    try {
      const authResponse = await authApi.register(formData);
      setUser(authResponse.user);
      
      addNotification({
        id: `register-${Date.now()}`,
        type: 'success',
        title: 'Welcome to Kodr.pro!',
        message: 'Your account has been created successfully.',
        read: false,
        userId: authResponse.user.id,
        createdAt: new Date().toISOString(),
      });

      router.push('/dashboard');
      return authResponse;
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authApi.logout();
      logoutStore();
      router.push('/auth/login');
    } catch (error) {
      // Even if logout fails on server, clear local state
      logoutStore();
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const authUrl = await authApi.loginWithGoogle();
      window.location.href = authUrl;
    } catch (error: any) {
      addNotification({
        id: `oauth-error-${Date.now()}`,
        type: 'error',
        title: 'OAuth Error',
        message: 'Failed to initiate Google login. Please try again.',
        read: false,
        userId: 'temp',
        createdAt: new Date().toISOString(),
      });
      throw error;
    }
  };

  const loginWithGitHub = async () => {
    try {
      const authUrl = await authApi.loginWithGitHub();
      window.location.href = authUrl;
    } catch (error: any) {
      addNotification({
        id: `oauth-error-${Date.now()}`,
        type: 'error',
        title: 'OAuth Error',
        message: 'Failed to initiate GitHub login. Please try again.',
        read: false,
        userId: 'temp',
        createdAt: new Date().toISOString(),
      });
      throw error;
    }
  };

  return {
    user,
    loading,
    initializing,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loginWithGoogle,
    loginWithGitHub,
  };
};
