import api from "@/lib/axios";
import type { Listing } from "@/components/listings/ListingCard";

export interface FavoriteItem {
  _id: string;
  tenantId: string;
  listingId: Listing;
  createdAt: string;
  updatedAt: string;
}

interface GetFavoritesResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: FavoriteItem[];
}

/**
 * Fetches all saved/bookmarked listings for the current tenant.
 * Each favorite includes the populated listing data.
 * @returns Array of favorite items with populated listing details
 */
export const getFavoritesApi = async (): Promise<GetFavoritesResponse> => {
  const response = await api.get("/favorites/get");
  return response.data;
};
