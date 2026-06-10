import api from "@/lib/axios";

/**
 * Sends a POST request to logout the user and invalidate their session.
 * @returns The API response data
 */
export const logoutApi = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};
