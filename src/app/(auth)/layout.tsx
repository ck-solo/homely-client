/**
 * Auth Layout
 * Shared layout for authentication pages (login/register)
 * Provides consistent styling and centered container for auth forms
 */

import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <Link href="/" className="flex items-center gap-1 group mb-6">
          <span className="text-3xl font-extrabold tracking-tight text-gray-900 group-hover:text-slate-800 transition-colors">
            Homely<span className="text-violet-600">.</span>
          </span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-10 px-8 border border-slate-100 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)]">
          {children}
        </div>
      </div>
    </div>
  );
}

