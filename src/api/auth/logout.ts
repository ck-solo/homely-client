/**
 * Logout API Function
 * Clears authentication session on the backend
 * Flow: User clicks logout button → authStore.logout() → this function → axios
 */

import apiClient from '@/config/axios';

export const logoutApi = async (): Promise<void> => {
   await apiClient.post('/api/v1/auth/logout');
};
