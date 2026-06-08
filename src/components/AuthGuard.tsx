"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/store";

const publicRoutes = ["/", "/login", "/register", "/verify-email"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only run if not loading
    if (isLoading) return;

    const isPublicRoute = publicRoutes.some(route => 
      pathname === route || pathname.startsWith(route + "?")
    );

    if (!isAuthenticated && !isPublicRoute) {
      // Unauthenticated users trying to access protected route
      router.push("/login");
    } else if (isAuthenticated && isPublicRoute && pathname !== "/") {
      // Authenticated users trying to access auth pages (login/register)
      // Landing page ("/") can be accessible to both, but usually we redirect them to dashboard
      const dashboardUrl = user?.role === "OWNER" ? "/dashboard/owner" : "/dashboard/tenant";
      router.push(dashboardUrl);
    }
  }, [isAuthenticated, isLoading, pathname, router, user]);

  // Optionally show a loading spinner while determining auth state
  // if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return <>{children}</>;
}
