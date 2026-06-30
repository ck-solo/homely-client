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
      className={`relative flex items-center w-full max-w-2xl bg-luxury-card border rounded-2xl transition-all duration-300 ease-out ${
        isFocused
          ? "border-luxury-gold shadow-[0_0_0_4px_rgba(201,164,92,0.1)]"
          : "border-luxury-border shadow-sm hover:border-luxury-gold/50"
      }`}
    >
      {/* Search Icon */}
      <div className="pl-4 pr-2 flex items-center">
        <MagnifyingGlass
          size={20}
          weight="regular"
          className={`transition-colors duration-200 ${
            isFocused ? "text-luxury-text-beige" : "text-luxury-text-muted"
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
        className="flex-1 py-3.5 pr-4 bg-transparent text-sm text-luxury-text-beige placeholder:text-luxury-text-muted/50 outline-none"
        id="search-listings-input"
      />

      {/* Clear Button */}
      {value && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={handleClear}
          className="mr-3 p-1.5 rounded-full bg-luxury-bg hover:bg-luxury-bg-lighter text-luxury-text-muted hover:text-luxury-text-beige transition-colors duration-200"
          aria-label="Clear search"
          id="search-clear-btn"
        >
          <X size={14} weight="bold" />
        </motion.button>
      )}
    </motion.div>
  );
}
