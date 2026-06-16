"use client";

import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { ArrowRight, List, X, User, SignOut } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/redux/store";
import UserDetails from "./UserDetails";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 md:py-6 bg-white/70 backdrop-blur-md border-b border-neutral-200/50"
    >
      <Link href="/" className="text-xl tracking-tight text-neutral-900">
        Homely.
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-8 text-sm text-neutral-600">
        <NavLink href="/listings">Explore</NavLink>
        <NavLink href="#roommates">Roommates</NavLink>
        <NavLink href="#vibe-match">Vibe Match</NavLink>
      </nav>

      <div className="hidden md:flex items-center gap-4">
        <Link 
          href="/create-listing" 
          className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          List Property
        </Link>

        {mounted ? (
            isAuthenticated && user ? (
              <UserDetails user={user} />
            ) : (
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 rounded-full text-sm hover:bg-neutral-800 transition-colors"
                >
                  Get Started <ArrowRight size={16} />
                </motion.button>
              </Link>
            )
          ) : (
            <div className="w-[130px] h-[40px] bg-neutral-200/50 animate-pulse rounded-full" />
          )}
        </div>

        {/* Mobile Menu Toggle (PWA friendly) */}
        <button 
          className="md:hidden p-2 text-neutral-900"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <List size={24} />}
        </button>
      </motion.header>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs md:hidden"
              onClick={() => setIsOpen(false)}
            />
            {/* Menu */}
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-[70px] left-4 right-4 z-50 bg-white border border-neutral-200/80 rounded-2xl shadow-lg p-5 md:hidden max-h-[calc(100vh-90px)] overflow-y-auto"
            >
              {mounted && isAuthenticated && user && (
                <div className="flex items-center gap-3 mb-5 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                  {user.profilePicture ? (
                    <Image
                      width={40}
                      height={40}
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center text-sm font-medium">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-semibold text-neutral-900 truncate">{user.name}</span>
                    <span className="text-xs text-neutral-500 truncate">{user.email}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1">
                <MobileNavLink href="/listings" onClick={() => setIsOpen(false)}>
                  Explore
                </MobileNavLink>
                <MobileNavLink href="#roommates" onClick={() => setIsOpen(false)}>
                  Roommates
                </MobileNavLink>
                <MobileNavLink href="#vibe-match" onClick={() => setIsOpen(false)}>
                  Vibe Match
                </MobileNavLink>
                <MobileNavLink href="/list-property" onClick={() => setIsOpen(false)}>
                  List Property
                </MobileNavLink>

                {mounted && isAuthenticated && user && (
                  <>
                    <div className="border-t border-neutral-100 my-2" />
                    <MobileNavLink href="/profile" onClick={() => setIsOpen(false)}>
                      <User size={18} weight="light" className="inline mr-2 -mt-0.5" />
                      My Profile
                    </MobileNavLink>
                  </>
                )}

                <div className="border-t border-neutral-100 my-2" />

                {mounted ? (
                  isAuthenticated && user ? (
                    <LogoutButton onLogout={() => setIsOpen(false)} />
                  ) : (
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2 bg-neutral-900 text-white px-5 py-3 rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors"
                      >
                        Get Started <ArrowRight size={16} />
                      </motion.button>
                    </Link>
                  )
                ) : (
                  <div className="w-full h-[48px] bg-neutral-200/50 animate-pulse rounded-xl" />
                )}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="relative group overflow-hidden">
      <motion.span 
        className="inline-block transition-transform duration-300 group-hover:-translate-y-full"
      >
        {children}
      </motion.span>
      <motion.span 
        className="absolute left-0 top-0 inline-block translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-neutral-900"
      >
        {children}
      </motion.span>
    </Link>
  );
}

function MobileNavLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 px-3 py-2.5 rounded-xl transition-colors"
    >
      {children}
    </Link>
  );
}

function LogoutButton({ onLogout }: { onLogout: () => void }) {
  const router = useRouter();
  const { logout } = useLogout();

  const handleLogout = async () => {
    onLogout();
    await logout();
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 px-5 py-3 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
    >
      <SignOut size={18} weight="bold" />
      Logout
    </button>
  );
}
