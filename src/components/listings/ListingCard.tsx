"use client";

import React from "react";
import { motion } from "motion/react";
import ListingCardComponent, { Listing as FeaturesListing } from "@/features/listing/components/ListingCard";

// Re-export type Listing
export type Listing = FeaturesListing;

// Re-export ListingCard as default
const ListingCard = ListingCardComponent;
export default ListingCard;

// ─── Skeleton Loader ────────────────────────────────────
export function ListingCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className="w-full bg-white rounded-[32px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-neutral-100/60 flex flex-col pointer-events-none"
    >
      {/* Card Header Tag Row */}
      <div className="flex justify-between items-center w-full">
        {/* Category & Preference tag skeleton */}
        <div className="h-7 w-28 bg-neutral-100 rounded-full animate-pulse" />

        {/* Combined Rent Price Pill skeleton */}
        <div className="flex items-center rounded-full overflow-hidden">
          <div className="h-7 w-12 bg-neutral-200 animate-pulse border-r border-white" />
          <div className="h-7 w-16 bg-neutral-100 animate-pulse" />
        </div>
      </div>

      {/* Title skeleton */}
      <div className="h-[38px] mt-5 flex items-center">
        <div className="h-7 w-3/4 bg-neutral-200 rounded-lg animate-pulse" />
      </div>

      {/* Description skeleton */}
      <div className="mt-2.5 mb-4 space-y-2 min-h-[72px]">
        <div className="h-4 w-full bg-neutral-100 rounded animate-pulse" />
        <div className="h-4 w-5/6 bg-neutral-100 rounded animate-pulse" />
        <div className="h-4 w-2/3 bg-neutral-100 rounded animate-pulse" />
      </div>

      {/* Amenities Tag Row skeleton */}
      <div className="flex flex-wrap gap-1.5 mb-6 min-h-[26px]">
        <div className="h-[22px] w-20 bg-neutral-100 rounded-full animate-pulse" />
        <div className="h-[22px] w-24 bg-neutral-100 rounded-full animate-pulse" />
        <div className="h-[22px] w-16 bg-neutral-100 rounded-full animate-pulse" />
      </div>

      {/* Card Hero Image skeleton */}
      <div className="relative h-60 bg-neutral-100 rounded-[24px] overflow-hidden animate-pulse" />
    </motion.div>
  );
}
