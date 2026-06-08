'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store/authStore';

export default function DashboardIndexPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.role === 'TENANT') {
        router.push('/dashboard/tenant');
      } else if (user.role === 'OWNER') {
        router.push('/dashboard/owner');
      }
    }
  }, [user, isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center font-sans">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mb-4"></div>
      <p className="text-sm text-gray-500 font-medium">Redirecting you to your portal...</p>
    </div>
  );
}
