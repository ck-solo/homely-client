import type { Metadata, Viewport } from "next";
import { Instrument_Serif } from "next/font/google";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import "./globals.css";

import { Providers } from "@/redux/provider";
import AuthGuard from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: "Homely | Roommate & Rental Finder",
  description: "A curated platform for discovering modern rentals and connecting with roommates who share your vibe.",
  icons: {
    icon: "/favicon.png",
  },
  manifest: "/manifest.json", // Setup for PWA
};

export const viewport: Viewport = {
  themeColor: "#11100e", // Dark luxury theme compatibility
};

const instrument = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  style: ["italic", "normal"],
  variable: "--font-instrument",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased scroll-smooth ${instrument.variable}`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-luxury-bg text-luxury-text-beige selection:bg-luxury-gold selection:text-luxury-bg">
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