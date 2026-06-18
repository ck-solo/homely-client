"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFavoritesApi, type FavoriteItem } from "@/api/favorites/getFavorites";
import { toggleFavoriteApi } from "@/api/favorites/toggleFavorite";
import { useAppSelector } from "@/redux/store";
import toast from "react-hot-toast";
import { useCallback, useMemo } from "react";

// ─── Query Keys ──────────────────────────────────────────
const FAVORITES_QUERY_KEY = ["favorites"] as const;

// ─── useFavorites ────────────────────────────────────────
/**
 * Fetches the current tenant's saved listings.
 * Only enabled when user is authenticated with TENANT role.
 */
export function useFavorites() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const isTenant = isAuthenticated && user?.role === "TENANT";

  const query = useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: async () => {
      const response = await getFavoritesApi();
      return response.data;
    },
    enabled: isTenant,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Derive a Set of favorited listing IDs for O(1) lookups
  const favoritedIds = useMemo(() => {
    const ids = new Set<string>();
    if (query.data) {
      query.data.forEach((fav: FavoriteItem) => {
        if (fav.listingId?._id) {
          ids.add(fav.listingId._id);
        }
      });
    }
    return ids;
  }, [query.data]);

  const isFavorited = useCallback(
    (listingId: string) => favoritedIds.has(listingId),
    [favoritedIds]
  );

  return {
    ...query,
    favorites: query.data || [],
    favoritedIds,
    isFavorited,
    isTenant,
  };
}

// ─── useToggleFavorite ───────────────────────────────────
/**
 * Mutation hook for toggling a listing as favorite.
 * Includes optimistic UI updates and automatic rollback on error.
 */
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listingId: string) => toggleFavoriteApi(listingId),

    // Optimistic update: immediately toggle the UI state
    onMutate: async (listingId: string) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: FAVORITES_QUERY_KEY });

      // Snapshot the previous value for rollback
      const previousFavorites = queryClient.getQueryData<FavoriteItem[]>(FAVORITES_QUERY_KEY);

      // Optimistically update the cache
      queryClient.setQueryData<FavoriteItem[]>(FAVORITES_QUERY_KEY, (old) => {
        if (!old) return old;

        const exists = old.some((fav) => fav.listingId?._id === listingId);

        if (exists) {
          // Remove from favorites
          return old.filter((fav) => fav.listingId?._id !== listingId);
        } else {
          // Add a placeholder entry (will be replaced by real data on refetch)
          const placeholder: FavoriteItem = {
            _id: `optimistic-${listingId}`,
            tenantId: "",
            listingId: { _id: listingId } as FavoriteItem["listingId"],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return [...old, placeholder];
        }
      });

      return { previousFavorites };
    },

    // On error, roll back to the previous value
    onError: (_err, _listingId, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(FAVORITES_QUERY_KEY, context.previousFavorites);
      }
      toast.error("Failed to update favorites. Please try again.");
    },

    // After success or error, refetch to ensure consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },

    onSuccess: (data) => {
      const message = data.data.isFavorited
        ? "Added to favorites"
        : "Removed from favorites";
      toast.success(message);
    },
  });
}
