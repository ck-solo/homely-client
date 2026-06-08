/**
 * Auth Types
 * Centralized TypeScript types for the authentication module
 */

export interface User {
  _id: string;
  id?: string;
  email: string;
  name: string;
  phone?: string;
  role?: string;
  isEmailVerified?: boolean;
  accountStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}


export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    accessToken?: string;
  };
  message?: string;
}

export interface AuthError {
  message: string;
  status?: number;
}
