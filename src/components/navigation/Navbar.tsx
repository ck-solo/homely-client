"use client";

import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { ArrowRight, SignOut, User } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/redux/store";
import UserDetails from "./UserDetails";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CitySelector from "./CitySelector";

// Data for navigation
const NAV_LINKS = [
  { name: "Explore Rentals", href: "/listings" },
  { name: "Roommates", href: "/#roommates" },
  { name: "Vibe Match", href: "/#vibe-match" },
  { name: "List Property", href: "/create-listing", ownerOnly: true },
  { name: "Saved Listings", href: "/saved-listings", tenantOnly: true },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Top Navbar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 md:py-6 transition-colors duration-500 ${
          isOpen ? "bg-transparent text-luxury-text-beige" : "bg-luxury-bg/80 backdrop-blur-md border-b border-luxury-border text-luxury-text-beige"
        }`}
      >
        {/* Brand */}
        <Link href="/" className="relative z-50 text-2xl tracking-tight font-medium flex items-center  gap-1" onClick={() => setIsOpen(false)}>
          <Image src="/favicon.png" alt="" width={32} height={32}  />
          Homely.
        </Link>

        {/* Right Actions */}
        <div className="relative z-50 flex items-center gap-3 md:gap-6">
          <div className={`hidden sm:block transition-opacity duration-300 ${isOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
            <CitySelector />
          </div>

          <div className={`hidden md:block transition-opacity duration-300 ${isOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
            {mounted ? (
              isAuthenticated && user ? (
                <UserDetails user={user} />
              ) : (
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all bg-luxury-gold text-luxury-bg hover:bg-luxury-gold-light luxury-hover-glow"
                  >
                    Get Started <ArrowRight size={16} />
                  </motion.button>
                </Link>
              )
            ) : (
              <div className="w-[130px] h-[40px] bg-neutral-200/50 animate-pulse rounded-full" />
            )}
          </div>

          {/* Animated Menu Toggle Pill */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`relative flex items-center justify-center w-[80px] h-[40px] rounded-full overflow-hidden transition-all duration-300 luxury-hover-glow ${
              isOpen ? "bg-luxury-card hover:bg-luxury-bg-lighter text-luxury-gold border border-luxury-gold" : "bg-luxury-card hover:bg-luxury-bg-lighter text-luxury-text-beige border border-luxury-border"
            }`}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.span
                  key="close"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute text-sm font-medium"
                >
                  Close
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute text-sm font-medium"
                >
                  Menu
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.header>

      {/* Full Screen Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 bg-luxury-bg flex flex-col justify-center px-6 md:px-12 pt-20"
          >
            {/* Mesh gradient effect inside overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(201, 164, 92, 0.15) 0px, transparent 40%),
                radial-gradient(circle at 80% 70%, rgba(201, 164, 92, 0.1) 0px, transparent 40%)
              `
            }} />

            <div className="relative z-10 w-full max-w-screen-2xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-12">
              
              {/* Main Navigation Links */}
              <nav className="flex flex-col gap-4 md:gap-6">
                {NAV_LINKS.map((link, i) => {
                  // Owner-only links: hide from non-owners (tenants and unauthenticated users)
                  if (link.ownerOnly && mounted && (!isAuthenticated || user?.role !== "OWNER")) return null;
                  // Tenant-only links: hide from non-tenants (owners and unauthenticated users)
                  if (link.tenantOnly && mounted && (!isAuthenticated || user?.role !== "TENANT")) return null;

                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.8, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="group inline-flex items-center text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-luxury-text-muted hover:text-luxury-gold transition-colors font-instrument italic tracking-tight"
                      >
                        <motion.span 
                          className="inline-block transition-transform duration-500 ease-[0.16,1,0.3,1] group-hover:translate-x-6"
                        >
                          {link.name}
                        </motion.span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Secondary Actions / User details for Mobile */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-6 md:pb-8"
              >
                {/* Mobile City Selector */}
                <div className="sm:hidden block w-fit">
                   <p className="text-neutral-500 text-xs uppercase tracking-widest mb-3">Location</p>
                   <CitySelector />
                </div>

                {mounted && isAuthenticated && user ? (
                  <div className="flex flex-col gap-4">
                    <p className="text-neutral-500 text-xs uppercase tracking-widest mb-1">Account</p>
                    <div className="flex items-center gap-3">
                      {user.profilePicture ? (
                        <Image
                          width={48}
                          height={48}
                          src={user.profilePicture}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover border border-neutral-800"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-neutral-800 text-white flex items-center justify-center text-lg font-medium">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-white font-medium">{user.name}</span>
                        <span className="text-neutral-500 text-sm">{user.email}</span>
                      </div>
                    </div>
                    <Link href="/profile" onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2 mt-2 w-fit">
                      <User size={18} /> My Profile
                    </Link>
                    <LogoutButton onLogout={() => setIsOpen(false)} />
                  </div>
                ) : (
                  <div className="md:hidden">
                    <p className="text-neutral-500 text-xs uppercase tracking-widest mb-4">Account</p>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 bg-luxury-gold text-luxury-bg px-6 py-3 rounded-full text-sm font-medium hover:bg-luxury-gold-light transition-all w-fit luxury-hover-glow"
                      >
                        Get Started <ArrowRight size={16} />
                      </motion.button>
                    </Link>
                  </div>
                )}

                {/* Footer Links */}
                <div className="mt-8 md:mt-12 flex gap-6 text-sm text-neutral-500">
                  <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                  <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                </div>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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
      className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors mt-2 w-fit"
    >
      <SignOut size={18} />
      Logout
    </button>
  );
}
