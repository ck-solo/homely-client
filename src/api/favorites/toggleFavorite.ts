import api from "@/lib/axios";

interface ToggleFavoriteResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    isFavorited: boolean;
    favorite: object | null;
  };
}

/**
 * Toggles a listing as favorite for the current tenant.
 * If already saved, removes it. If not saved, adds it.
 * @param listingId - The listing ObjectId to toggle
 * @returns Toggle result with isFavorited boolean
 */
export const toggleFavoriteApi = async (
  listingId: string
): Promise<ToggleFavoriteResponse> => {
  const response = await api.post(`/favorites/toggle/${listingId}`);
  return response.data;
};
