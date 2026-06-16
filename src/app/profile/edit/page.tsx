"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeftIcon,
  CameraIcon,
  SpinnerIcon,
  XIcon,
  FloppyDiskIcon,
  CloudArrowUpIcon,
} from "@phosphor-icons/react";
import { useGetProfile } from "@/features/profile/hooks/useGetProfile";
import { useUpdateProfile } from "@/features/profile/hooks/useUpdateProfile";
import { useAppSelector } from "@/redux/store";

/* ─── Zod Validation Schemas ─── */

const baseSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters"),
  phone: z
    .string()
    .regex(
      /^\+?[1-9]\d{1,14}$/,
      "Please enter a valid phone number (E.164 format)",
    )
    .or(z.literal(""))
    .optional(),
});

const tenantSchema = baseSchema.extend({
  bio: z
    .string()
    .max(500, "Bio cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
  occupation: z
    .string()
    .max(100, "Occupation is too long")
    .optional()
    .or(z.literal("")),
  city: z.string().min(1, "City is required"),
  gender: z.enum(
    ["MALE", "FEMALE", "NON_BINARY", "OTHER", "PREFER_NOT_TO_SAY"],
    {
      error: "Gender is required",
    },
  ),
  age: z
    .number({ error: "Age is required and must be a number" })
    .min(18, "Must be at least 18")
    .max(120, "Please provide a valid age"),
  // Roommate Preferences
  budgetMin: z.number().min(0, "Cannot be negative").optional().or(z.nan()),
  budgetMax: z.number().min(0, "Cannot be negative").optional().or(z.nan()),
  foodHabits: z
    .enum(["VEGETARIAN", "NON_VEGETARIAN", "VEGAN", "ANY"])
    .optional(),
  smokingPreference: z.boolean().optional(),
  sleepingSchedule: z.enum(["EARLY_BIRD", "NIGHT_OWL", "FLEXIBLE"]).optional(),
  lifestyleDetails: z.string().optional().or(z.literal("")),
});

const ownerSchema = baseSchema.extend({
  businessName: z
    .string()
    .min(1, "Business name is required")
    .max(150, "Business name cannot exceed 150 characters"),
  businessDetails: z
    .string()
    .max(1000, "Business details cannot exceed 1000 characters")
    .optional()
    .or(z.literal("")),
});

type TenantFormData = z.infer<typeof tenantSchema>;
type OwnerFormData = z.infer<typeof ownerSchema>;
type FormData = z.infer<typeof baseSchema> &
  Partial<TenantFormData> &
  Partial<OwnerFormData>;

/* ─── Constants ─── */

const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "NON_BINARY", label: "Non-Binary" },
  { value: "OTHER", label: "Other" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
];

const FOOD_OPTIONS = [
  { value: "VEGETARIAN", label: "Vegetarian" },
  { value: "NON_VEGETARIAN", label: "Non-Vegetarian" },
  { value: "VEGAN", label: "Vegan" },
  { value: "ANY", label: "Any" },
];

