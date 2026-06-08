/**
 * Auth Store (Zustand)
 * Manages global authentication state including:
 * - Current user information
 * - Loading states
 * - Authentication status
 *
 * Used by: LoginForm, RegisterForm, components that need auth state
 * Flow: User action → store update → component re-renders
 */

import { create } from 'zustand';
import { User, AuthError } from '@/types/auth';
import { logoutApi } from '@/api/auth/logout';
import { setClientAccessToken } from '@/config/axios';

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: AuthError | null;

  // Actions
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: AuthError | null) => void;
  logout: () => Promise<void>;
  resetError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  setAccessToken: (accessToken) => {
    setClientAccessToken(accessToken);
    set({
      accessToken,
    });
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  resetError: () => set({ error: null }),

  logout: async () => {
    try {
      set({ isLoading: true });
      await logoutApi();
    } catch (error: any) {
      console.error('Logout API failed, clearing local session anyway:', error);
    } finally {
      setClientAccessToken(null);
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));

