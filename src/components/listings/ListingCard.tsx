"use client";

import { motion } from "motion/react";
import { HeartIcon, MapPinIcon, BedIcon } from "@phosphor-icons/react";
import Image from "next/image";

// ─── Types ──────────────────────────────────────────────
export interface Listing {
  _id: string;
  title: string;
  city: string;
  rentBudget: number;
  propertyType: string;
  genderPreference: string;
  images: string[];
  amenities: string[];
  availabilityStatus: boolean;
}

interface ListingCardProps {
  listing: Listing;
  index?: number;
}

// ─── Component ──────────────────────────────────────────
import React from 'react';

const ListingCard = React.memo(function ListingCard({ listing, index = 0 }: ListingCardProps) {
  const {
    _id,
    title,
    city,
    rentBudget,
    propertyType,
    images,
    genderPreference,
  } = listing;

  const formatRent = (val: number) => {
    if (val >= 100000) return "₹1,00,000";
    return `₹${val.toLocaleString("en-IN")}`;
  };

  const typeColors: Record<string, string> = {
    PG: "bg-violet-100 text-violet-700",
    Hostel: "bg-amber-100 text-amber-700",
    Flat: "bg-sky-100 text-sky-700",
    Apartment: "bg-emerald-100 text-emerald-700",
    House: "bg-rose-100 text-rose-700",
  };

  const genderColors: Record<string, string> = {
    Male: "bg-blue-50 text-blue-600",
    Female: "bg-pink-50 text-pink-600",
    "Co-ed": "bg-purple-50 text-purple-600",
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:border-neutral-200 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
      id={`listing-card-${_id}`}
    >
      {/* ─── Image Container ──── */}
      <div className="relative aspect-4/3 overflow-hidden bg-neutral-100">
        {images && images.length > 0 ? (
          <Image
            src={images[0]}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-50">
            <BedIcon size={40} weight="light" className="text-neutral-300" />
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Favorite button */}
        <button
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-neutral-500 hover:text-red-500 transition-all duration-200 shadow-sm"
          aria-label="Add to favorites"
          id={`favorite-btn-${_id}`}
        >
          <HeartIcon size={18} weight="regular" />
        </button>

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="px-3 py-1.5 rounded-lg bg-neutral-900/85 backdrop-blur-sm text-white">
            <span className="text-sm font-semibold">{formatRent(rentBudget)}</span>
            <span className="text-xs text-neutral-300 ml-0.5"> /mo</span>
          </div>
        </div>
      </div>

      {/* ─── Content ──── */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-[15px] font-semibold text-neutral-900 leading-snug line-clamp-1 group-hover:text-neutral-700 transition-colors">
          {title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 mt-1.5">
          <MapPinIcon size={13} weight="fill" className="text-neutral-400 shrink-0" />
          <span className="text-xs text-neutral-500 truncate">{city}</span>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mt-3">
          <span
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${
              typeColors[propertyType] || "bg-neutral-100 text-neutral-600"
            }`}
          >
            {propertyType}
          </span>
          <span
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${
              genderColors[genderPreference] || "bg-neutral-100 text-neutral-600"
            }`}
          >
            {genderPreference}
          </span>
        </div>
      </div>
    </motion.article>
  );
});

export default ListingCard;

// ─── Skeleton Loader ────────────────────────────────────
export function ListingCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl overflow-hidden border border-neutral-100"
    >
      <div className="aspect-4/3 bg-neutral-100 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-neutral-100 rounded-lg w-3/4 animate-pulse" />
        <div className="h-3 bg-neutral-100 rounded-lg w-1/2 animate-pulse" />
        <div className="flex gap-2">
          <div className="h-6 bg-neutral-100 rounded-lg w-14 animate-pulse" />
          <div className="h-6 bg-neutral-100 rounded-lg w-12 animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
}
