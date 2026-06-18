"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  HeartIcon,
  HouseLineIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useAppSelector } from "@/redux/store";
import { useFavorites, useToggleFavorite } from "@/features/favorites/hooks/useFavorites";
import ListingCard, {
  ListingCardSkeleton,
} from "@/components/listings/ListingCard";

// ─── Page ───────────────────────────────────────────────
export default function FavoritesPage() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { favorites, isFavorited, isLoading, isError } = useFavorites();
  const toggleMutation = useToggleFavorite();

  const handleToggle = (listingId: string) => {
    toggleMutation.mutate(listingId);
  };

  const savedCount = favorites.length;

  return (
    <section className="min-h-screen bg-[#FAFAFA] pt-28 md:pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── Back Link ──── */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <Link
            href="/dashboard/tenant"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors group"
            id="favorites-back-link"
          >
            <ArrowLeftIcon
              size={14}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            Back to Dashboard
          </Link>
        </motion.div>

        {/* ─── Page Header ──── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-red-50 rounded-xl">
              <HeartIcon size={22} weight="fill" className="text-red-500" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl tracking-tight text-neutral-900">
                Saved <span className="text-neutral-400">Spaces</span>
              </h1>
            </div>
          </div>
          <p className="text-neutral-500 text-sm md:text-base mt-2">
            {isLoading
              ? "Loading your saved properties..."
              : savedCount > 0
              ? `You have ${savedCount} saved ${
                  savedCount === 1 ? "property" : "properties"
                }`
              : "Properties you love will appear here"}
          </p>
        </motion.div>

        {/* ─── Content ──── */}
        {isLoading ? (
          // Skeleton Loading State
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from(Array(4).keys()).map((i) => (
              <ListingCardSkeleton key={i} index={i} />
            ))}
          </div>
        ) : isError ? (
          // Error State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <HeartIcon size={32} weight="light" className="text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Something went wrong
            </h3>
            <p className="text-sm text-neutral-500 max-w-md">
              We couldn&apos;t load your saved properties. Please try again later.
            </p>
          </motion.div>
        ) : savedCount === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center">
                <HouseLineIcon
                  size={40}
                  weight="light"
                  className="text-neutral-300"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-red-50 flex items-center justify-center border-2 border-white">
                <HeartIcon
                  size={14}
                  weight="fill"
                  className="text-red-400"
                />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              No saved spaces yet
            </h3>
            <p className="text-sm text-neutral-500 max-w-sm mb-8 leading-relaxed">
              When you find a listing you love, tap the heart icon to save it
              here for easy comparison later.
            </p>
            <Link href="/listings">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm"
                id="favorites-explore-btn"
              >
                <MagnifyingGlassIcon size={16} />
                Explore Listings
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          // Favorites Grid
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {favorites.map((fav, idx) => {
                // Ensure listing data is populated
                if (!fav.listingId || typeof fav.listingId === "string") {
                  return null;
                }

                return (
                  <motion.div
                    key={fav._id}
                    layout
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  >
                    <ListingCard
                      listing={fav.listingId}
                      index={idx}
                      isFavorited={isFavorited(fav.listingId._id)}
                      onToggleFavorite={handleToggle}
                      isToggling={toggleMutation.isPending}
                    />
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
