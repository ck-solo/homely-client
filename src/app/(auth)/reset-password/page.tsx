"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword } from "@/api/password/resetPassword";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    !token
      ? "Invalid or missing reset token. Please request a new password reset link."
      : null,
  );
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await resetPassword({
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      setSuccess(
        response?.message ||
          "Password has been successfully reset. You can now log in.",
      );

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      const apiError = err as {
        response?: {
          data?: { message?: string; errors?: { message: string }[] };
        };
      };
      // The API error response format: err.response.data.message or err.response.data.errors array
      let errorMessage = "Failed to process request. Please try again.";
      if (
        apiError.response?.data?.errors &&
        apiError.response.data.errors.length > 0
      ) {
        errorMessage = apiError.response.data.errors
          .map((e) => e.message)
          .join(", ");
      } else if (apiError.response?.data?.message) {
        errorMessage = apiError.response.data.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-white text-neutral-900 pt-18 md:pt-22">
      {/* LEFT COLUMN - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 lg:py-20 relative bg-white">
        <div className="max-w-md w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl tracking-tight font-medium mb-2">
              Set New Password
            </h1>
            <p className="text-neutral-500 font-light mb-8">
              Please enter your new password below.
            </p>
          </motion.div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-600 text-sm">
              {success}
              <div className="mt-2 text-xs">Redirecting to login...</div>
            </div>
          )}

          {/* FORM */}
          {!success && (
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-neutral-600 ml-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={!token}
                  className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-neutral-600 ml-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={!token}
                  className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={isLoading || !token}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-neutral-900 text-white px-6 py-3.5 rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors group disabled:opacity-70"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
                <ArrowRightIcon
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </motion.button>
            </form>
          )}

          <p className="mt-8 text-center text-sm text-neutral-500">
            <Link
              href="/login"
              className="text-neutral-900 underline underline-offset-4 hover:text-neutral-600 transition-colors"
            >
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN - Visual/Branding (Hidden on smaller screens) */}
      <div className="hidden lg:block w-1/2 relative bg-[#FAFAFA] p-8 lg:p-12 lg:pt-8">
        <div className="sticky top-26 h-[calc(100vh-140px)] w-full flex flex-col justify-between overflow-hidden rounded-3xl shadow-sm">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <Image
              src="/Homely1.jpg"
              alt="Interior space"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
          </motion.div>

          <div className="relative z-10 p-10 md:p-14 mt-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-5xl tracking-tight leading-[1.1] mb-4 text-white font-medium"
            >
              Secure your account.
            </motion.h2>
          </div>
        </div>
      </div>
    </div>
  );
}
