"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState, useCallback, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HouseLineIcon, SmileySadIcon } from "@phosphor-icons/react";

import api from "@/lib/axios";
import { useDebounce } from "@/lib/useDebounce";
import SearchBar from "@/components/listings/SearchBar";
import FilterPanel, {
  DEFAULT_FILTERS,
  type FilterState,
} from "@/components/listings/FilterPanel";
import ListingCard, {
  ListingCardSkeleton,
  type Listing,
} from "@/features/listing/components/ListingCard";
import MasonryGrid from "@/components/listings/MasonryGrid";
import { useFavorites } from "@/features/favorite/hooks/useFavorites";

// ─── API Fetcher ────────────────────────────────────────
interface ListingsResponse {
  success: boolean;
  data: Listing[];
  total: number;
  page: number;
  limit: number;
}

const fetchListings = async (params: Record<string, string>): Promise<ListingsResponse> => {
  // Remove empty params
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== "" && v !== undefined)
  );

  const { data } = await api.get("/listings", { params: cleanParams });
  return data;
};

// ─── Inner Page (needs Suspense boundary for useSearchParams) ──
function ListingsPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { loadFavorites, hasFetched } = useFavorites();

  useEffect(() => {
    if (!hasFetched) {
      loadFavorites();
    }
  }, [hasFetched, loadFavorites]);

  // ─── State from URL params ────────────────────────────
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [filters, setFilters] = useState<FilterState>(() => ({
    type: searchParams.get("type")?.split(",").filter(Boolean) || [],
    gender: searchParams.get("gender")?.split(",").filter(Boolean) || [],
    minRent: Number(searchParams.get("minRent")) || DEFAULT_FILTERS.minRent,
    maxRent: Number(searchParams.get("maxRent")) || DEFAULT_FILTERS.maxRent,
  }));
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  // Debounce search input (300ms)
  const debouncedSearch = useDebounce(searchTerm, 300);

  // ─── Build Query Params ───────────────────────────────
  const buildQueryParams = useCallback((): Record<string, string> => {
    const params: Record<string, string> = {};

    if (debouncedSearch) params.search = debouncedSearch;
    if (filters.type.length > 0) params.type = filters.type.join(",");
    if (filters.gender.length > 0) params.gender = filters.gender.join(",");
    if (filters.minRent > DEFAULT_FILTERS.minRent)
      params.minRent = String(filters.minRent);
    if (filters.maxRent < DEFAULT_FILTERS.maxRent)
      params.maxRent = String(filters.maxRent);
    params.page = String(page);
    params.limit = "12";

    return params;
  }, [debouncedSearch, filters, page]);

  // ─── Sync state → URL ─────────────────────────────────
  useEffect(() => {
    const params = buildQueryParams();
    const urlParams = new URLSearchParams();

    Object.entries(params).forEach(([key, val]) => {
      // Don't persist default values in URL
      if (key === "page" && val === "1") return;
      if (key === "limit") return;
      urlParams.set(key, val);
    });

    const queryString = urlParams.toString();
    const newUrl = queryString ? `/listings?${queryString}` : "/listings";
    router.replace(newUrl, { scroll: false });
  }, [buildQueryParams, router]);

  // ─── TanStack Query ───────────────────────────────────
  const queryParams = buildQueryParams();

  const {
    data: response,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["listings", queryParams],
    queryFn: () => fetchListings(queryParams),
    placeholderData: (prev) => prev, // keep previous data while refetching
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const listings = response?.data || [];
  const total = response?.total || 0;

  // ─── Handlers ─────────────────────────────────────────
  const handleSearch = useCallback((val: string) => {
    setSearchTerm(val);
    setPage(1); // Reset to first page on new search
  }, []);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setSearchTerm("");
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }, []);

  // ─── Derived UI State ─────────────────────────────────
  const totalPages = Math.ceil(total / 12);
  const hasActiveSearch = debouncedSearch || filters.type.length > 0 || filters.gender.length > 0 || filters.minRent > 0 || filters.maxRent < 100000;

  return (
    <section className="min-h-screen bg-luxury-bg pt-28 md:pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ─── Page Header ──── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl tracking-tight text-luxury-text-beige font-instrument">
            {debouncedSearch ? (
              <>
                Results for{" "}
                <span className="text-luxury-gold italic">&ldquo;{debouncedSearch}&rdquo;</span>
              </>
            ) : (
              <>
                Browse <span className="text-luxury-gold italic">Premium Spaces</span>
              </>
            )}
          </h1>
          <p className="mt-2 text-neutral-500 text-sm md:text-base">
            {total > 0
              ? `Showing ${listings.length} of ${total} available listings`
              : isLoading
              ? "Searching for your perfect place..."
              : "No listings found"}
          </p>
        </motion.div>

        {/* ─── Search + Filters ──── */}
        <div className="space-y-4 mb-10">
          <SearchBar
            value={searchTerm}
            onChange={handleSearch}
          />
          <FilterPanel
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleReset}
            resultCount={total}
          />
        </div>

        {/* ─── Loading Indicator (subtle top bar) ──── */}
        <AnimatePresence>
          {isFetching && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-0 left-0 right-0 z-60 h-0.5"
            >
              <div className="h-full bg-luxury-gold animate-pulse rounded-full" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Listings Grid ──── */}
        {isLoading ? (
          <div className="w-full">
            <MasonryGrid
              items={Array.from(Array(8).keys())}
              keyExtractor={(item) => item.toString()}
              renderItem={(item) => <ListingCardSkeleton index={item as number} />}
            />
          </div>
        ) : isError ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-red-900/20 border border-red-500/30 flex items-center justify-center mb-4">
              <SmileySadIcon size={32} weight="light" className="text-red-400" />
            </div>
            <h3 className="text-lg font-instrument text-luxury-text-beige mb-2">
              Something went wrong
            </h3>
            <p className="text-sm text-luxury-text-muted max-w-md">
              We couldn&apos;t load the listings. Please try again later.
            </p>
          </motion.div>
        ) : listings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-luxury-card border border-luxury-border flex items-center justify-center mb-4">
              <HouseLineIcon size={32} weight="light" className="text-luxury-gold" />
            </div>
            <h3 className="text-lg font-instrument text-luxury-text-beige mb-2">
              No listings found
            </h3>
            <p className="text-sm text-luxury-text-muted max-w-md mb-6">
              Try adjusting your search or filters to discover more options.
            </p>
            {hasActiveSearch && (
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-full bg-luxury-gold text-luxury-bg text-sm font-medium hover:bg-luxury-gold-light transition-colors luxury-hover-glow"
                id="empty-state-reset-btn"
              >
                Clear all filters
              </button>
            )}
          </motion.div>
        ) : (
          <>
            <div className="w-full">
              <MasonryGrid
                items={listings}
                keyExtractor={(listing) => listing._id}
                renderItem={(listing, idx) => (
                  <ListingCard listing={listing} index={idx} />
                )}
              />
            </div>

            {/* ─── Pagination ──── */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-2 mt-12"
              >
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl text-sm font-medium border border-luxury-border bg-luxury-card text-luxury-text-beige hover:bg-luxury-bg-lighter disabled:opacity-40 disabled:cursor-not-allowed transition-colors luxury-hover-glow"
                  id="pagination-prev"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from(Array(Math.min(totalPages, 5)).keys()).map((i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`
                          w-10 h-10 rounded-xl text-sm font-medium transition-all duration-200
                          ${
                            page === pageNum
                              ? "bg-luxury-gold text-luxury-bg shadow-md"
                              : "bg-luxury-card text-luxury-text-beige border border-luxury-border hover:bg-luxury-bg-lighter"
                          }
                        `}
                        id={`pagination-page-${pageNum}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-xl text-sm font-medium border border-luxury-border bg-luxury-card text-luxury-text-beige hover:bg-luxury-bg-lighter disabled:opacity-40 disabled:cursor-not-allowed transition-colors luxury-hover-glow"
                  id="pagination-next"
                >
                  Next
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

// ─── Page Export with Suspense ───────────────────────────
export default function ListingsPage() {
  return (
    <Suspense
      fallback={
        <section className="min-h-screen bg-luxury-bg pt-28 md:pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-12 w-64 bg-luxury-card rounded-xl animate-pulse mb-8 border border-luxury-border" />
            <div className="h-12 w-full max-w-2xl bg-luxury-card rounded-2xl animate-pulse mb-10 border border-luxury-border" />
            <div className="w-full">
              {/* Fallback uses CSS columns since MasonryGrid needs JS to measure window width */}
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:balance] w-full">
                {Array.from(Array(8).keys()).map((i) => (
                  <div key={i} className="break-inside-avoid mb-6 w-full inline-block">
                    <ListingCardSkeleton index={i} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      }
    >
      <ListingsPageInner />
    </Suspense>
  );
}
