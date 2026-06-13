"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfileApi } from "@/api/profile/updateProfile";
import { useAppDispatch } from "@/redux/store";
import { getMe } from "@/features/auth/slice";
import { PROFILE_QUERY_KEY } from "./useGetProfile";
import toast from "react-hot-toast";

/**
 * TanStack Query mutation hook for updating the user's profile.
 * On success: invalidates the profile cache, refreshes Redux auth state, shows success toast.
 * On error: shows error toast with the server message or a fallback.
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (formData: FormData) => updateProfileApi(formData),
    onSuccess: () => {
      // Invalidate TanStack profile cache so next visit re-fetches
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });

      // Refresh the Redux auth user state so Navbar avatar/name updates immediately
      dispatch(getMe());

      toast.success("Profile updated successfully!");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to update profile. Please try again.";
      toast.error(message);
    },
  });
}
