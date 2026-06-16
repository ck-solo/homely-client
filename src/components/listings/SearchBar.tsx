"use client";

import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useState, useCallback } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search by city, title, or keyword...",
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = useCallback(() => {
    onChange("");
  }, [onChange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`relative flex items-center w-full max-w-2xl bg-white border rounded-2xl transition-all duration-300 ease-out ${
        isFocused
          ? "border-neutral-400 shadow-[0_0_0_4px_rgba(0,0,0,0.04)]"
          : "border-neutral-200 shadow-sm hover:border-neutral-300"
      }`}
    >
      {/* Search Icon */}
      <div className="pl-4 pr-2 flex items-center">
        <MagnifyingGlass
          size={20}
          weight="regular"
          className={`transition-colors duration-200 ${
            isFocused ? "text-neutral-700" : "text-neutral-400"
          }`}
        />
      </div>

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="flex-1 py-3.5 pr-4 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 outline-none"
        id="search-listings-input"
      />

      {/* Clear Button */}
      {value && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={handleClear}
          className="mr-3 p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-700 transition-colors duration-200"
          aria-label="Clear search"
          id="search-clear-btn"
        >
          <X size={14} weight="bold" />
        </motion.button>
      )}
    </motion.div>
  );
}
