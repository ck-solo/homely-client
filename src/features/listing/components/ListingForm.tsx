"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  HouseIcon,
  MapPinIcon,
  CurrencyInrIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
  ImageIcon,
  FileTextIcon,
  UploadSimpleIcon,
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
  isLoading?: boolean;
  isEdit?: boolean;
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
  isLoading = false,
  isEdit = false,
}: ListingFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* SECTION 1: CORE SPECIFICATIONS */}
      <div className="bg-luxury-card rounded-2xl p-6 border border-luxury-border shadow-2xl space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-luxury-border">
          <div className="p-1.5 bg-luxury-bg rounded-lg text-luxury-gold">
            <HouseIcon size={18} weight="light" />
          </div>
          <h2 className="text-sm font-medium text-luxury-text-beige uppercase tracking-wider">
            Property Details
          </h2>
        </div>

        {/* Title Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label
              htmlFor="title"
              className="text-xs font-semibold text-luxury-text-muted tracking-wide uppercase"
            >
              Listing Title
            </label>
            <span className="text-[10px] text-luxury-text-muted">
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
            className="w-full px-4 py-3 bg-luxury-bg border border-luxury-border rounded-xl text-sm text-luxury-text-beige placeholder:text-luxury-text-muted/50 focus:outline-hidden focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/50 transition-all"
          />
        </div>

        {/* Grid: Property Type & Rent */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rent Budget */}
          <div className="space-y-2">
            <label
              htmlFor="rentBudget"
              className="text-xs font-semibold text-luxury-text-muted tracking-wide uppercase"
            >
              Rent Price (Monthly)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxury-text-muted text-sm">
                <CurrencyInrIcon size={16} />
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
                className="w-full pl-9 pr-4 py-3 bg-luxury-bg border border-luxury-border rounded-xl text-sm text-luxury-text-beige placeholder:text-luxury-text-muted/50 focus:outline-hidden focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/50 transition-all"
              />
            </div>
          </div>

          {/* City */}
          <div className="space-y-2">
            <label
              htmlFor="city"
              className="text-xs font-semibold text-luxury-text-muted tracking-wide uppercase"
            >
              City Location
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxury-text-muted text-sm">
                <MapPinIcon size={16} />
              </span>
              <input
                type="text"
                id="city"
                name="city"
                required
                value={form.city}
                onChange={onChange}
                placeholder="e.g. New York City"
                className="w-full pl-9 pr-4 py-3 bg-luxury-bg border border-luxury-border rounded-xl text-sm text-luxury-text-beige placeholder:text-luxury-text-muted/50 focus:outline-hidden focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/50 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Property Type Radio Pills */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-luxury-text-muted tracking-wide uppercase block">
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
                      ? "bg-luxury-gold border-luxury-gold text-luxury-bg shadow-xs"
                      : "bg-luxury-bg border-luxury-border text-luxury-text-muted hover:border-luxury-gold/50 hover:text-luxury-text-beige luxury-hover-glow"
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
      <div className="bg-luxury-card rounded-2xl p-6 border border-luxury-border shadow-2xl space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-luxury-border">
          <div className="p-1.5 bg-luxury-bg rounded-lg text-luxury-gold">
            <FileTextIcon size={18} weight="light" />
          </div>
          <h2 className="text-sm font-medium text-luxury-text-beige uppercase tracking-wider">
            Preferences & Description
          </h2>
        </div>

        {/* Description Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label
              htmlFor="description"
              className="text-xs font-semibold text-luxury-text-muted tracking-wide uppercase"
            >
              Description
            </label>
            <span className="text-[10px] text-luxury-text-muted">
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
            className="w-full px-4 py-3 bg-luxury-bg border border-luxury-border rounded-xl text-sm text-luxury-text-beige placeholder:text-luxury-text-muted/50 focus:outline-hidden focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/50 transition-all resize-none"
          />
        </div>

        {/* Gender Preference Radio Pills */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-luxury-text-muted tracking-wide uppercase block">
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
                      ? "bg-luxury-gold border-luxury-gold text-luxury-bg shadow-xs"
                      : "bg-luxury-bg border-luxury-border text-luxury-text-muted hover:border-luxury-gold/50 hover:text-luxury-text-beige luxury-hover-glow"
                  }`}
                >
                  {isSelected && <CheckIcon size={14} weight="bold" />}
                  {gender}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 4: FEATURES & AMENITIES */}
      <div className="bg-luxury-card rounded-2xl p-6 border border-luxury-border shadow-2xl space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-luxury-border">
          <div className="p-1.5 bg-luxury-bg rounded-lg text-luxury-gold">
            <PlusIcon size={18} weight="light" />
          </div>
          <h2 className="text-sm font-medium text-luxury-text-beige uppercase tracking-wider">
            Features & Amenities
          </h2>
        </div>

        {/* Amenity Pills */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-luxury-text-muted tracking-wide uppercase block">
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
                      ? "bg-luxury-gold border-luxury-gold text-luxury-bg font-medium"
                      : "bg-luxury-bg border-luxury-border text-luxury-text-muted hover:border-luxury-gold/50 hover:text-luxury-text-beige luxury-hover-glow"
                  }`}
                >
                  {isSelected ? (
                    <CheckIcon size={12} weight="bold" />
                  ) : (
                    <PlusIcon size={12} />
                  )}
                  {amenity}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 5: GALLERY & IMAGES */}
      <div className="bg-luxury-card rounded-2xl p-6 border border-luxury-border shadow-2xl space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-luxury-border">
          <div className="p-1.5 bg-luxury-bg rounded-lg text-luxury-gold">
            <ImageIcon size={18} weight="light" />
          </div>
          <h2 className="text-sm font-medium text-luxury-text-beige uppercase tracking-wider">
            Property Photos
          </h2>
        </div>

        {/* Upload Zone */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-luxury-text-muted tracking-wide uppercase block">
            Upload Images from Device
          </label>

          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center border-2 border-dashed border-luxury-border hover:border-luxury-gold hover:bg-luxury-gold/10 rounded-2xl p-8 transition-all cursor-pointer group text-center"
          >
            <input
              type="file"
              id="file-upload"
              multiple
              accept="image/*"
              onChange={onImageChange}
              className="hidden"
            />
            <div className="p-3 bg-luxury-bg group-hover:bg-luxury-gold/20 rounded-xl transition-colors text-luxury-text-muted group-hover:text-luxury-gold mb-3">
              <UploadSimpleIcon size={24} />
            </div>
            <span className="text-sm font-medium text-luxury-text-beige group-hover:text-luxury-gold transition-colors">
              Click to upload images
            </span>
            <span className="text-xs text-luxury-text-muted font-light mt-1">
              Supports PNG, JPG, JPEG (Max 5MB per file)
            </span>
          </label>
        </div>

        {/* Current List of Images */}
        {form.imagesList && form.imagesList.length > 0 && (
          <div className="space-y-2.5 pt-2">
            <label className="text-xs font-semibold text-luxury-text-muted tracking-wide uppercase block">
              Upload Queue ({form.imagesList.length} Image
              {form.imagesList.length > 1 ? "s" : ""})
            </label>
            <div className="grid grid-cols-2 gap-3">
              {form.imagesList.map((img, idx) => (
                <div
                  key={idx}
                  className="relative h-20 rounded-xl border border-luxury-border overflow-hidden group"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${img.previewUrl})` }}
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveImage(idx)}
                    className="absolute top-1.5 right-1.5 bg-luxury-card/90 text-luxury-text-beige hover:bg-red-900/80 hover:text-red-400 rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity border border-luxury-border shadow-xs cursor-pointer flex items-center justify-center"
                  >
                    <TrashIcon size={12} />
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
        disabled={isLoading}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full py-4 bg-luxury-gold text-luxury-bg hover:bg-luxury-gold-light rounded-2xl font-medium text-sm transition-all shadow-[0_0_20px_rgba(201,164,92,0.3)] hover:shadow-[0_0_30px_rgba(201,164,92,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading
          ? (isEdit ? "Updating Listing..." : "Listing Property...")
          : (isEdit ? "Update listing" : "List Property")}
      </motion.button>
    </form>
  );
}
