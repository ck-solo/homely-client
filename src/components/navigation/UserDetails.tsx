"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { User } from "@/features/auth/slice";
import { DotsThreeVertical } from "@phosphor-icons/react";
import Image from "next/image";
import ProfileDropdown from "./ProfileDropdown";

interface UserDetailsProps {
  user: User;
}

export default function UserDetails({ user }: UserDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Get initials for avatar fallback
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "US";

  return (
    <div className="relative flex items-center gap-3 px-4 py-2 bg-neutral-50/80 backdrop-blur-xs border border-neutral-200/60 rounded-full hover:bg-neutral-100/80 transition-all duration-300 shadow-2xs select-none">
      {/* Avatar Container */}
      {user.profilePicture ? (
        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-neutral-200/80 shadow-3xs shrink-0">
          <Image
            src={user.profilePicture}
            alt={user.name}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-medium tracking-wide shrink-0 border border-neutral-800">
          {initials}
        </div>
      )}

      {/* User Details */}
      <div className="flex flex-col text-left max-w-25 md:max-w-37.5 leading-tight">
        <span className="text-xs font-medium text-neutral-900 truncate">
          {user.name}
        </span>
        <span className="text-[10px] text-neutral-400 font-light truncate mt-0.5">
          {user.email}
        </span>
      </div>
      
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="text-neutral-500 hover:text-neutral-900 p-0.5 rounded-full hover:bg-neutral-200/50 transition-colors focus:outline-none"
      >
        <DotsThreeVertical size={20} weight="bold" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Click-outside backdrop */}
            <div 
              className="fixed inset-0 z-40 bg-transparent cursor-default" 
              onClick={() => setIsOpen(false)}
            />
            {/* Positioned Dropdown */}
            <div className="absolute right-0 top-full mt-2 z-50">
              <ProfileDropdown onClose={() => setIsOpen(false)} />
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
