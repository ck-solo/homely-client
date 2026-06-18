import api from "@/lib/axios";
import { AuthResponse, RegisterRequest } from "@/types";

/**
 * Sends a POST request to register a new user.
 * @param userData - The user registration data
 * @returns The API response data
 */
export const registerApi = async (userData: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", userData);
  return response.data;
};
