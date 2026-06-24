"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  fetchFavorites,
  toggleFavorite,
  clearFavoriteError,
  resetFavorites,
} from "../slice/favorite.slice";

/**
 * Custom hook for managing favorite/saved listings.
 * Provides check, toggle, and fetch operations with loading states.
 */
export function useFavorites() {
  const dispatch = useAppDispatch();

  const { favorites, favoriteIds, isLoading, isToggling, error, hasFetched } =
    useAppSelector((state) => state.favorite);

  const user = useAppSelector((state) => state.auth.user);

  /**
   * Check if a listing is currently favorited.
   */
  const isFavorited = useCallback(
    (listingId: string): boolean => {
      return favoriteIds.includes(listingId);
    },
    [favoriteIds]
  );

  /**
   * Toggle a listing's favorite status.
   */
  const toggle = useCallback(
    async (listingId: string) => {
      if (!user || user.role !== "TENANT") return;
      return await dispatch(toggleFavorite(listingId));
    },
    [dispatch, user]
  );

  /**
   * Fetch all saved properties from the server.
   */
  const loadFavorites = useCallback(async () => {
    if (!user || user.role !== "TENANT") return;
    return await dispatch(fetchFavorites());
  }, [dispatch, user]);

  /**
   * Clear any error state.
   */
  const clearError = useCallback(() => {
    dispatch(clearFavoriteError());
  }, [dispatch]);

  /**
   * Reset favorites state (e.g., on logout).
   */
  const reset = useCallback(() => {
    dispatch(resetFavorites());
  }, [dispatch]);

  return {
    favorites,
    favoriteIds,
    isLoading,
    isToggling,
    error,
    hasFetched,
    isFavorited,
    toggle,
    loadFavorites,
    clearError,
    reset,
    isTenant: user?.role === "TENANT",
  };
}
