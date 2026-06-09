import api from "@/lib/axios";

/**
 * Sends a POST request to authenticate the user.
 * @param credentials - Object containing email and password
 * @returns The API response data containing user and tokens
 */
export const loginApi = async (credentials: any) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};
