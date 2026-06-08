'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store/authStore';

export default function TenantDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.role !== 'TENANT') {
        router.push('/dashboard/owner');
      }
    }
  }, [user, isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#B4A0FF]"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== 'TENANT') {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-500 font-semibold">
        Verifying permissions...
      </div>
    );
  }

  return <>{children}</>;
}
