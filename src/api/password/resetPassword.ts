import api from "../../lib/axios";

export const resetPassword = async (data: { token: string; newPassword: string; confirmNewPassword: string }) => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};
