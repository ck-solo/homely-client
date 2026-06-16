"use client";

import React, { useState } from "react";
import { ListingForm as ListingFormType, ListingImage } from "@/types/Ilisting.type";
import ListingCard from "@/features/listing/components/ListingCard";
import ListingForm from "@/features/listing/components/ListingForm";

export default function CreateListingPage() {
  const [form, setForm] = useState<ListingFormType>({
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

  const selectPropertyType = (type: ListingFormType["propertyType"]) => {
    setForm((prev) => ({ ...prev, propertyType: type }));
  };

  const selectGender = (gender: ListingFormType["genderPreference"]) => {
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

          <ListingCard
            propertyType={form.propertyType}
            genderPreference={form.genderPreference}
            rentBudget={form.rentBudget}
            title={form.title}
            description={form.description}
            amenities={form.amenities}
            images={form.imagesList}
            city={form.city}
          />
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

          <ListingForm
            form={form}
            onChange={handleInputChange}
            onPropertyTypeSelect={selectPropertyType}
            onGenderSelect={selectGender}
            onToggleAmenity={toggleAmenity}
            onImageChange={handleImageChange}
            onRemoveImage={removeImage}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
