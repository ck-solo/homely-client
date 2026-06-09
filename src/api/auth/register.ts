import api from "@/lib/axios";

/**
 * Sends a POST request to register a new user.
 * @param userData - The user registration data
 * @returns The API response data
 */
export const registerApi = async (userData: any) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};
