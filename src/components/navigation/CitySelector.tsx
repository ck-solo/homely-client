"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, CaretDown, Check } from "@phosphor-icons/react";

const CITIES = [
  "Bangalore",
  "Mumbai",
  "Delhi NCR",
  "Pune",
  "Hyderabad",
  "Chennai",
];

export default function CitySelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-luxury-bg/80 hover:bg-luxury-card backdrop-blur-xs border border-luxury-border rounded-full transition-all duration-300 text-sm font-medium text-luxury-text-beige luxury-hover-glow"
      >
        <MapPin size={16} weight="bold" className="text-luxury-gold" />
        <span className="hidden sm:inline">{selectedCity}</span>
        <span className="sm:hidden">{selectedCity.slice(0, 3)}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <CaretDown size={14} className="text-luxury-text-muted" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-48 bg-luxury-card/95 backdrop-blur-xl border border-luxury-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden z-50"
          >
            <div className="p-1.5 flex flex-col gap-0.5">
              {CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm transition-colors ${
                    selectedCity === city
                      ? "bg-luxury-gold text-luxury-bg font-medium"
                      : "text-luxury-text-muted hover:bg-luxury-bg-lighter hover:text-luxury-text-beige"
                  }`}
                >
                  {city}
                  {selectedCity === city && <Check size={14} weight="bold" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
