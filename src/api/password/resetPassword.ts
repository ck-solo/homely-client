import api from "../../lib/axios";

export const resetPassword = async (data: { token: string; password: string; confirmPassword: string }) => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};
