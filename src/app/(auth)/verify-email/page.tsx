"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useVerifyEmail } from "@/features/auth/hooks/useVerifyEmail";
import { verifyEmail } from "@/features/auth/slice";
import Link from "next/link";
import { motion } from "framer-motion";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const { verify, isLoading, error } = useVerifyEmail();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    !token ? "error" : "loading"
  );
  const [errorMessage, setErrorMessage] = useState(
    !token ? "No verification token provided." : ""
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    const runVerify = async () => {
      const resultAction = await verify(token);
      if (verifyEmail.fulfilled.match(resultAction)) {
        setStatus("success");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setStatus("error");
        setErrorMessage(resultAction.payload as string || "Failed to verify email.");
      }
    };

    runVerify();
  }, [token, verify, router]);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-10 rounded-3xl shadow-sm border border-neutral-100 text-center"
      >
        {status === "loading" && (
          <>
            <div className="w-16 h-16 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-6"></div>
            <h1 className="text-2xl font-medium mb-2">Verifying your email...</h1>
            <p className="text-neutral-500">Please wait while we confirm your email address.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-medium mb-2">Email Verified!</h1>
            <p className="text-neutral-500 mb-8">Your account has been successfully verified. Redirecting to login...</p>
            <Link 
              href="/login"
              className="inline-block bg-neutral-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-medium mb-2">Verification Failed</h1>
            <p className="text-neutral-500 mb-8">{errorMessage}</p>
            <Link 
              href="/login"
              className="inline-block bg-neutral-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors"
            >
              Return to Login
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen pt-22 bg-neutral-50 flex items-center justify-center p-4">
      <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
