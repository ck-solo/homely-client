"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 pt-24 pb-8 px-6 md:px-12 overflow-hidden rounded-t-[2.5rem]">
      <div className="max-w-screen-2xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-0 mb-24">
          <div className="flex flex-col items-start">
            <h3 className="text-2xl text-white tracking-tight mb-6">Ready to move?</h3>
            <Link href="/login">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white text-neutral-900 px-6 py-3 rounded-full flex items-center gap-2 hover:bg-neutral-200 transition-colors"
              >
                Get Started <ArrowUpRight size={18} />
              </motion.button>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8 md:justify-end">
            <div className="flex flex-col gap-4">
              <h4 className="text-white text-sm tracking-wide uppercase mb-2">Platform</h4>
              <Link href="/login" className="hover:text-white transition-colors">Find Rentals</Link>
              <Link href="/login" className="hover:text-white transition-colors">Find Roommates</Link>
              <Link href="/map" className="hover:text-white transition-colors">Explore Map</Link>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-white text-sm tracking-wide uppercase mb-2">Company</h4>
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-neutral-800 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm">© {new Date().getFullYear()} Homely. All rights reserved.</p>
          
          <div className="flex items-center gap-2">
            <span className="text-sm">Have a space?</span>
            <Link href="/login?role=owner" className="text-white text-sm border-b border-white/30 hover:border-white pb-0.5 transition-colors">
              Be an owner
            </Link>
          </div>
        </div>

        {/* Oversized Brand Element */}
        <div className="mt-20 w-full flex justify-center">
          <h1 className="text-[15vw] leading-none tracking-tighter text-white opacity-5 select-none pointer-events-none">
            HOMELY.
          </h1>
        </div>
      </div>
    </footer>
  );
}