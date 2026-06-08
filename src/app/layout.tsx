import type { Metadata, Viewport } from "next";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import "./globals.css";

import { Providers } from "@/redux/provider";
import AuthGuard from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: "Homely | Roommate & Rental Finder",
  description: "A curated platform for discovering modern rentals and connecting with roommates who share your vibe.",
  manifest: "/manifest.json", // Setup for PWA
};

export const viewport: Viewport = {
  themeColor: "#FAFAFA", // Light mode compatibility
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#FAFAFA] selection:bg-neutral-200 selection:text-neutral-900">
        <Providers>
          <AuthGuard>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}