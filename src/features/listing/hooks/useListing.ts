"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { 
  createListingAction, 
  updateListingAction,
  getListingByIdAction,
  clearListingError, 
  clearListingState 
} from "../slice/listing.slice";

/**
 * Custom hook that integrates the listing creation API call (via Redux async thunk)
 * and the listing Redux state.
 */
export function useListing() {
  const dispatch = useAppDispatch();

  // Extract listing state from Redux store
  const { isLoading, error, success, currentListing } = useAppSelector(
    (state) => state.listing
  );

  const createListing = useCallback(
    async (formData: FormData) => {
      const resultAction = await dispatch(createListingAction(formData));
      return resultAction;
    },
    [dispatch]
  );

  const updateListing = useCallback(
    async (id: string, formData: FormData) => {
      const resultAction = await dispatch(updateListingAction({ id, formData }));
      return resultAction;
    },
    [dispatch]
  );

  const getListingById = useCallback(
    async (id: string) => {
      const resultAction = await dispatch(getListingByIdAction(id));
      return resultAction;
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(clearListingError());
  }, [dispatch]);

  const resetListingState = useCallback(() => {
    dispatch(clearListingState());
  }, [dispatch]);

  return {
    createListing,
    updateListing,
    getListingById,
    isLoading,
    error,
    success,
    currentListing,
    clearError,
    resetListingState,
  };
}
