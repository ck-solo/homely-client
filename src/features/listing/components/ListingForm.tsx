"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  House,
  MapPin,
  CurrencyInr,
  Plus,
  Trash,
  Check,
  Image as ImageIcon,
  FileText,
  UploadSimple,
} from "@phosphor-icons/react";

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

import { ListingForm as IListingForm } from "@/types/Ilisting.type";

interface ListingFormProps {
  form: IListingForm;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onPropertyTypeSelect: (type: IListingForm["propertyType"]) => void;
  onGenderSelect: (gender: IListingForm["genderPreference"]) => void;
  onToggleAmenity: (amenity: string) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function ListingForm({
  form,
  onChange,
  onPropertyTypeSelect,
  onGenderSelect,
  onToggleAmenity,
  onImageChange,
  onRemoveImage,
  onSubmit,
}: ListingFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
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
            onChange={onChange}
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
                onChange={onChange}
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
                onChange={onChange}
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
            {["PG", "Hostel", "Flat", "Apartment", "House"].map((type) => {
              const isSelected = form.propertyType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => onPropertyTypeSelect(type as IListingForm["propertyType"])}
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
            onChange={onChange}
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
            {["Male", "Female", "Co-ed"].map((gender) => {
              const isSelected = form.genderPreference === gender;
              return (
                <button
                  key={gender}
                  type="button"
                  onClick={() => onGenderSelect(gender as IListingForm["genderPreference"])}
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
                  onClick={() => onToggleAmenity(amenity)}
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
              onChange={onImageChange}
              className="hidden"
            />
            <div className="p-3 bg-neutral-50 group-hover:bg-indigo-50 rounded-xl transition-colors text-neutral-600 group-hover:text-indigo-600 mb-3">
              <UploadSimple size={24} />
            </div>
            <span className="text-sm font-medium text-neutral-950 group-hover:text-indigo-600 transition-colors">
              Click to upload images
            </span>
            <span className="text-xs text-neutral-400 font-light mt-1">
              Supports PNG, JPG, JPEG (Max 5MB per file)
            </span>
          </label>
        </div>

        {/* Current List of Images */}
        {form.imagesList && form.imagesList.length > 0 && (
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
                    onClick={() => onRemoveImage(idx)}
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
  );
}
