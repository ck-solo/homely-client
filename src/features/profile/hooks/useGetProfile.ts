"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfileApi } from "@/api/profile/getProfile";

/** Query key for the authenticated user's profile */
export const PROFILE_QUERY_KEY = ["profile", "me"] as const;

/**
 * TanStack Query hook to fetch the authenticated user's combined profile.
 * Returns the core user data + role-specific profile (tenant or owner).
 */
export function useGetProfile() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getProfileApi,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
