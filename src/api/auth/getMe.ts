import api from "@/lib/axios";

/**
 * Sends a GET request to fetch the authenticated user's profile information.
 * @returns The API response data containing user profile
 */
export const getMeApi = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
