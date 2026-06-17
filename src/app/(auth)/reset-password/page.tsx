"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Key, Warning } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/api/password/resetPassword";
import toast from "react-hot-toast";

function ResetPasswordPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const { mutate, isPending, error: apiError } = useMutation({
    mutationFn: resetPassword,
    onSuccess: (response) => {
      toast.success(response.message || "Password reset successfully!");
      setSubmitted(true);
    },
    onError: (err: any) => {
      const errMsg = err.response?.data?.message || "Reset failed. The token may be invalid or expired.";
      toast.error(errMsg);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Reset token is missing from the URL.");
      return;
    }

    if (!formData.newPassword) {
      toast.error("Password is required.");
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    // Standard complexity checks (should match server auth validator)
    const hasUppercase = /[A-Z]/.test(formData.newPassword);
    const hasLowercase = /[a-z]/.test(formData.newPassword);
    const hasNumber = /[0-9]/.test(formData.newPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword);

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      toast.error("Password must contain uppercase, lowercase, numbers, and special characters.");
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    mutate({
      token,
      newPassword: formData.newPassword,
      confirmNewPassword: formData.confirmNewPassword,
    });
  };

  const errorMessage = apiError ? (apiError as any).response?.data?.message || "Invalid or expired token" : null;

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-white text-neutral-900 pt-18 md:pt-22">
      {/* LEFT COLUMN - Authentication Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 lg:py-20 relative bg-white">
        <div className="max-w-md w-full mx-auto">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
              >
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-900 transition-colors mb-6 group"
                >
                  <ArrowLeft
                    size={16}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
                  Back to Login
                </Link>

                <h1 className="text-3xl tracking-tight font-medium mb-2">
                  Reset password.
                </h1>
                <p className="text-neutral-500 font-light mb-8">
                  Enter your new password below to update your account credentials.
                </p>

                {!token && (
                  <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-start gap-3">
                    <Warning size={20} className="shrink-0 mt-0.5 text-amber-600" />
                    <div>
                      <span className="font-semibold">Token Missing:</span> No password reset token was detected in the URL. Please verify your email link.
                    </div>
                  </div>
                )}

                {errorMessage && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
                    <Warning size={20} className="shrink-0 mt-0.5 text-red-500" />
                    <div>
                      <span className="font-semibold">Reset Failed:</span> {errorMessage}
                    </div>
                  </div>
                )}

                {/* FORM */}
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-neutral-600 ml-1">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                        <Key size={18} weight="light" />
                      </div>
                      <input
                        type="password"
                        name="newPassword"
                        required
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full bg-neutral-50 border border-neutral-200 pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                        disabled={isPending || !token}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-neutral-600 ml-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                        <Key size={18} weight="light" />
                      </div>
                      <input
                        type="password"
                        name="confirmNewPassword"
                        required
                        value={formData.confirmNewPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full bg-neutral-50 border border-neutral-200 pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                        disabled={isPending || !token}
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: token ? 1.01 : 1 }}
                    whileTap={{ scale: token ? 0.99 : 1 }}
                    disabled={isPending || !token}
                    type="submit"
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-neutral-900 text-white px-6 py-3.5 rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? "Updating Password..." : "Update Password"}
                    {!isPending && token && (
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    )}
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="text-left"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                  <Key size={32} weight="light" />
                </div>
                <h1 className="text-3xl tracking-tight font-medium mb-4">
                  Password updated.
                </h1>
                <p className="text-neutral-500 font-light leading-relaxed mb-8">
                  Your password has been successfully reset. You can now sign in to your account with your new password.
                </p>

                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full flex items-center justify-center gap-2 bg-neutral-900 text-white px-6 py-3.5 rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors"
                  >
                    Sign In
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT COLUMN - Visual/Branding */}
      <div className="hidden lg:block w-1/2 relative bg-[#FAFAFA] p-8 lg:p-12 lg:pt-8">
        <div className="sticky top-26 h-[calc(100vh-140px)] w-full flex flex-col justify-between overflow-hidden rounded-3xl shadow-sm">
          <div className="absolute inset-0">
            <Image
              src="/Homely3.jpg"
              alt="Interior space"
              fill
              className="object-cover"
              priority
            />
            {/* Subtle gradient overlay to ensure text readability */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
          </div>

          <div className="relative z-10 p-10 md:p-14 mt-auto">
            <h2 className="text-4xl md:text-5xl tracking-tight leading-[1.1] mb-4 text-white font-medium">
              Seamless access.
            </h2>
            <p className="text-white/80 font-light text-lg max-w-md">
              Update your credentials securely and get right back to finding your perfect space.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center text-neutral-400">
          Loading reset details...
        </div>
      }
    >
      <ResetPasswordPageInner />
    </Suspense>
  );
}
