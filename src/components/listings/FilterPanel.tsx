"use client";

import { motion, AnimatePresence } from "motion/react";
import { Funnel, X } from "@phosphor-icons/react";
import { useState, useCallback } from "react";

// ─── Types ──────────────────────────────────────────────
export interface FilterState {
  type: string[];
  gender: string[];
  minRent: number;
  maxRent: number;
}

export const DEFAULT_FILTERS: FilterState = {
  type: [],
  gender: [],
  minRent: 0,
  maxRent: 100000,
};

const PROPERTY_TYPES = ["PG", "Hostel", "Flat", "Apartment", "House"];
const GENDER_OPTIONS = ["Male", "Female", "Co-ed"];

const RENT_MIN = 0;
const RENT_MAX = 100000;
const RENT_STEP = 500;

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  resultCount?: number;
}

// ─── Component ──────────────────────────────────────────
export default function FilterPanel({
  filters,
  onChange,
  onReset,
  resultCount,
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const activeFilterCount =
    filters.type.length +
    filters.gender.length +
    (filters.minRent > RENT_MIN ? 1 : 0) +
    (filters.maxRent < RENT_MAX ? 1 : 0);

  // ─── Handlers ─────────────────────────────────────────
  const toggleType = useCallback(
    (t: string) => {
      const newTypes = filters.type.includes(t)
        ? filters.type.filter((x) => x !== t)
        : [...filters.type, t];
      onChange({ ...filters, type: newTypes });
    },
    [filters, onChange]
  );

  const toggleGender = useCallback(
    (g: string) => {
      const newGenders = filters.gender.includes(g)
        ? filters.gender.filter((x) => x !== g)
        : [...filters.gender, g];
      onChange({ ...filters, gender: newGenders });
    },
    [filters, onChange]
  );

  const handleMinRent = useCallback(
    (val: number) => {
      onChange({
        ...filters,
        minRent: Math.min(val, filters.maxRent - RENT_STEP),
      });
    },
    [filters, onChange]
  );

  const handleMaxRent = useCallback(
    (val: number) => {
      onChange({
        ...filters,
        maxRent: Math.max(val, filters.minRent + RENT_STEP),
      });
    },
    [filters, onChange]
  );

  const formatRent = (val: number) => {
    if (val >= 100000) return "₹1L+";
    if (val >= 1000) return `₹${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}k`;
    return `₹${val}`;
  };

  return (
    <div className="w-full">
      {/* ─── Filter Toggle Bar (mobile + desktop) ──── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-wrap items-center gap-3"
      >
        {/* Filter Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
            border transition-all duration-200
            ${
              isExpanded || activeFilterCount > 0
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300"
            }
          `}
          id="filter-toggle-btn"
        >
          <Funnel size={16} weight={activeFilterCount > 0 ? "fill" : "regular"} />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-xs">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* ─── Quick Filter Pills (Desktop) ──── */}
        <div className="hidden md:flex items-center gap-2 flex-wrap">
          {PROPERTY_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => toggleType(t)}
              className={`
                px-3.5 py-2 rounded-xl text-xs font-medium
                border transition-all duration-200
                ${
                  filters.type.includes(t)
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:text-neutral-900"
                }
              `}
              id={`filter-type-${t.toLowerCase()}`}
            >
              {t}
            </button>
          ))}

          <div className="w-px h-6 bg-neutral-200 mx-1" />

          {GENDER_OPTIONS.map((g) => (
            <button
              key={g}
              onClick={() => toggleGender(g)}
              className={`
                px-3.5 py-2 rounded-xl text-xs font-medium
                border transition-all duration-200
                ${
                  filters.gender.includes(g)
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:text-neutral-900"
                }
              `}
              id={`filter-gender-${g.toLowerCase()}`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Reset button */}
        {activeFilterCount > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-100 transition-colors duration-200"
            id="filter-reset-btn"
          >
            <X size={12} weight="bold" />
            Clear all
          </motion.button>
        )}

        {/* Result Count */}
        {resultCount !== undefined && (
          <span className="text-sm text-neutral-400 ml-auto">
            {resultCount} {resultCount === 1 ? "listing" : "listings"} found
          </span>
        )}
      </motion.div>

      {/* ─── Expanded Filter Panel ──── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Property Type (mobile only — desktop uses pills above) */}
                <div className="md:hidden">
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-3">
                    Property Type
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {PROPERTY_TYPES.map((t) => (
                      <button
                        key={t}
                        onClick={() => toggleType(t)}
                        className={`
                          px-3.5 py-2 rounded-xl text-xs font-medium border transition-all duration-200
                          ${
                            filters.type.includes(t)
                              ? "bg-neutral-900 text-white border-neutral-900"
                              : "bg-neutral-50 text-neutral-600 border-neutral-200"
                          }
                        `}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gender Preference (mobile only) */}
                <div className="md:hidden">
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-3">
                    Gender Preference
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {GENDER_OPTIONS.map((g) => (
                      <button
                        key={g}
                        onClick={() => toggleGender(g)}
                        className={`
                          px-3.5 py-2 rounded-xl text-xs font-medium border transition-all duration-200
                          ${
                            filters.gender.includes(g)
                              ? "bg-neutral-900 text-white border-neutral-900"
                              : "bg-neutral-50 text-neutral-600 border-neutral-200"
                          }
                        `}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rent Range Slider */}
                <div className="md:col-span-3">
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">
                    Rent Range
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-neutral-900">
                        {formatRent(filters.minRent)}
                      </span>
                      <span className="text-xs text-neutral-400 mx-4">to</span>
                      <span className="text-lg font-semibold text-neutral-900">
                        {formatRent(filters.maxRent)}
                      </span>
                    </div>

                    {/* Dual Range Slider */}
                    <div className="relative h-2">
                      {/* Track background */}
                      <div className="absolute inset-0 rounded-full bg-neutral-100" />
                      {/* Active track */}
                      <div
                        className="absolute h-full rounded-full bg-neutral-900"
                        style={{
                          left: `${((filters.minRent - RENT_MIN) / (RENT_MAX - RENT_MIN)) * 100}%`,
                          right: `${100 - ((filters.maxRent - RENT_MIN) / (RENT_MAX - RENT_MIN)) * 100}%`,
                        }}
                      />
                      {/* Min slider */}
                      <input
                        type="range"
                        min={RENT_MIN}
                        max={RENT_MAX}
                        step={RENT_STEP}
                        value={filters.minRent}
                        onChange={(e) => handleMinRent(Number(e.target.value))}
                        className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-auto z-20
                          [&::-webkit-slider-thumb]:appearance-none
                          [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                          [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-neutral-900
                          [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md
                          [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform
                          [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5
                          [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white
                          [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-neutral-900
                          [&::-moz-range-thumb]:cursor-pointer"
                        id="filter-rent-min"
                      />
                      {/* Max slider */}
                      <input
                        type="range"
                        min={RENT_MIN}
                        max={RENT_MAX}
                        step={RENT_STEP}
                        value={filters.maxRent}
                        onChange={(e) => handleMaxRent(Number(e.target.value))}
                        className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-auto z-20
                          [&::-webkit-slider-thumb]:appearance-none
                          [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                          [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-neutral-900
                          [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md
                          [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform
                          [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5
                          [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white
                          [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-neutral-900
                          [&::-moz-range-thumb]:cursor-pointer"
                        id="filter-rent-max"
                      />
                    </div>

                    {/* Labels */}
                    <div className="flex justify-between text-xs text-neutral-400">
                      <span>{formatRent(RENT_MIN)}</span>
                      <span>{formatRent(RENT_MAX)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
