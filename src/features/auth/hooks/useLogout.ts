"use client";

import { useCallback } from "react";
import { useAppDispatch } from "@/redux/store";
import { logoutUser } from "../slice";

/**
 * Custom hook to handle logging out the user.
 */
export function useLogout() {
  const dispatch = useAppDispatch();

  /**
   * Logs out the user by dispatching the logoutUser thunk.
   */
  const logout = useCallback(async () => {
    const resultAction = await dispatch(logoutUser());
    return resultAction;
  }, [dispatch]);

  return { logout };
}
