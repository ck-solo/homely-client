"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, List } from "@phosphor-icons/react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
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
        <NavLink href="#find-room">Find a Room</NavLink>
        <NavLink href="#roommates">Roommates</NavLink>
        <NavLink href="#vibe-match">Vibe Match</NavLink>
      </nav>

      <div className="hidden md:flex items-center gap-4">
        <Link 
          href="/list-property" 
          className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          List Property
        </Link>
        <Link href="/login">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 rounded-full text-sm hover:bg-neutral-800 transition-colors"
          >
            Get Started <ArrowRight size={16} />
          </motion.button>
        </Link>
      </div>

      {/* Mobile Menu Toggle (PWA friendly) */}
      <button 
        className="md:hidden p-2 text-neutral-900"
        onClick={() => setIsOpen(!isOpen)}
      >
        <List size={24} />
      </button>
    </motion.header>
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