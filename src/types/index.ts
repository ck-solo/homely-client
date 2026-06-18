export interface User {
  _id: string;
  name: string;
  email: string;
  role: "TENANT" | "OWNER" | "ADMIN";
  phone?: string;
  profilePicture?: string;
  isEmailVerified: boolean;
  accountStatus: "ACTIVE" | "BLOCKED";
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
}

export interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
      success?: boolean;
    };
  };
  message?: string;
}

export interface LoginRequest {
  email?: string;
  password?: string;
  [key: string]: unknown;
}

export interface RegisterRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  [key: string]: unknown;
}

export interface SuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
