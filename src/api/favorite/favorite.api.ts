import api from "@/lib/axios";

export interface FavoriteItem {
  _id: string;
  tenantId: string;
  listingId: {
    _id: string;
    title: string;
    city: string;
    rentBudget: number;
    propertyType: string;
    genderPreference: string;
    images: string[];
    amenities: string[];
    availabilityStatus?: boolean;
    description?: string;
    ownerRef?: { _id: string } | string;
  };
  createdAt: string;
}

export interface ToggleFavoriteResponse {
  success: boolean;
  message: string;
  data: {
    isFavorited: boolean;
    favorite: FavoriteItem | null;
  };
}

export interface GetFavoritesResponse {
  success: boolean;
  message: string;
  data: FavoriteItem[];
}

/**
 * Toggle a listing as favorite (add/remove).
 * POST /favorites/toggle/:listingId
 */
export const toggleFavoriteApi = async (listingId: string): Promise<ToggleFavoriteResponse> => {
  const response = await api.post<ToggleFavoriteResponse>(`/favorites/toggle/${listingId}`);
  return response.data;
};

/**
 * Get all saved/favorited properties for the authenticated tenant.
 * GET /favorites/get
 */
export const getSavedPropertiesApi = async (): Promise<GetFavoritesResponse> => {
  const response = await api.get<GetFavoritesResponse>("/favorites/get");
  return response.data;
};

/**
 * Remove a specific favorite.
 * DELETE /favorites/delete/:listingId
 */
export const removeFavoriteApi = async (listingId: string) => {
  const response = await api.delete(`/favorites/delete/${listingId}`);
  return response.data;
};
