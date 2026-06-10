"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { User, SignOut } from "@phosphor-icons/react";

interface ProfileDropdownProps {
  onClose: () => void;
}

export default function ProfileDropdown({ onClose }: ProfileDropdownProps) {
  const router = useRouter();
  const { logout } = useLogout();

  const handleUpdateProfile = () => {
    onClose();
    router.push("/profile/update");
  };

  const handleLogout = async () => {
    onClose();
    await logout();
    router.push("/login");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200/80 rounded-2xl shadow-lg py-2 z-50 overflow-hidden text-sm"
    >
      <button
        onClick={handleUpdateProfile}
        className="w-full flex items-center gap-3 px-4 py-3 text-left text-neutral-700 hover:bg-neutral-50 transition-colors font-light"
      >
        <User size={16} weight="light" />
        Update profile
      </button>

      <div className="border-t border-neutral-100 my-1" />

      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50/50 transition-colors font-medium"
      >
        <SignOut size={16} weight="light" className="text-red-500" />
        Logout
      </button>
    </motion.div>
  );
}
