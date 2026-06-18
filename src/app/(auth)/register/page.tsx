"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowLeft, House, Key } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useRegister } from "@/features/auth/hooks/useRegister";
import { registerUser } from "@/features/auth/slice";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, clearRegisterError } = useRegister();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    role: "TENANT",
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [validationError, setValidationError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError("");
    if (error) clearRegisterError();
  };

  const handleNextStep = () => {
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    const resultAction = await register(formData);
    if (registerUser.fulfilled.match(resultAction)) {
      setStep(3); // Move to success step
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-white text-neutral-900 pt-18 md:pt-22">
      
      {/* LEFT COLUMN - Authentication Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 lg:py-20 relative bg-white">
        
        <div className="max-w-md w-full mx-auto min-h-125 flex flex-col justify-center">
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl tracking-tight font-medium mb-2">
                  What are you looking for?
                </h1>
                <p className="text-neutral-500 font-light mb-8">
                  Select how you want to use Homely.
                </p>

                <div className="flex flex-col gap-4">
                  <div 
                    onClick={() => setFormData({ ...formData, role: "TENANT" })}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                      formData.role === "TENANT" 
                        ? "border-neutral-900 bg-neutral-50" 
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${formData.role === "TENANT" ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600"}`}>
                      <Key size={24} weight="duotone" />
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-900 mb-1">I want to rent</h3>
                      <p className="text-sm text-neutral-500">Find your perfect home and roommates.</p>
                    </div>
                  </div>

                  <div 
                    onClick={() => setFormData({ ...formData, role: "OWNER" })}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                      formData.role === "OWNER" 
                        ? "border-neutral-900 bg-neutral-50" 
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${formData.role === "OWNER" ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600"}`}>
                      <House size={24} weight="duotone" />
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-900 mb-1">I want to list property</h3>
                      <p className="text-sm text-neutral-500">List your property and find great tenants.</p>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleNextStep}
                  className="mt-8 w-full flex items-center justify-center gap-2 bg-neutral-900 text-white px-6 py-3.5 rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors group"
                >
                  Continue
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <button 
                  onClick={() => setStep(1)}
                  className="mb-6 flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>

                <h1 className="text-3xl tracking-tight font-medium mb-2">
                  Create an account.
                </h1>
                <p className="text-neutral-500 font-light mb-8">
                  Enter your details to get started.
                </p>

                {/* Error message */}
                {(error || validationError) && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm">
                    {validationError || error}
                  </div>
                )}

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-neutral-600 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-neutral-600 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-neutral-600 ml-1">Phone Number (Optional)</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-neutral-600 ml-1">Password</label>
                      <input 
                        type="password" 
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-neutral-600 ml-1">Confirm Password</label>
                      <input 
                        type="password" 
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={isLoading}
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-neutral-900 text-white px-6 py-3.5 rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors group disabled:opacity-70"
                  >
                    {isLoading ? "Creating account..." : "Sign Up"}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M14 8h-4m0 0v11m0-11L5 8m5 0l5 5" />
                  </svg>
                </div>
                <h1 className="text-3xl tracking-tight font-medium mb-4">
                  Check your inbox!
                </h1>
                <p className="text-neutral-500 font-light mb-8">
                  We&apos;ve sent a verification link to <span className="font-medium text-neutral-900">{formData.email}</span>. Please verify your email to continue setting up your profile. Redirecting you...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer stuff (only show on step 1 and 2) */}
          {step !== 3 && (
            <>
              <div className="mt-8 relative flex items-center justify-center">
                <div className="absolute w-full border-t border-neutral-200" />
                <span className="relative bg-white px-4 text-xs text-neutral-400 uppercase tracking-widest">
                  Or continue with
                </span>
              </div>

              <button className="mt-6 w-full flex items-center justify-center gap-3 bg-white border border-neutral-200 text-neutral-900 px-6 py-3 rounded-xl text-sm hover:bg-neutral-50 transition-colors shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.72 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                  <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.72 17.57C14.74 18.23 13.48 18.63 12 18.63C9.13999 18.63 6.71 16.7 5.84 14.09H2.17999V16.94C3.98999 20.53 7.7 23 12 23Z" fill="#34A853"/>
                  <path d="M5.84 14.09C5.62 13.43 5.49 12.73 5.49 12C5.49 11.27 5.62 10.57 5.84 9.91V7.06H2.17999C1.42999 8.55 1 10.23 1 12C1 13.77 1.42999 15.45 2.17999 16.94L5.84 14.09Z" fill="#FBBC05"/>
                  <path d="M12 5.38C13.62 5.38 15.06 5.93 16.2 7.02L19.36 3.86C17.46 2.09 14.97 1 12 1C7.7 1 3.98999 3.47 2.17999 7.06L5.84 9.91C6.71 7.3 9.13999 5.38 12 5.38Z" fill="#EA4335"/>
                </svg>
                Google
              </button>

              <p className="mt-8 mb-8 text-center text-sm text-neutral-500">
                Already have an account?{" "}
                <Link 
                  href="/login" 
                  className="text-neutral-900 underline underline-offset-4 hover:text-neutral-600 transition-colors"
                >
                  Log in
                </Link>
              </p>
            </>
          )}

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
              src="/Homely3.jpg" 
              alt="Interior space" 
              fill 
              sizes="50vw"
              className="object-cover"
              priority
            />
            {/* Subtle gradient overlay to ensure text readability */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
          </motion.div>

          <div className="relative z-10 p-10 md:p-14 mt-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-5xl tracking-tight leading-[1.1] mb-4 text-white font-medium"
            >
              {formData.role === "TENANT" ? "Find your perfect space." : "List to great tenants."}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-white/80 font-light text-lg max-w-md"
            >
              {formData.role === "TENANT" 
                ? "Set up your profile to join a curated community of modern renters." 
                : "Join Homely to manage your properties with ease and confidence."}
            </motion.p>
          </div>
        </div>
      </div>

    </div>
  );
}
