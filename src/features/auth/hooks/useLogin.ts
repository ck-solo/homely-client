"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { loginUser, clearError } from "../slice";

/**
 * Custom hook that integrates the login API call (via Redux async thunk)
 * and the auth Redux state.
 */
export function useLogin() {
  const dispatch = useAppDispatch();
  
  // Extract authentication state from Redux store
  const { isLoading, error, isAuthenticated, user } = useAppSelector(
    (state) => state.auth
  );

  /**
   * Executes the login flow by dispatching the loginUser thunk.
   * @param credentials - Object containing email and password
   */
  const login = useCallback(
    async (credentials: any) => {
      const resultAction = await dispatch(loginUser(credentials));
      return resultAction;
    },
    [dispatch]
  );

  /**
   * Clears any authentication error in the Redux store.
   */
  const clearLoginError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    login,
    isLoading,
    error,
    isAuthenticated,
    user,
    clearLoginError,
  };
}
