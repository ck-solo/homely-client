import api from "@/lib/axios";

/**
 * Sends a POST request to verify the user's email using a verification token.
 * @param token - The verification token
 * @returns The API response data
 */
export const verifyEmailApi = async (token: string) => {
  const response = await api.post("/auth/verify-email", { token });
  return response.data;
};
