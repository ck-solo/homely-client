"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Envelope } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/api/password/forgotPassword";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
   

  const { mutate, isPending } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (response) => {
      toast.success(response.message || "Reset link sent successfully");
      setSubmitted(true);
    },
    onError: (err: any) => {
      const errMsg = err.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errMsg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter a valid email address.");
      return;
    }
    mutate(email);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-white text-neutral-900 pt-18 md:pt-22">
      {/* LEFT COLUMN - Authentication Form / Success State */}
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
                  Forgot password.
                </h1>
                <p className="text-neutral-500 font-light mb-8">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </p>

                {/* FORM */}
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-neutral-600 ml-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                        <Envelope size={18} weight="light" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full bg-neutral-50 border border-neutral-200 pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                        disabled={isPending}
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={isPending}
                    type="submit"
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-neutral-900 text-white px-6 py-3.5 rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors group disabled:opacity-70"
                  >
                    {isPending ? "Sending Link..." : "Send Reset Link"}
                    {!isPending && (
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
                  <Envelope size={32} weight="light" />
                </div>
                <h1 className="text-3xl tracking-tight font-medium mb-4">
                  Check your email.
                </h1>
                <p className="text-neutral-500 font-light leading-relaxed mb-8">
                  If an account exists with <strong className="text-neutral-900">{email}</strong>, a password reset link has been sent. Please check your inbox and spam folder.
                </p>

                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full flex items-center justify-center gap-2 bg-neutral-900 text-white px-6 py-3.5 rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors"
                  >
                    Back to Login
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
              src="/Homely2.jpg"
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
              Keep your account secure.
            </h2>
            <p className="text-white/80 font-light text-lg max-w-md">
              Verification links ensure that only you can modify your access credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
