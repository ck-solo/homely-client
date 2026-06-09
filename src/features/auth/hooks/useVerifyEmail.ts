"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { verifyEmail, clearError } from "../slice";

/**
 * Custom hook that integrates the email verification API call (via Redux async thunk)
 * and the auth Redux state.
 */
export function useVerifyEmail() {
  const dispatch = useAppDispatch();

  // Extract authentication/verification state from Redux store
  const { isLoading, error, user } = useAppSelector(
    (state) => state.auth
  );

  /**
   * Executes the email verification flow by dispatching the verifyEmail thunk.
   * @param token - The verification JWT token from the query params/URL
   */
  const verify = useCallback(
    async (token: string) => {
      const resultAction = await dispatch(verifyEmail(token));
      return resultAction;
    },
    [dispatch]
  );

  /**
   * Clears any verification error in the Redux store.
   */
  const clearVerifyError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    verify,
    isLoading,
    error,
    user,
    clearVerifyError,
  };
}
