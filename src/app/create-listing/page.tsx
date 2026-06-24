"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ListingForm as ListingFormType, ListingImage } from "@/types/Ilisting.type";
import ListingCard from "@/features/listing/components/ListingCard";
import ListingForm from "@/features/listing/components/ListingForm";
import { useListing } from "@/features/listing/hooks/useListing";
import { createListingAction } from "@/features/listing/slice/listing.slice";
import { useAppSelector } from "@/redux/store";

export default function CreateListingPage() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const { createListing, isLoading } = useListing();

  // Defense-in-depth: redirect non-OWNER users
  useEffect(() => {
    if (user && user.role !== "OWNER") {
      toast.error("Only property owners can list properties.");
      router.push("/dashboard/tenant");
    }
  }, [user, router]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.propertyType) {
      toast.error("Please select a property category");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("city", form.city);
    formData.append("rentBudget", form.rentBudget);
    formData.append("propertyType", form.propertyType);
    formData.append("genderPreference", form.genderPreference);
    // Mock coordinates as Delhi standard default coordinates
    formData.append("location", JSON.stringify({ type: "Point", coordinates: [77.209, 28.613] }));
    formData.append("amenities", JSON.stringify(form.amenities));

    form.imagesList.forEach((img) => {
      if (img.file) {
        formData.append("images", img.file);
      }
    });

    try {
      const resultAction = await createListing(formData);
      if (createListingAction.fulfilled.match(resultAction)) {
        toast.success("Listing created successfully!");
        router.push("/listings");
      } else {
        const message = resultAction.payload as string || "Failed to list property";
        toast.error(message);
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    }
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
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
