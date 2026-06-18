"use client";

import { useAppSelector } from "@/redux/store";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function VerifyEmailPendingPage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    // If user is verified, send them to dashboard
    if (isAuthenticated && user?.isEmailVerified) {
      router.push(user.role === "OWNER" ? "/dashboard/owner" : "/dashboard/tenant");
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen pt-22 bg-neutral-50 flex items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center w-full min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white p-10 rounded-3xl shadow-sm border border-neutral-100 text-center"
        >
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M14 8h-4m0 0v11m0-11L5 8m5 0l5 5" />
            </svg>
          </div>
          <h1 className="text-2xl font-medium mb-2">Check your inbox!</h1>
          <p className="text-neutral-500 mb-8">
            We&apos;ve sent a verification link to <span className="font-medium text-neutral-900">{user?.email || "your email"}</span>. Please verify your email to access your dashboard.
          </p>

          <Link
            href="/login"
            className="inline-block bg-neutral-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            Back to Login
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
