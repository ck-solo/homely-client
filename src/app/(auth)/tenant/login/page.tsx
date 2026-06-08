'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useAuthApi } from '@/features/auth/hooks/useAuthApi';
import Link from 'next/link';
import { User, Key, ArrowLeft } from '@phosphor-icons/react';

// Zod validation schema for login
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function TenantLoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthApi();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setApiError(null);
      await login(data);
      // Redirect to tenant dashboard
      router.push('/dashboard/tenant');
    } catch (error: any) {
      setApiError(error.message || 'An error occurred during login');
    }
  };

  return (
    <div className="font-sans">
      {/* Back button */}
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors mb-6 group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to portal selection
      </Link>

      <div className="mb-6">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-violet-50 text-[#B4A0FF] border border-violet-100 mb-3">
          Tenant Portal
        </span>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Sign In
        </h2>
        <p className="mt-1 text-xs text-gray-500 font-normal">
          Access your Homely roommate and rental finder account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5"
          >
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
              <User size={18} />
            </span>
            <input
              {...register('email')}
              id="email"
              type="email"
              placeholder="name@example.com"
              className={`w-full pl-10 pr-4 py-2.5 border rounded-2xl bg-gray-50/20 text-sm transition-all duration-200 focus:outline-none focus:bg-white focus:ring-4 ${
                errors.email
                  ? 'border-red-300 focus:ring-red-100/50 focus:border-red-500'
                  : 'border-gray-200 focus:ring-violet-100/50 focus:border-[#B4A0FF]'
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-500 font-semibold">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
              <Key size={18} />
            </span>
            <input
              {...register('password')}
              id="password"
              type="password"
              placeholder="••••••••"
              className={`w-full pl-10 pr-4 py-2.5 border rounded-2xl bg-gray-50/20 text-sm transition-all duration-200 focus:outline-none focus:bg-white focus:ring-4 ${
                errors.password
                  ? 'border-red-300 focus:ring-red-100/50 focus:border-red-500'
                  : 'border-gray-200 focus:ring-violet-100/50 focus:border-[#B4A0FF]'
              }`}
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500 font-semibold">{errors.password.message}</p>
          )}
        </div>

        {/* Backend / API Error Message */}
        {apiError && (
          <div className="p-3.5 bg-red-50 border border-red-100 rounded-2xl">
            <p className="text-xs text-red-600 font-semibold leading-relaxed">
              {apiError}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-2xl font-bold text-white transition-all duration-200 text-sm shadow-sm active:scale-[0.99] cursor-pointer mt-2 ${
            isLoading
              ? 'bg-gray-300 cursor-not-allowed shadow-none'
              : 'bg-[#B4A0FF] hover:bg-[#9B85FF] hover:shadow-violet-100 hover:shadow-lg'
          }`}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>

      </form>
    </div>
  );
}
