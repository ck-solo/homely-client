'use client';

import Link from 'next/link';
import { User, House, ArrowRight } from '@phosphor-icons/react';

export default function LoginPage() {
  return (
    <div className="font-sans">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Welcome Back
        </h2>
        <p className="mt-2 text-sm text-gray-500 font-normal">
          Select your portal to continue to your dashboard
        </p>
      </div>

      <div className="space-y-4">
        {/* Tenant Card */}
        <Link
          href="/tenant/login"
          className="group block p-6 bg-white border border-slate-100 rounded-3xl hover:border-[#B4A0FF] hover:bg-slate-50/30 transition-all duration-300 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_30px_-10px_rgba(180,160,255,0.1)] hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-5">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center text-[#B4A0FF] group-hover:bg-[#B4A0FF] group-hover:text-white transition-all duration-300">
              <User size={24} weight="bold" />
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-gray-900 group-hover:text-gray-900">
                  Tenant Portal
                </h3>
                <ArrowRight
                  size={16}
                  className="text-gray-400 group-hover:text-[#B4A0FF] group-hover:translate-x-1 transition-all duration-300"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 font-normal leading-relaxed">
                Find rentals, roommates, and manage matching preferences
              </p>
            </div>
          </div>
        </Link>

        {/* Owner Card */}
        <Link
          href="/owner/login"
          className="group block p-6 bg-white border border-slate-100 rounded-3xl hover:border-[#FEBD59] hover:bg-slate-50/30 transition-all duration-300 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_30px_-10px_rgba(254,189,89,0.1)] hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-5">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-[#FEBD59] group-hover:bg-[#FEBD59] group-hover:text-white transition-all duration-300">
              <House size={24} weight="bold" />
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-gray-900 group-hover:text-gray-900">
                  Owner Portal
                </h3>
                <ArrowRight
                  size={16}
                  className="text-gray-400 group-hover:text-[#FEBD59] group-hover:translate-x-1 transition-all duration-300"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 font-normal leading-relaxed">
                List properties, view application metrics, and manage leads
              </p>
            </div>
          </div>
        </Link>
      </div>

    </div>
  );
}
