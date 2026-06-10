"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { registerUser, clearError } from "../slice";

/**
 * Custom hook that integrates the registration API call (via Redux async thunk)
 * and the auth Redux state.
 */
export function useRegister() {
  const dispatch = useAppDispatch();

  // Extract registration state from Redux store
  const { isLoading, error, isAuthenticated, user } = useAppSelector(
    (state) => state.auth
  );

  /**
   * Executes the registration flow by dispatching the registerUser thunk.
   * @param userData - Object containing name, email, password, role, phone, etc.
   */
  const register = useCallback(
    async (userData: any) => {
      const resultAction = await dispatch(registerUser(userData));
      return resultAction;
    },
    [dispatch]
  );

  /**
   * Clears any authentication/registration error in the Redux store.
   */
  const clearRegisterError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    register,
    isLoading,
    error,
    isAuthenticated,
    user,
    clearRegisterError,
  };
}
