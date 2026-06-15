"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  House,
  MapPin,
  CurrencyInr,
  Plus,
  Trash,
  Check,
  Info,
  Image as ImageIcon,
  FileText,
  UploadSimple,
} from "@phosphor-icons/react";
import { ListingForm, ListingImage } from "@/types/Ilisting.type";

const PRESET_AMENITIES = [
  "High-Speed Wi-Fi",
  "Air Conditioning",
  "Fully Furnished",
  "Attached Bathroom",
  "Kitchen Access",
  "Washing Machine",
  "Power Backup",
  "Gym Access",
  "Parking Space",
  "24/7 Security",
];

export default function CreateListingPage() {
  const [form, setForm] = useState<ListingForm>({
    title: "",
    description: "",
    city: "",
    rentBudget: "",
    propertyType: "",
    genderPreference: "Co-ed",
    amenities: [],
    imagesList: [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const selectPropertyType = (type: ListingForm["propertyType"]) => {
    setForm((prev) => ({ ...prev, propertyType: type }));
  };

  const selectGender = (gender: ListingForm["genderPreference"]) => {
    setForm((prev) => ({ ...prev, genderPreference: gender }));
  };

  const toggleAmenity = (amenity: string) => {
    setForm((prev) => {
      const alreadySelected = prev.amenities.includes(amenity);
      const updated = alreadySelected
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities: updated };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages: ListingImage[] = filesArray.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      setForm((prev) => ({
        ...prev,
        imagesList: [...prev.imagesList, ...newImages],
      }));
    }
  };

  const removeImage = (indexToRemove: number) => {
    const img = form.imagesList[indexToRemove];
    if (img && img.previewUrl) {
      URL.revokeObjectURL(img.previewUrl);
    }
    setForm((prev) => ({
      ...prev,
      imagesList: prev.imagesList.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToLog = {
      ...form,
      imagesList: form.imagesList.map((img) => ({
        name: img.file.name,
        size: img.file.size,
        type: img.file.type,
        previewUrl: img.previewUrl,
      })),
    };
    alert("Listing Data Submitted:\n" + JSON.stringify(dataToLog, null, 2));
    console.log(dataToLog);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white text-neutral-900">
      {/* LEFT PANEL - LIVE PREVIEW */}
      <div className="w-full lg:w-1/2 lg:h-screen lg:sticky lg:top-0 bg-[#F5F5F7] flex flex-col justify-center items-center p-6 md:p-12 border-b lg:border-b-0 lg:border-r border-neutral-200/50 overflow-hidden relative">
        <div className="flex flex-col items-start gap-4">
          {/* Live Preview Title Tag */}
          <div className="top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-sm text-xs font-medium text-black tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Real-Time Preview
          </div>

          {/* The Card container */}
          <motion.div
            layout
            className="w-full sm:w-[400px] bg-white rounded-[32px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-neutral-100/60 relative z-10 group"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
          >
            {/* Card Header Tag Row */}
            <div className="flex justify-between items-center w-full">
              {/* Category & Preference tag */}
              <span className="bg-[#222222] text-[#F3F4F6] px-3.5 py-1.5 rounded-full text-xs font-normal tracking-wide shadow-sm">
                {form.propertyType || "Apartment"} • {form.genderPreference}
              </span>

              {/* Combined Rent Price Pill (matches JAN 25 layout) */}
              <div className="flex items-center text-[10px] font-medium tracking-wider shadow-sm rounded-full overflow-hidden">
                <span className="bg-[#222222] text-white px-3 py-1.5 uppercase border border-r-0 border-[#222222] rounded-l-full">
                  Rent
                </span>
                <span className="bg-white text-[#222222] px-3 py-1.5 font-bold border border-[#E5E5E5] rounded-r-full">
                  {form.rentBudget ? `₹${Number(form.rentBudget).toLocaleString()}` : "₹0"}/mo
                </span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-[28px] font-normal tracking-tight text-[#222222] mt-5 line-clamp-1 min-h-[38px] leading-tight">
              {form.title || "Discovering peace"}
            </h3>

            {/* Description */}
            <p className="text-sm text-neutral-400 font-light leading-relaxed mt-2.5 mb-4 line-clamp-3 min-h-[72px] text-black break-words">
              {form.description ||
                "Far from the city's noise, the green mountains stretch endlessly into the horizon, blanketed with mist and silence."}
            </p>

            {/* Amenities Tag Row */}
            <div className="flex flex-wrap gap-1.5 mb-6 min-h-[26px]">
              {form.amenities.length > 0 ? (
                form.amenities.map((amenity, idx) => (
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
                {form.imagesList.length > 0 ? (
                  <motion.div
                    key={form.imagesList[form.imagesList.length - 1].previewUrl}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${form.imagesList[form.imagesList.length - 1].previewUrl})`,
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
                    {form.city || "Blue Ridge"}
                  </span>
                </div>
                <span className="text-xs text-white/80 font-light pl-5 drop-shadow-xs">
                  {form.city ? "Location Verified" : "Virginia, USA"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT PANEL - FORM CONTAINER */}
      <div className="w-full lg:w-1/2 min-h-screen overflow-y-auto bg-neutral-50 pt-20 md:pt-24 pb-16 px-6 md:px-12 lg:px-16 flex flex-col justify-start">
        <div className="max-w-xl w-full mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-neutral-900">
              List Your Property
            </h1>
            <p className="text-sm text-neutral-500 font-light mt-1.5 leading-relaxed">
              Provide the required specifications below to catalog your space in
              the Homely listings registry.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* SECTION 1: CORE SPECIFICATIONS */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200/60 shadow-xs space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                <div className="p-1.5 bg-neutral-50 rounded-lg text-neutral-700">
                  <House size={18} weight="light" />
                </div>
                <h2 className="text-sm font-medium text-neutral-950 uppercase tracking-wider">
                  Property Details
                </h2>
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="title"
                    className="text-xs font-semibold text-neutral-700 tracking-wide uppercase"
                  >
                    Listing Title
                  </label>
                  <span className="text-[10px] text-neutral-400">
                    {form.title.length}/200
                  </span>
                </div>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  maxLength={200}
                  value={form.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Minimalist Loft in Downtown Manhattan"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/10 transition-all"
                />
              </div>

              {/* Grid: Property Type & Rent */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Rent Budget */}
                <div className="space-y-2">
                  <label
                    htmlFor="rentBudget"
                    className="text-xs font-semibold text-neutral-700 tracking-wide uppercase"
                  >
                    Rent Price (Monthly)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">
                      <CurrencyInr size={16} />
                    </span>
                    <input
                      type="number"
                      id="rentBudget"
                      name="rentBudget"
                      required
                      min={0}
                      value={form.rentBudget}
                      onChange={handleInputChange}
                      placeholder="e.g. 1850"
                      className="w-full pl-9 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/10 transition-all"
                    />
                  </div>
                </div>

                {/* City */}
                <div className="space-y-2">
                  <label
                    htmlFor="city"
                    className="text-xs font-semibold text-neutral-700 tracking-wide uppercase"
                  >
                    City Location
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">
                      <MapPin size={16} />
                    </span>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={form.city}
                      onChange={handleInputChange}
                      placeholder="e.g. New York City"
                      className="w-full pl-9 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Property Type Radio Pills */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-700 tracking-wide uppercase block">
                  Property Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {(
                    ["PG", "Hostel", "Flat", "Apartment", "House"] as const
                  ).map((type) => {
                    const isSelected = form.propertyType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => selectPropertyType(type)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-neutral-900 border-neutral-900 text-white shadow-xs"
                            : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100 hover:border-neutral-300"
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            

            {/* SECTION 3: PREFERENCES & DESCRIPTION */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200/60 shadow-xs space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                <div className="p-1.5 bg-neutral-50 rounded-lg text-neutral-700">
                  <FileText size={18} weight="light" />
                </div>
                <h2 className="text-sm font-medium text-neutral-950 uppercase tracking-wider">
                  Preferences & Description
                </h2>
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="description"
                    className="text-xs font-semibold text-neutral-700 tracking-wide uppercase"
                  >
                    Description
                  </label>
                  <span className="text-[10px] text-neutral-400">
                    {form.description.length}/2000
                  </span>
                </div>
                <textarea
                  id="description"
                  name="description"
                  required
                  maxLength={2000}
                  rows={4}
                  value={form.description}
                  onChange={handleInputChange}
                  placeholder="Share details about the property setup, nearby spots, lease period, house rules, roommates vibe..."
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/10 transition-all resize-none"
                />
              </div>

              {/* Gender Preference Radio Pills */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-700 tracking-wide uppercase block">
                  Gender Preference
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(["Male", "Female", "Co-ed"] as const).map((gender) => {
                    const isSelected = form.genderPreference === gender;
                    return (
                      <button
                        key={gender}
                        type="button"
                        onClick={() => selectGender(gender)}
                        className={`py-3 px-4 rounded-xl border text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? "bg-neutral-900 border-neutral-900 text-white shadow-xs"
                            : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100 hover:border-neutral-300"
                        }`}
                      >
                        {isSelected && <Check size={14} weight="bold" />}
                        {gender}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SECTION 4: FEATURES & AMENITIES */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200/60 shadow-xs space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                <div className="p-1.5 bg-neutral-50 rounded-lg text-neutral-700">
                  <Plus size={18} weight="light" />
                </div>
                <h2 className="text-sm font-medium text-neutral-950 uppercase tracking-wider">
                  Features & Amenities
                </h2>
              </div>

              {/* Amenity Pills */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-700 tracking-wide uppercase block">
                  Select Available Amenities
                </label>
                <div className="flex flex-wrap gap-2.5 pt-1">
                  {PRESET_AMENITIES.map((amenity) => {
                    const isSelected = form.amenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-medium"
                            : "bg-neutral-50 border-neutral-200 text-neutral-500 hover:bg-neutral-100 hover:border-neutral-300"
                        }`}
                      >
                        {isSelected ? (
                          <Check size={12} weight="bold" />
                        ) : (
                          <Plus size={12} />
                        )}
                        {amenity}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SECTION 5: GALLERY & IMAGES */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200/60 shadow-xs space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                <div className="p-1.5 bg-neutral-50 rounded-lg text-neutral-700">
                  <ImageIcon size={18} weight="light" />
                </div>
                <h2 className="text-sm font-medium text-neutral-950 uppercase tracking-wider">
                  Property Photos
                </h2>
              </div>

              {/* Upload Zone */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-neutral-700 tracking-wide uppercase block">
                  Upload Images from Device
                </label>

                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 hover:border-indigo-400 hover:bg-indigo-50/10 rounded-2xl p-8 transition-all cursor-pointer group text-center"
                >
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="p-3 bg-neutral-50 group-hover:bg-indigo-50 rounded-xl transition-colors text-neutral-600 group-hover:text-indigo-600 mb-3">
                    <UploadSimple size={24} />
                  </div>
                  <span className="text-sm font-medium text-neutral-900 group-hover:text-indigo-600 transition-colors">
                    Click to upload images
                  </span>
                  <span className="text-xs text-neutral-400 font-light mt-1">
                    Supports PNG, JPG, JPEG (Max 5MB per file)
                  </span>
                </label>
              </div>

              {/* Current List of Images */}
              {form.imagesList.length > 0 && (
                <div className="space-y-2.5 pt-2">
                  <label className="text-xs font-semibold text-neutral-700 tracking-wide uppercase block">
                    Upload Queue ({form.imagesList.length} Image
                    {form.imagesList.length > 1 ? "s" : ""})
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {form.imagesList.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative h-20 rounded-xl border border-neutral-200 overflow-hidden group"
                      >
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${img.previewUrl})` }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1.5 right-1.5 bg-neutral-900/90 text-white hover:bg-red-600 rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 shadow-xs cursor-pointer flex items-center justify-center"
                        >
                          <Trash size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ACTION SUBMIT BUTTON */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-4 bg-neutral-950 text-white hover:bg-neutral-900 rounded-2xl font-medium text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              List Property
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}
