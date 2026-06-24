"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPinIcon, HeartIcon, PencilSimpleIcon, SpinnerIcon } from "@phosphor-icons/react";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useFavorites } from "@/features/favorite/hooks/useFavorites";
import toast from "react-hot-toast";

export interface Listing {
  _id: string;
  title: string;
  city: string;
  rentBudget: number;
  propertyType: string;
  genderPreference: string;
  images: string[];
  amenities: string[];
  availabilityStatus?: boolean;
  description?: string;
  ownerRef?: { _id: string } | string;
}

export interface ListingCardProps {
  listing?: Listing;
  index?: number;
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
  listing,
  index = 0,
  propertyType: propPropertyType,
  genderPreference: propGenderPreference,
  rentBudget: propRentBudget,
  title: propTitle,
  description: propDescription,
  amenities: propAmenities,
  images: propImages,
  city: propCity,
  className = "",
}: ListingCardProps) {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const { isFavorited, toggle, isToggling, isTenant } = useFavorites();

  // Resolve properties dynamically from listing object or individual props
  const title = listing?.title ?? propTitle ?? "Discovering peace";
  const propertyType = listing?.propertyType ?? propPropertyType ?? "Apartment";
  const genderPreference = listing?.genderPreference ?? propGenderPreference ?? "Co-ed";
  const rentBudget = listing?.rentBudget ?? propRentBudget;
  const description = listing?.description ?? propDescription ?? (listing ? "" : "Far from the city's noise, the green mountains stretch endlessly into the horizon, blanketed with mist and silence.");
  const amenities = listing?.amenities ?? propAmenities ?? [];
  const images = listing?.images ?? propImages;
  const city = listing?.city ?? propCity ?? "Blue Ridge";

  const isCurrentlyFavorited = listing?._id ? isFavorited(listing._id) : false;
  const isCurrentlyToggling = listing?._id ? isToggling === listing._id : false;

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!listing?._id) return;
    if (!isTenant) {
      toast.error("Only tenants can save listings.");
      return;
    }
    await toggle(listing._id);
  };

  const displayImageUrl = React.useMemo(() => {
    if (!images || images.length === 0) return null;
    
    // For stored backend listings, show the first image (cover/thumbnail)
    // For live preview (e.g. form creation list of preview urls), show the last uploaded image
    const isBackend = typeof images[0] === "string";
    const img = isBackend ? images[0] : images[images.length - 1];
    
    if (typeof img === "string") {
      return img;
    }
    return img?.previewUrl || null;
  }, [images]);

  // Handle Indian currency formatting for rent budget safely
  const formattedRent = React.useMemo(() => {
    if (!rentBudget) return "₹0";
    const numericRent = Number(rentBudget);
    if (isNaN(numericRent)) return `₹${rentBudget}`;
    return `₹${numericRent.toLocaleString("en-IN")}`;
  }, [rentBudget]);

  return (
    <motion.div
      layout
      id={listing?._id ? `listing-card-${listing._id}` : undefined}
      initial={listing ? { opacity: 0, y: 24 } : undefined}
      animate={listing ? { opacity: 1, y: 0 } : undefined}
      whileHover={{ y: -4 }}
      transition={
        listing
          ? {
              duration: 0.5,
              delay: index * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }
          : { duration: 0.3 }
      }
      className={`w-full h-fit ${listing ? "" : "sm:w-[400px]"} bg-white rounded-[32px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-neutral-100/60 relative z-10 group ${className}`}
    >
      {/* Card Header Tag Row */}
      <div className="flex flex-wrap justify-between items-center w-full gap-2">
        <div className="flex items-center gap-2">
          {/* Category & Preference tag */}
          <span className="bg-[#222222] text-[#F3F4F6] px-3.5 py-1.5 rounded-full text-xs font-normal tracking-wide shadow-sm">
            {propertyType || "Apartment"} • {genderPreference}
          </span>
        </div>

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
      <p className="text-lg text-neutral-500 font-light leading-5 mt-2.5 mb-4 line-clamp-3 min-h-[72px] wrap-break-word">
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
          {displayImageUrl ? (
            <motion.div
              key={displayImageUrl}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${displayImageUrl})`,
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

        {/* Action buttons wrapper */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          {/* Edit button (only visible if logged-in user is the owner) */}
          {user && listing?.ownerRef && 
            (typeof listing.ownerRef === "string" ? listing.ownerRef === user._id : listing.ownerRef._id === user._id) && (
            <button
              onClick={() => router.push(`/edit-listing/${listing._id}`)}
              className="p-2.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-indigo-50 text-neutral-600 hover:text-indigo-600 transition-all duration-200 shadow-md border border-neutral-100/40"
              aria-label="Edit listing"
              title="Edit Listing"
            >
              <PencilSimpleIcon size={18} weight="regular" />
            </button>
          )}

          {/* Favorite button — only visible for TENANT users on browse pages */}
          {listing?._id && isTenant && (
            <button
              onClick={handleToggleFavorite}
              disabled={isCurrentlyToggling}
              className={`p-2.5 rounded-full backdrop-blur-sm transition-all duration-200 shadow-md border border-neutral-100/40 ${
                isCurrentlyFavorited
                  ? "bg-red-50/90 text-red-500 hover:bg-red-100"
                  : "bg-white/80 hover:bg-white text-neutral-500 hover:text-red-500"
              }`}
              aria-label={isCurrentlyFavorited ? "Remove from favorites" : "Add to favorites"}
              id={`favorite-btn-${listing._id}`}
            >
              {isCurrentlyToggling ? (
                <SpinnerIcon size={18} weight="regular" className="animate-spin" />
              ) : (
                <HeartIcon size={18} weight={isCurrentlyFavorited ? "fill" : "regular"} />
              )}
            </button>
          )}
        </div>

        {/* Map/Location Overlay on Image (Bottom-Left) */}
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />
        
        <div className="absolute bottom-5 left-5 text-white z-10 flex flex-col gap-0.5">
          <div className="flex items-center gap-1">
            <MapPinIcon size={16} weight="bold" className="text-white shrink-0" />
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
