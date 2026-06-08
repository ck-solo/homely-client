/**
 * Login Form Component
 * Reusable login form with React Hook Form and Zod validation
 * Handles email/password input, validation, and submission
 *
 * Flow: User enters credentials → Form validation (Zod) →
 * Submit → useAuthApi.login() → Store updates → Redirect to /dashboard
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useAuthApi } from '../hooks/useAuthApi';
import Link from 'next/link';

// Zod validation schema for login
const loginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
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
      // Redirect to dashboard on successful login
      router.push('/dashboard');
    } catch (error: any) {
      setApiError(error.message || 'An error occurred during login');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Email Address
        </label>
        <input
          {...register('email')}
          id="email"
          type="email"
          placeholder="name@example.com"
          className={`w-full px-4 py-3 border rounded-xl bg-gray-50/30 text-sm transition-all duration-200 focus:outline-none focus:bg-white focus:ring-4 ${
            errors.email
              ? 'border-red-300 focus:ring-red-100 focus:border-red-500'
              : 'border-gray-200 focus:ring-violet-100 focus:border-violet-500'
          }`}
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label htmlFor="password" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Password
          </label>
        </div>
        <input
          {...register('password')}
          id="password"
          type="password"
          placeholder="••••••••"
          className={`w-full px-4 py-3 border rounded-xl bg-gray-50/30 text-sm transition-all duration-200 focus:outline-none focus:bg-white focus:ring-4 ${
            errors.password
              ? 'border-red-300 focus:ring-red-100 focus:border-red-500'
              : 'border-gray-200 focus:ring-violet-100 focus:border-violet-500'
          }`}
        />
        {errors.password && (
          <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.password.message}</p>
        )}
      </div>

      {/* API Error */}
      {apiError && (
        <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl">
          <p className="text-xs text-red-600 font-semibold leading-relaxed">{apiError}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 text-sm shadow-sm active:scale-[0.99] cursor-pointer ${
          isLoading
            ? 'bg-gray-300 cursor-not-allowed shadow-none'
            : 'bg-violet-600 hover:bg-violet-700 hover:shadow-violet-100 hover:shadow-lg'
        }`}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>

    </form>

  );
};
