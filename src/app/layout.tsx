/**
 * Root Layout
 * Main layout wrapper for the entire application
 * Initializes authentication on app load
 *
 * Authentication Flow:
 * 1. App loads
 * 2. AuthInitializer component runs useEffect
 * 3. Calls fetchCurrentUser() to restore session from cookies
 * 4. If user exists: sets auth state
 * 5. If user doesn't exist: user remains unauthenticated
 * 6. Protected routes (like /dashboard) check auth state and redirect if needed
 */

import type { Metadata } from "next";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
