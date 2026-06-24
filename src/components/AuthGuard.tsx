"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import toast from "react-hot-toast";

const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/verify-email",
  "/verify-email-pending",
  "/forgot-password",
  "/reset-password",
];

// Only these pages should redirect authenticated users away
const authOnlyRoutes = ["/login", "/register"];

// Role-restricted routes
const ownerOnlyRoutes = ["/create-listing", "/edit-listing"];
const tenantOnlyRoutes = ["/saved-listings"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAppSelector(
    (state) => state.auth,
  );

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "?"),
    );

    // Unauthenticated user trying to access protected route
    if (!isAuthenticated && !isPublicRoute) {
      router.push("/login");
      return;
    }

    // Authenticated user trying to access protected route but email is not verified
    if (isAuthenticated && !isPublicRoute && user && !user.isEmailVerified) {
      router.push("/verify-email-pending");
      return;
    }

    // Authenticated user trying to access login/register
    if (isAuthenticated && authOnlyRoutes.includes(pathname)) {
      if (user && !user.isEmailVerified) {
        router.push("/verify-email-pending");
      } else {
        const dashboardUrl =
          user?.role === "OWNER" ? "/dashboard/owner" : "/dashboard/tenant";

        router.push(dashboardUrl);
      }
    }

    // Role-based route protection: OWNER-only routes
    if (isAuthenticated && user) {
      const isOwnerOnlyRoute = ownerOnlyRoutes.some(
        (route) => pathname === route || pathname.startsWith(route + "/"),
      );
      if (isOwnerOnlyRoute && user.role !== "OWNER") {
        toast.error("Only property owners can access this page.");
        router.push("/dashboard/tenant");
        return;
      }

      // Role-based route protection: TENANT-only routes
      const isTenantOnlyRoute = tenantOnlyRoutes.some(
        (route) => pathname === route || pathname.startsWith(route + "/"),
      );
      if (isTenantOnlyRoute && user.role !== "TENANT") {
        toast.error("This page is only available for tenants.");
        router.push("/dashboard/owner");
        return;
      }
    }
  }, [isAuthenticated, isLoading, pathname, router, user]);

  if (isLoading) {
    return null; // Prevents flash of unprotected content
  }

  return <>{children}</>;
}

