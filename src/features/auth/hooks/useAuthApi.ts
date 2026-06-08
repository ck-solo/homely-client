/**
 * Auth API Hook
 * Custom hook that combines API calls with auth state management
 * Provides simplified interface for components to use: login, register, logout
 *
 * Usage in components:
 * const { login, register, isLoading } = useAuthApi();
 * await login(email, password);
 *
 * Flow: Component calls hook → Hook calls API → Hook updates store → Component re-renders
 */

'use client';

import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { loginApi } from '@/api/auth/login'; 
import { LoginRequest, AuthError } from '@/types/auth';

export const useAuthApi = () => {
  const { setUser, setAccessToken, setError, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setLocalError] = useState<AuthError | null>(null);

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      setLocalError(null);
      setError(null);

      const response = await loginApi(credentials);
      setUser(response.data.user);
      if (response.data.accessToken) {
        setAccessToken(response.data.accessToken);
      }

      setIsLoading(false);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      const errorObj: AuthError = {
        message: errorMessage,
        status: err.response?.status,
      };
      setLocalError(errorObj);
      setError(errorObj);
      setIsLoading(false);
      throw errorObj;
    }
  };

  return {
    login, 
    isLoading,
    error,
    user,
  };
};

