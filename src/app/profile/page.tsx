"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  PencilSimple,
  EnvelopeSimple,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  ShieldCheck,
  User,
  Buildings,
  IdentificationBadge,
  SealCheck,
  ArrowLeft,
  Spinner,
} from "@phosphor-icons/react";
import { useGetProfile } from "@/features/profile/hooks/useGetProfile";
import { useAppSelector } from "@/redux/store";

/** Readable labels for enum values */
const GENDER_LABELS: Record<string, string> = {
  MALE: "Male",
  FEMALE: "Female",
  NON_BINARY: "Non-Binary",
  OTHER: "Other",
  PREFER_NOT_TO_SAY: "Prefer not to say",
};

const FOOD_LABELS: Record<string, string> = {
  VEGETARIAN: "Vegetarian",
  NON_VEGETARIAN: "Non-Vegetarian",
  VEGAN: "Vegan",
  ANY: "Any",
};

const SLEEP_LABELS: Record<string, string> = {
  EARLY_BIRD: "Early Bird",
  NIGHT_OWL: "Night Owl",
  FLEXIBLE: "Flexible",
};

export default function ProfilePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data, isLoading, isError } = useGetProfile();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <Spinner size={32} className="text-neutral-400 animate-spin" />
      </div>
    );
  }

  // Redirect unauthenticated users
  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Spinner size={32} className="text-neutral-400" />
        </motion.div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 gap-4">
        <p className="text-neutral-500 text-sm">Failed to load profile data.</p>
        <button
          onClick={() => router.refresh()}
          className="text-sm text-neutral-900 underline underline-offset-4"
        >
          Try again
        </button>
      </div>
    );
  }

  const { user, profile } = data.data;
  const role = user.role as "TENANT" | "OWNER";

  // Resolve profile picture from profile document first, then fall back
  const profilePicture = profile?.profilePicture;
  const hasCustomPicture =
    profilePicture &&
    !profilePicture.includes("man-user-circle-icon");

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "US";

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-8 group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          Back
        </motion.button>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-3xl border border-neutral-200/60 shadow-[0_2px_20px_rgba(0,0,0,0.04)] overflow-hidden"
        >
          {/* Header gradient band */}
          <div className="h-28 bg-linear-to-br from-neutral-100 via-neutral-50 to-white relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,0,0,0.02)_0%,transparent_60%)]" />
          </div>

          {/* Avatar + Core Info */}
          <div className="px-6 sm:px-8 pb-8 -mt-14 relative">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5 sm:gap-6">
              {/* Avatar */}
              <div className="relative shrink-0">
                {hasCustomPicture ? (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                    <Image
                      src={profilePicture}
                      alt={user.name}
                      width={112}
                      height={112}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-neutral-900 text-white flex items-center justify-center text-2xl sm:text-3xl font-medium border-4 border-white shadow-lg">
                    {initials}
                  </div>
                )}
              </div>

              {/* Name & Email */}
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-semibold text-neutral-900 truncate">
                    {user.name}
                  </h1>
                  {user.isEmailVerified && (
                    <SealCheck
                      size={20}
                      weight="fill"
                      className="text-emerald-500 shrink-0"
                    />
                  )}
                </div>
                <p className="text-sm text-neutral-400 mt-0.5 truncate">
                  {user.email}
                </p>
              </div>

              {/* Edit Button */}
              <Link href="/profile/edit">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors shrink-0 cursor-pointer"
                >
                  <PencilSimple size={16} />
                  Edit Profile
                </motion.button>
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
              <StatCard
                label="Role"
                value={role === "TENANT" ? "Tenant" : "Owner"}
                icon={
                  <IdentificationBadge
                    size={16}
                    weight="light"
                    className="text-neutral-400"
                  />
                }
              />
              <StatCard
                label="Member since"
                value={memberSince}
                icon={
                  <Calendar
                    size={16}
                    weight="light"
                    className="text-neutral-400"
                  />
                }
              />
              <StatCard
                label="Email"
                value={user.isEmailVerified ? "Verified" : "Unverified"}
                icon={
                  <ShieldCheck
                    size={16}
                    weight="light"
                    className={
                      user.isEmailVerified
                        ? "text-emerald-500"
                        : "text-amber-500"
                    }
                  />
                }
              />
              <StatCard
                label="Status"
                value={user.accountStatus === "ACTIVE" ? "Active" : "Blocked"}
                icon={
                  <User
                    size={16}
                    weight="light"
                    className="text-neutral-400"
                  />
                }
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-100" />

          {/* Contact Info */}
          <div className="px-6 sm:px-8 py-6">
            <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
              Contact Information
            </h2>
            <div className="space-y-3">
              <InfoRow
                icon={<EnvelopeSimple size={18} weight="light" />}
                label="Email"
                value={user.email}
              />
              <InfoRow
                icon={<Phone size={18} weight="light" />}
                label="Phone"
                value={user.phone || "Not provided"}
                muted={!user.phone}
              />
            </div>
          </div>

          {/* Role-specific details */}
          {role === "TENANT" && profile && (
            <>
              <div className="border-t border-neutral-100" />
              <div className="px-6 sm:px-8 py-6">
                <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                  Personal Details
                </h2>
                <div className="space-y-3">
                  <InfoRow
                    icon={<User size={18} weight="light" />}
                    label="Bio"
                    value={profile.bio || "Not provided"}
                    muted={!profile.bio}
                  />
                  <InfoRow
                    icon={<Briefcase size={18} weight="light" />}
                    label="Occupation"
                    value={profile.occupation || "Not provided"}
                    muted={!profile.occupation}
                  />
                  <InfoRow
                    icon={<MapPin size={18} weight="light" />}
                    label="City"
                    value={profile.city || "Not provided"}
                    muted={!profile.city}
                  />
                  <InfoRow
                    icon={<IdentificationBadge size={18} weight="light" />}
                    label="Gender"
                    value={
                      profile.gender
                        ? GENDER_LABELS[profile.gender] || profile.gender
                        : "Not provided"
                    }
                    muted={!profile.gender}
                  />
                  <InfoRow
                    icon={<Calendar size={18} weight="light" />}
                    label="Age"
                    value={profile.age ? `${profile.age} years` : "Not provided"}
                    muted={!profile.age}
                  />
                </div>
              </div>

              {/* Roommate Preferences */}
              {profile.roommatePreferences && (
                <>
                  <div className="border-t border-neutral-100" />
                  <div className="px-6 sm:px-8 py-6">
                    <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                      Roommate Preferences
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <PreferenceChip
                        label="Budget"
                        value={
                          profile.roommatePreferences.budget?.min ||
                          profile.roommatePreferences.budget?.max
                            ? `₹${profile.roommatePreferences.budget.min?.toLocaleString() || 0} – ₹${profile.roommatePreferences.budget.max?.toLocaleString() || 0}`
                            : "Not set"
                        }
                      />
                      <PreferenceChip
                        label="Food"
                        value={
                          FOOD_LABELS[
                            profile.roommatePreferences.foodHabits
                          ] || "Any"
                        }
                      />
                      <PreferenceChip
                        label="Smoking"
                        value={
                          profile.roommatePreferences.smokingPreference
                            ? "Yes"
                            : "No"
                        }
                      />
                      <PreferenceChip
                        label="Sleep"
                        value={
                          SLEEP_LABELS[
                            profile.roommatePreferences.sleepingSchedule
                          ] || "Flexible"
                        }
                      />
                    </div>
                    {profile.roommatePreferences.lifestyleDetails?.length >
                      0 && (
                      <div className="mt-4">
                        <p className="text-xs text-neutral-400 mb-2">
                          Lifestyle
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {profile.roommatePreferences.lifestyleDetails.map(
                            (item: string, i: number) => (
                              <span
                                key={i}
                                className="text-xs px-3 py-1.5 bg-neutral-50 border border-neutral-200/60 rounded-full text-neutral-600"
                              >
                                {item}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          {role === "OWNER" && profile && (
            <>
              <div className="border-t border-neutral-100" />
              <div className="px-6 sm:px-8 py-6">
                <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                  Business Information
                </h2>
                <div className="space-y-3">
                  <InfoRow
                    icon={<Buildings size={18} weight="light" />}
                    label="Business Name"
                    value={profile.businessName || "Not provided"}
                    muted={!profile.businessName}
                  />
                  <InfoRow
                    icon={<Briefcase size={18} weight="light" />}
                    label="Business Details"
                    value={profile.businessDetails || "Not provided"}
                    muted={!profile.businessDetails}
                  />
                </div>
              </div>
            </>
          )}

          {/* No profile set up yet */}
          {!profile && (
            <>
              <div className="border-t border-neutral-100" />
              <div className="px-6 sm:px-8 py-10 text-center">
                <p className="text-sm text-neutral-400 mb-4">
                  You haven&apos;t set up your {role.toLowerCase()} profile yet.
                </p>
                <Link href="/profile/edit">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <PencilSimple size={16} />
                    Set Up Profile
                  </motion.button>
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 p-3.5 bg-neutral-50/60 rounded-xl border border-neutral-100/80">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <span className="text-sm font-medium text-neutral-800 truncate">
        {value}
      </span>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  muted = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-neutral-400 mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
          {label}
        </p>
        <p
          className={`text-sm mt-0.5 wrap-break-word ${muted ? "text-neutral-400 italic" : "text-neutral-700"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function PreferenceChip({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-neutral-50/60 rounded-xl border border-neutral-100/80">
      <span className="text-xs text-neutral-400">{label}</span>
      <span className="text-sm font-medium text-neutral-700">{value}</span>
    </div>
  );
}
