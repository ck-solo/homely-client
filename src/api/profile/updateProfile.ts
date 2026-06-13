import api from "@/lib/axios";

/**
 * Sends a PUT request to update the user's profile.
 * Uses FormData to support multipart file upload (profile picture).
 * @param formData - FormData object containing all profile fields and optional file
 * @returns The API response data containing updated user and profile
 */
export const updateProfileApi = async (formData: FormData) => {
  const response = await api.put("/profile/update-profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
