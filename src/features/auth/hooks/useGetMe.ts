"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { getMe } from "../slice";

/**
 * Custom hook to fetch and manage the logged in user's profile.
 */
export function useGetMe() {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);

  /**
   * Refreshes/fetches the current authenticated user's profile.
   */
  const fetchMe = useCallback(async () => {
    const resultAction = await dispatch(getMe());
    return resultAction;
  }, [dispatch]);

  return {
    user,
    isLoading,
    fetchMe,
  };
}
