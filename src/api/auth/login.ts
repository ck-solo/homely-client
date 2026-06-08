/**
 * Login API Function
 * Handles user login by sending email and password to the backend
 * Flow: User submits form → LoginForm → useAuthApi → this function → axios
 */

import apiClient from '@/config/axios';
import { LoginRequest, LoginResponse } from '@/types/auth';

export const loginApi = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(
    '/api/v1/auth/login',
    data
  );

  return response.data;
};
