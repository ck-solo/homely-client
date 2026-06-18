import api from "@/lib/axios";
import { AuthResponse, LoginRequest } from "@/types";

/**
 * Sends a POST request to authenticate the user.
 * @param credentials - Object containing email and password
 * @returns The API response data containing user and tokens
 */
export const loginApi = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", credentials);
  return response.data;
};
