'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store/authStore';
import { User, EnvelopeSimple, Phone, IdentificationCard, SignOut } from '@phosphor-icons/react';

export default function OwnerDashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="grid gap-6 max-w-4xl mx-auto font-sans">
      {/* Welcome Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-[#FEBD59] border border-amber-100">
              Owner Account
            </span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 leading-tight">
            Welcome, {user?.name}!
          </h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            List and manage vacant apartments, track listings, and connect with tenants.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-2xl transition-all duration-200 active:scale-[0.98] cursor-pointer"
        >
          <SignOut size={16} weight="bold" />
          Logout
        </button>
      </div>

      {/* Main Grid: User Details */}
      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.03)]">
        <h3 className="text-lg font-extrabold text-gray-900 mb-6">
          Account Information
        </h3>

        <div className="space-y-6 max-w-2xl">
          <div className="flex items-center gap-4 border-b border-gray-50 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#FEBD59] flex-shrink-0">
              <User size={20} weight="bold" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Name</p>
              <p className="font-bold text-gray-900 text-sm">{user?.name || 'Not provided'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-b border-gray-50 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#FEBD59] flex-shrink-0">
              <EnvelopeSimple size={20} weight="bold" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</p>
              <p className="font-bold text-gray-900 text-sm">{user?.email || 'Not provided'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-b border-gray-50 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#FEBD59] flex-shrink-0">
              <Phone size={20} weight="bold" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone Number</p>
              <p className="font-bold text-gray-900 text-sm">{user?.phone || 'Not provided'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 pb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#FEBD59] flex-shrink-0">
              <IdentificationCard size={20} weight="bold" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Owner ID</p>
              <p className="font-mono text-xs text-gray-500 font-bold">{user?._id || user?.id || 'Not available'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
