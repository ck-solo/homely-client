"use client";

import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { store, useAppDispatch } from "./store";
import queryClient from "@/config/tanstack";
import { initializeAuth, getMe } from "@/features/auth/slice";

/**
 * Inner component that has access to the Redux store context.
 * Handles auth initialization on app mount.
 */
function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const init = async () => {
      const result = await dispatch(initializeAuth());
      // If we have a token, verify it's still valid by fetching user profile
      if (initializeAuth.fulfilled.match(result) && result.payload.accessToken) {
        dispatch(getMe());
      }
    };
    init();
  }, [dispatch]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer>
          {children}
        </AuthInitializer>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: "GeneralSans, sans-serif",
              fontSize: "14px",
              borderRadius: "12px",
              padding: "12px 16px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            },
            success: {
              style: {
                background: "#f0fdf4",
                color: "#166534",
                border: "1px solid #bbf7d0",
              },
            },
            error: {
              style: {
                background: "#fef2f2",
                color: "#991b1b",
                border: "1px solid #fecaca",
              },
            },
          }}
        />
      </QueryClientProvider>
    </Provider>
  );
}