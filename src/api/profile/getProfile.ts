import api from "@/lib/axios";

/**
 * Fetches the authenticated user's combined profile (core user + role-specific data).
 * @returns The API response containing user and profile objects
 */
export const getProfileApi = async () => {
  const response = await api.get("/profile/me");
  return response.data;
};
