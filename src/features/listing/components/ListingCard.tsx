"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "@phosphor-icons/react";

export interface ListingCardProps {
  propertyType?: string;
  genderPreference?: string;
  rentBudget?: string | number;
  title?: string;
  description?: string;
  amenities?: string[];
  images?: (string | { previewUrl: string })[];
  city?: string;
  className?: string;
}

export default function ListingCard({
  propertyType = "Apartment",
  genderPreference = "Co-ed",
  rentBudget,
  title = "Discovering peace",
  description = "Far from the city's noise, the green mountains stretch endlessly into the horizon, blanketed with mist and silence.",
  amenities = [],
  images = [],
  city = "Blue Ridge",
  className = "",
}: ListingCardProps) {
  const lastImageUrl = React.useMemo(() => {
    if (!images || images.length === 0) return null;
    const lastImg = images[images.length - 1];
    if (typeof lastImg === "string") {
      return lastImg;
    }
    return lastImg?.previewUrl || null;
  }, [images]);

  // Handle Indian currency formatting for rent budget safely
  const formattedRent = React.useMemo(() => {
    if (!rentBudget) return "₹0";
    const numericRent = Number(rentBudget);
    if (isNaN(numericRent)) return `₹${rentBudget}`;
    return `₹${numericRent.toLocaleString()}`;
  }, [rentBudget]);

  return (
    <motion.div
      layout
      className={`w-full sm:w-[400px] bg-white rounded-[32px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-neutral-100/60 relative z-10 group ${className}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      {/* Card Header Tag Row */}
      <div className="flex justify-between items-center w-full">
        {/* Category & Preference tag */}
        <span className="bg-[#222222] text-[#F3F4F6] px-3.5 py-1.5 rounded-full text-xs font-normal tracking-wide shadow-sm">
          {propertyType || "Apartment"} • {genderPreference}
        </span>

        {/* Combined Rent Price Pill */}
        <div className="flex items-center text-[10px] font-medium tracking-wider shadow-sm rounded-full overflow-hidden">
          <span className="bg-[#222222] text-white px-3 py-1.5 uppercase border border-r-0 border-[#222222] rounded-l-full">
            Rent
          </span>
          <span className="bg-white text-[#222222] px-3 py-1.5 font-bold border border-[#E5E5E5] rounded-r-full">
            {formattedRent}/mo
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-[28px] font-normal tracking-tight text-[#222222] mt-5 line-clamp-1 min-h-[38px] leading-tight">
        {title || "Discovering peace"}
      </h3>

      {/* Description */}
      <p className="text-lg text-neutral-500 font-light leading-5 mt-2.5 mb-4 line-clamp-3 min-h-[72px] text-black break-words">
        {description ||
          "Far from the city's noise, the green mountains stretch endlessly into the horizon, blanketed with mist and silence."}
      </p>

      {/* Amenities Tag Row */}
      <div className="flex flex-wrap gap-1.5 mb-6 min-h-[26px]">
        {amenities.length > 0 ? (
          amenities.map((amenity, idx) => (
            <span
              key={idx}
              className="text-[10px] bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-full border border-neutral-200/40 font-medium"
            >
              {amenity}
            </span>
          ))
        ) : (
          ["High-Speed Wi-Fi", "Air Conditioning"].map((amenity, idx) => (
            <span
              key={idx}
              className="text-[10px] bg-neutral-50 text-neutral-300 px-2.5 py-1 rounded-full border border-neutral-200/20 font-light select-none"
            >
              {amenity}
            </span>
          ))
        )}
      </div>

      {/* Card Hero Image (inset at bottom) */}
      <div className="relative h-60 bg-neutral-100 rounded-[24px] overflow-hidden shadow-inner">
        <AnimatePresence mode="wait">
          {lastImageUrl ? (
            <motion.div
              key={lastImageUrl}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${lastImageUrl})`,
              }}
            />
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80')`,
              }}
            />
          )}
        </AnimatePresence>

        {/* Map/Location Overlay on Image (Bottom-Left) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        
        <div className="absolute bottom-5 left-5 text-white z-10 flex flex-col gap-0.5">
          <div className="flex items-center gap-1">
            <MapPin size={16} weight="bold" className="text-white shrink-0" />
            <span className="text-lg font-medium tracking-tight leading-none drop-shadow-sm">
              {city || "Blue Ridge"}
            </span>
          </div>
          <span className="text-xs text-white/80 font-light pl-5 drop-shadow-xs">
            {city ? "Location Verified" : "Virginia, USA"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
