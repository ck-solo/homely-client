"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  HouseLineIcon,
  MagnifyingGlass,
  ArrowUpRight,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useAppSelector } from "@/redux/store";
import { useFavorites } from "@/features/favorite/hooks/useFavorites";
import ListingCard, {
  ListingCardSkeleton,
  type Listing,
} from "@/features/listing/components/ListingCard";
import MasonryGrid from "@/components/listings/MasonryGrid";

export default function SavedListingsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { favorites, isLoading, hasFetched, loadFavorites } = useFavorites();

  // Fetch favorites on mount
  useEffect(() => {
    if (!hasFetched) {
      loadFavorites();
    }
  }, [hasFetched, loadFavorites]);

  // Transform favorites to Listing[] for the grid
  const savedListings: Listing[] = favorites
    .filter((fav) => fav.listingId && typeof fav.listingId === "object")
    .map((fav) => ({
      _id: fav.listingId._id,
      title: fav.listingId.title,
      city: fav.listingId.city,
      rentBudget: fav.listingId.rentBudget,
      propertyType: fav.listingId.propertyType,
      genderPreference: fav.listingId.genderPreference,
      images: fav.listingId.images,
      amenities: fav.listingId.amenities,
      availabilityStatus: fav.listingId.availabilityStatus,
      description: fav.listingId.description,
      ownerRef: fav.listingId.ownerRef,
    }));

  return (
    <section className="min-h-screen bg-[#FAFAFA] pt-28 md:pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── Page Header ──── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-red-50 rounded-xl">
                  <Heart size={22} weight="fill" className="text-red-500" />
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl tracking-tight text-neutral-900">
                  Saved <span className="text-neutral-400">Listings</span>
                </h1>
              </div>
              <p className="mt-2 text-neutral-500 text-sm md:text-base">
                {isLoading
                  ? "Loading your saved properties..."
                  : savedListings.length > 0
                  ? `You have ${savedListings.length} saved ${
                      savedListings.length === 1 ? "property" : "properties"
                    }`
                  : "Properties you save will appear here"}
              </p>
            </div>

            <Link href="/listings">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 bg-neutral-900 text-white px-5 py-3 rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm"
              >
                <MagnifyingGlass size={16} />
                Explore More
                <ArrowUpRight size={14} />
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* ─── Loading State ──── */}
        {isLoading ? (
          <div className="w-full">
            <MasonryGrid
              items={Array.from(Array(6).keys())}
              keyExtractor={(item) => item.toString()}
              renderItem={(item) => (
                <ListingCardSkeleton index={item as number} />
              )}
            />
          </div>
        ) : savedListings.length === 0 ? (
          /* ─── Empty State ──── */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center">
                <HouseLineIcon
                  size={44}
                  weight="light"
                  className="text-neutral-300"
                />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                className="absolute -top-1 -right-1 w-10 h-10 rounded-full bg-red-50 flex items-center justify-center border-4 border-[#FAFAFA]"
              >
                <Heart size={18} weight="fill" className="text-red-400" />
              </motion.div>
            </div>

            <h3 className="text-xl font-medium text-neutral-900 mb-2">
              No saved listings yet
            </h3>
            <p className="text-sm text-neutral-500 max-w-md mb-8 leading-relaxed">
              When you find properties you love, click the{" "}
              <Heart
                size={14}
                weight="fill"
                className="inline text-red-400 -mt-0.5"
              />{" "}
              heart button to save them here for quick access later.
            </p>

            <Link href="/listings">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm"
              >
                <MagnifyingGlass size={16} />
                Browse Listings
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          /* ─── Listings Grid ──── */
          <AnimatePresence mode="wait">
            <motion.div
              key="saved-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <MasonryGrid
                items={savedListings}
                keyExtractor={(listing) => listing._id}
                renderItem={(listing, idx) => (
                  <ListingCard listing={listing} index={idx} />
                )}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