const SLEEP_OPTIONS = [
  { value: "EARLY_BIRD", label: "Early Bird" },
  { value: "NIGHT_OWL", label: "Night Owl" },
  { value: "FLEXIBLE", label: "Flexible" },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/* ─── Component ─── */

export default function ProfileEditPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, user: authUser } = useAppSelector(
    (state) => state.auth,
  );
  const { data: profileData, isLoading: isProfileLoading } = useGetProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  const role = authUser?.role as "TENANT" | "OWNER" | undefined;

  // Profile picture state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Choose schema based on role
  const schema = role === "OWNER" ? ownerSchema : tenantSchema;

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  // Populate form when profile data loads
  useEffect(() => {
    if (!profileData?.data) return;

    const { user, profile } = profileData.data;

    const baseDefaults = {
      name: user.name || "",
      phone: user.phone || "",
    };

    if (role === "TENANT") {
      reset({
        ...baseDefaults,
        bio: profile?.bio || "",
        occupation: profile?.occupation || "",
        city: profile?.city || "",
        gender: profile?.gender || undefined,
        age: profile?.age || undefined,
        budgetMin: profile?.roommatePreferences?.budget?.min || 0,
        budgetMax: profile?.roommatePreferences?.budget?.max || 0,
        foodHabits: profile?.roommatePreferences?.foodHabits || "ANY",
        smokingPreference:
          profile?.roommatePreferences?.smokingPreference || false,
        sleepingSchedule:
          profile?.roommatePreferences?.sleepingSchedule || "FLEXIBLE",
        lifestyleDetails:
          profile?.roommatePreferences?.lifestyleDetails?.join(", ") || "",
      } as TenantFormData);
    } else if (role === "OWNER") {
      reset({
        ...baseDefaults,
        businessName: profile?.businessName || "",
        businessDetails: profile?.businessDetails || "",
      } as OwnerFormData);
    }

    // Set existing profile picture preview
    const existingPicture = profile?.profilePicture;
    let timer: NodeJS.Timeout;
    if (existingPicture && !existingPicture.includes("man-user-circle-icon")) {
      timer = setTimeout(() => setPreviewUrl(existingPicture), 0);
    }

    return () => clearTimeout(timer);
  }, [profileData, role, reset]);

  // File handling
  const handleFileSelect = useCallback((file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      import("react-hot-toast").then(({ default: toast }) =>
        toast.error("File size must be under 5MB"),
      );
      return;
    }
    if (!file.type.startsWith("image/")) {
      import("react-hot-toast").then(({ default: toast }) =>
        toast.error("Please select an image file"),
      );
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  // Form submission
  const onSubmit = (data: FormData) => {
    const formData = new window.FormData();

    // Core user fields
    formData.append("name", data.name);
    if (data.phone) formData.append("phone", data.phone);

    // Role-specific fields
    if (role === "TENANT") {
      const tenantData = data as TenantFormData;
      if (tenantData.bio) formData.append("bio", tenantData.bio);
      if (tenantData.occupation)
        formData.append("occupation", tenantData.occupation);
      formData.append("city", tenantData.city);
      formData.append("gender", tenantData.gender);
      formData.append("age", String(tenantData.age));

      // Build roommate preferences as JSON string
      const roommatePreferences = {
        budget: {
          min: tenantData.budgetMin || 0,
          max: tenantData.budgetMax || 0,
        },
        foodHabits: tenantData.foodHabits || "ANY",
        smokingPreference: tenantData.smokingPreference || false,
        sleepingSchedule: tenantData.sleepingSchedule || "FLEXIBLE",
        lifestyleDetails: tenantData.lifestyleDetails
          ? tenantData.lifestyleDetails
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      };
      formData.append(
        "roommatePreferences",
        JSON.stringify(roommatePreferences),
      );
    } else if (role === "OWNER") {
      const ownerData = data as OwnerFormData;
      formData.append("businessName", ownerData.businessName);
      if (ownerData.businessDetails)
        formData.append("businessDetails", ownerData.businessDetails);
    }

    // Profile picture file
    if (selectedFile) {
      formData.append("profilePicture", selectedFile);
    }

    updateProfile(formData, {
      onSuccess: () => {
        router.push("/profile");
      },
    });
  };

  // Redirect if not authenticated
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <SpinnerIcon size={32} className="text-neutral-400 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !role) return null;

  if (isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <SpinnerIcon size={32} className="text-neutral-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-4 group"
          >
            <ArrowLeftIcon
              size={16}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            Back
          </button>
          <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900">
            Edit Profile
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Update your personal information and preferences
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-3xl border border-neutral-200/60 shadow-[0_2px_20px_rgba(0,0,0,0.04)] overflow-hidden"
        >
          {/* ── Profile Picture Section ── */}
          <div className="px-6 sm:px-8 pt-8 pb-6">
            <SectionTitle>Profile Picture</SectionTitle>
            <div className="flex items-start gap-6 mt-4">
              {/* Current/Preview Avatar */}
              <div className="relative shrink-0 group">
                {previewUrl ? (
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-neutral-200/60 shadow-sm">
                    <Image
                      src={previewUrl}
                      alt="Profile preview"
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-neutral-100 flex items-center justify-center border-2 border-neutral-200/60">
                    <CameraIcon size={24} className="text-neutral-400" />
                  </div>
                )}
                {previewUrl && (
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <XIcon size={12} weight="bold" />
                  </button>
                )}
              </div>

              {/* Upload Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`flex-1 border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-all duration-200 ${
                  isDragOver
                    ? "border-neutral-900 bg-neutral-50"
                    : "border-neutral-200/80 hover:border-neutral-300 hover:bg-neutral-50/50"
                }`}
              >
                <CloudArrowUpIcon
                  size={28}
                  weight="light"
                  className={`mx-auto mb-2 transition-colors ${isDragOver ? "text-neutral-900" : "text-neutral-400"}`}
                />
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-900">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  PNG, JPG, WebP up to 5MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-100" />

          {/* ── Personal Information ── */}
          <div className="px-6 sm:px-8 py-6">
            <SectionTitle>Personal Information</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <FormField
                label="Full Name"
                required
                error={errors.name?.message}
              >
                <input
                  {...register("name")}
                  placeholder="Your full name"
                  className={inputClass(errors.name)}
                />
              </FormField>

              <FormField label="Phone" error={errors.phone?.message}>
                <input
                  {...register("phone")}
                  placeholder="+91XXXXXXXXXX"
                  className={inputClass(errors.phone)}
                />
              </FormField>
            </div>
          </div>

          {/* ── Tenant-Specific Fields ── */}
          {role === "TENANT" && (
            <>
              <div className="border-t border-neutral-100" />
              <div className="px-6 sm:px-8 py-6">
                <SectionTitle>Tenant Details</SectionTitle>
                <div className="grid grid-cols-1 gap-4 mt-4">
                  <FormField label="Bio" error={errors.bio?.message}>
                    <textarea
                      {...register("bio")}
                      rows={3}
                      placeholder="Tell others about yourself..."
                      className={`${inputClass(errors.bio)} resize-none`}
                    />
                  </FormField>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      label="Occupation"
                      error={errors.occupation?.message}
                    >
                      <input
                        {...register("occupation")}
                        placeholder="e.g. Software Engineer"
                        className={inputClass(errors.occupation)}
                      />
                    </FormField>

                    <FormField
                      label="City"
                      required
                      error={errors.city?.message}
                    >
                      <input
                        {...register("city")}
                        placeholder="e.g. Mumbai"
                        className={inputClass(errors.city)}
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      label="Gender"
                      required
                      error={errors.gender?.message}
                    >
                      <Controller
                        name={"gender"}
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            className={selectClass(errors.gender)}
                          >
                            <option value="">Select gender</option>
                            {GENDER_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        )}
                      />
                    </FormField>

                    <FormField label="Age" required error={errors.age?.message}>
                      <Controller
                        name={"age"}
                        control={control}
                        render={({ field }) => (
                          <input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              )
                            }
                            placeholder="e.g. 25"
                            className={inputClass(errors.age)}
                          />
                        )}
                      />
                    </FormField>
                  </div>
                </div>
              </div>

              {/* ── Roommate Preferences ── */}
              <div className="border-t border-neutral-100" />
              <div className="px-6 sm:px-8 py-6">
                <SectionTitle>Roommate Preferences</SectionTitle>
                <div className="grid grid-cols-1 gap-4 mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      label="Min Budget (₹)"
                      error={errors.budgetMin?.message}
                    >
                      <Controller
                        name={"budgetMin"}
                        control={control}
                        render={({ field }) => (
                          <input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? Number(e.target.value) : 0,
                              )
                            }
                            placeholder="e.g. 5000"
                            className={inputClass(errors.budgetMin)}
                          />
                        )}
                      />
                    </FormField>

                    <FormField
                      label="Max Budget (₹)"
                      error={errors.budgetMax?.message}
                    >
                      <Controller
                        name={"budgetMax"}
                        control={control}
                        render={({ field }) => (
                          <input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? Number(e.target.value) : 0,
                              )
                            }
                            placeholder="e.g. 15000"
                            className={inputClass(errors.budgetMax)}
                          />
                        )}
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      label="Food Habits"
                      error={errors.foodHabits?.message}
                    >
                      <Controller
                        name={"foodHabits"}
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            className={selectClass(errors.foodHabits)}
                          >
                            {FOOD_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        )}
                      />
                    </FormField>

                    <FormField
                      label="Sleep Schedule"
                      error={errors.sleepingSchedule?.message}
                    >
                      <Controller
                        name={"sleepingSchedule"}
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            className={selectClass(errors.sleepingSchedule)}
                          >
                            {SLEEP_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        )}
                      />
                    </FormField>
                  </div>

                  <FormField label="Smoking Preference">
                    <Controller
                      name={"smokingPreference"}
                      control={control}
                      render={({ field }) => (
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={field.value as boolean}
                              onChange={(e) => field.onChange(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-10 h-5.5 bg-neutral-200 rounded-full peer-checked:bg-neutral-900 transition-colors duration-200" />
                            <div className="absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm peer-checked:translate-x-[18px] transition-transform duration-200" />
                          </div>
                          <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
                            {field.value
                              ? "Smoker-friendly"
                              : "Non-smoker preferred"}
                          </span>
                        </label>
                      )}
                    />
                  </FormField>

                  <FormField
                    label="Lifestyle Details"
                    error={errors.lifestyleDetails?.message}
                  >
                    <input
                      {...register("lifestyleDetails")}
                      placeholder="e.g. Gym, Reading, Gaming (comma separated)"
                      className={inputClass(errors.lifestyleDetails)}
                    />
                    <p className="text-[11px] text-neutral-400 mt-1.5">
                      Separate multiple lifestyle interests with commas
                    </p>
                  </FormField>
                </div>
              </div>
            </>
          )}

          {/* ── Owner-Specific Fields ── */}
          {role === "OWNER" && (
            <>
              <div className="border-t border-neutral-100" />
              <div className="px-6 sm:px-8 py-6">
                <SectionTitle>Business Information</SectionTitle>
                <div className="grid grid-cols-1 gap-4 mt-4">
                  <FormField
                    label="Business Name"
                    required
                    error={errors.businessName?.message}
                  >
                    <input
                      {...register("businessName")}
                      placeholder="Your business or company name"
                      className={inputClass(errors.businessName)}
                    />
                  </FormField>

                  <FormField
                    label="Business Details"
                    error={errors.businessDetails?.message}
                  >
                    <textarea
                      {...register("businessDetails")}
                      rows={4}
                      placeholder="Describe your business, services offered, etc."
                      className={`${inputClass(errors.businessDetails)} resize-none`}
                    />
                  </FormField>
                </div>
              </div>
            </>
          )}

          {/* ── Submit Bar ── */}
          <div className="border-t border-neutral-100" />
          <div className="px-6 sm:px-8 py-5 bg-neutral-50/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-400">
              {isDirty || selectedFile
                ? "You have unsaved changes"
                : "No changes made"}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-5 py-2.5 text-sm text-neutral-600 hover:text-neutral-900 rounded-xl border border-neutral-200 hover:border-neutral-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                disabled={isUpdating}
                whileHover={{ scale: isUpdating ? 1 : 1.02 }}
                whileTap={{ scale: isUpdating ? 1 : 0.98 }}
                className="flex items-center gap-2 bg-neutral-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-neutral-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {isUpdating ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                    >
                      <SpinnerIcon size={16} />
                    </motion.span>
                    Saving...
                  </>
                ) : (
                  <>
                    <FloppyDiskIcon size={16} />
                    Save Changes
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

/* ─── Reusable Sub-components ─── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
      {children}
    </h2>
  );
}

function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs text-red-500 mt-1.5"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Styling Helpers ─── */

function inputClass(error?: { message?: string }) {
  return `w-full px-4 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all duration-200 placeholder:text-neutral-400 ${
    error
      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-neutral-200 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 hover:border-neutral-300"
  }`;
}

function selectClass(error?: { message?: string }) {
  return `w-full px-4 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all duration-200 appearance-none cursor-pointer ${
    error
      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-neutral-200 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 hover:border-neutral-300"
  }`;
}
