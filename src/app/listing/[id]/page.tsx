"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPinIcon, 
  HeartIcon, 
  ArrowLeftIcon,
  CheckCircleIcon,
  UserCircleIcon,
  ShareNetworkIcon
} from "@phosphor-icons/react";
import Image from "next/image";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { useFavorites } from "@/features/favorite/hooks/useFavorites";
import { useAppSelector } from "@/redux/store";
import { Listing } from "@/features/listing/components/ListingCard";

export default function ListingDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { user } = useAppSelector((state) => state.auth);
  const { isFavorited, toggle, isToggling, isTenant } = useFavorites();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    async function fetchListing() {
      try {
        setLoading(true);
        const { data } = await api.get(`/listings/${id}`);
        if (data.success) {
          setListing(data.data);
          setActiveImage(data.data.images?.[0] || "");
        }
      } catch (error) {
        toast.error("Failed to load listing details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchListing();
    }
  }, [id]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!listing?._id) return;
    if (!isTenant) {
      toast.error("Only tenants can save listings.");
      return;
    }
    await toggle(listing._id);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-luxury-bg pt-28 pb-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin"></div>
          <p className="text-luxury-text-muted font-instrument text-xl">Preparing your view...</p>
        </div>
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="min-h-screen bg-luxury-bg pt-28 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-instrument text-luxury-text-beige mb-4">Listing Not Found</h1>
          <button onClick={() => router.push("/listings")} className="text-luxury-gold hover:text-luxury-gold-light underline">
            Return to properties
          </button>
        </div>
      </main>
    );
  }

  const isCurrentlyFavorited = isFavorited(listing._id);
  const formattedRent = listing.rentBudget 
    ? `₹${Number(listing.rentBudget).toLocaleString("en-IN")}`
    : "Price on request";

  return (
    <main className="min-h-screen bg-luxury-bg text-luxury-text-beige pt-24 pb-24">
      {/* ─── Hero Image Gallery ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-luxury-text-muted hover:text-luxury-gold transition-colors mb-6 font-medium text-sm"
        >
          <ArrowLeftIcon size={16} /> Back to Search
        </button>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[50vh] min-h-[400px]">
          <div className="md:col-span-3 relative rounded-3xl overflow-hidden border border-luxury-border group bg-luxury-card">
            {activeImage ? (
              <Image 
                src={activeImage} 
                alt={listing.title} 
                fill 
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-luxury-card flex items-center justify-center">
                <span className="text-luxury-text-muted">No Image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-luxury-bg/80 via-transparent to-transparent opacity-80" />
            
            {/* Action Overlay */}
            <div className="absolute top-6 right-6 flex gap-3">
              <button className="p-3 rounded-full bg-luxury-card/80 backdrop-blur-md border border-luxury-border text-luxury-text-beige hover:text-luxury-gold transition-all luxury-hover-glow shadow-lg">
                <ShareNetworkIcon size={20} />
              </button>
              {isTenant && (
                <button 
                  onClick={handleToggleFavorite}
                  disabled={isToggling === listing._id}
                  className={`p-3 rounded-full backdrop-blur-md border transition-all shadow-lg ${
                    isCurrentlyFavorited 
                      ? "bg-red-900/40 border-red-500/30 text-red-400" 
                      : "bg-luxury-card/80 border-luxury-border text-luxury-text-beige hover:text-red-400"
                  }`}
                >
                  <HeartIcon size={20} weight={isCurrentlyFavorited ? "fill" : "regular"} />
                </button>
              )}
            </div>
          </div>
          
          <div className="hidden md:flex flex-col gap-4 overflow-y-auto no-scrollbar pb-2">
            {listing.images?.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`relative w-full aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                  activeImage === img ? "border-luxury-gold shadow-[0_0_15px_rgba(201,164,92,0.3)]" : "border-luxury-border opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Listing Details ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column (Main Info) */}
        <div className="lg:col-span-8">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="px-3 py-1 rounded-full border border-luxury-gold text-luxury-gold text-xs font-medium uppercase tracking-widest bg-luxury-gold/5">
              {listing.propertyType}
            </span>
            <span className="px-3 py-1 rounded-full border border-luxury-border text-luxury-text-muted text-xs font-medium tracking-wide bg-luxury-card">
              {listing.genderPreference} Only
            </span>
            {listing.availabilityStatus !== false && (
              <span className="px-3 py-1 rounded-full border border-green-500/30 text-green-400 text-xs font-medium bg-green-900/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Available Now
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-instrument text-luxury-text-beige tracking-tight mb-4 leading-tight">
            {listing.title}
          </h1>

          <div className="flex items-center gap-2 text-luxury-text-muted mb-8 text-lg font-light">
            <MapPinIcon size={20} className="text-luxury-gold" /> {listing.city}
          </div>

          <div className="w-full h-px bg-luxury-border mb-10" />

          <h2 className="text-2xl font-instrument mb-4 text-luxury-text-beige">About this space</h2>
          <p className="text-luxury-text-muted font-light leading-relaxed whitespace-pre-line mb-10">
            {listing.description || "Experience premium living in this meticulously designed space. Every corner is crafted to offer the utmost comfort and elegance."}
          </p>

          <h2 className="text-2xl font-instrument mb-6 text-luxury-text-beige">Premium Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
            {listing.amenities && listing.amenities.length > 0 ? (
              listing.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-3 text-luxury-text-muted">
                  <CheckCircleIcon size={20} className="text-luxury-gold" />
                  <span className="font-light">{amenity}</span>
                </div>
              ))
            ) : (
              <p className="text-luxury-text-muted/50 italic col-span-3">No amenities listed.</p>
            )}
          </div>
        </div>

        {/* Right Column (Floating Sticky Card) */}
        <div className="lg:col-span-4 relative">
          <div className="sticky top-32 bg-luxury-card border border-luxury-border p-8 rounded-3xl shadow-2xl luxury-hover-glow">
            <h3 className="text-xs uppercase tracking-widest text-luxury-text-muted mb-2 font-medium">Monthly Rent</h3>
            <div className="text-4xl font-instrument text-luxury-text-beige mb-6">
              {formattedRent}
            </div>

            <button className="w-full bg-luxury-gold text-luxury-bg font-medium text-sm py-4 rounded-xl shadow-[0_0_20px_rgba(201,164,92,0.3)] hover:shadow-[0_0_30px_rgba(201,164,92,0.5)] transition-all duration-300 mb-6">
              Request to Book
            </button>

            <div className="w-full h-px bg-luxury-border mb-6" />
            
            <h4 className="text-sm font-medium text-luxury-text-beige mb-4 uppercase tracking-widest">Listed By</h4>
            <div className="flex items-center gap-4">
              {typeof listing.ownerRef === "object" && listing.ownerRef?.profilePicture ? (
                <Image 
                  src={listing.ownerRef.profilePicture} 
                  alt="Owner" 
                  width={48} 
                  height={48} 
                  className="rounded-full border border-luxury-gold/50" 
                />
              ) : (
                <UserCircleIcon size={48} weight="light" className="text-luxury-text-muted" />
              )}
              
              <div>
                <p className="font-medium text-luxury-text-beige">
                  {typeof listing.ownerRef === "object" ? listing.ownerRef.name || "Premium Host" : "Premium Host"}
                </p>
                <p className="text-xs text-luxury-text-muted flex items-center gap-1 mt-0.5">
                  <CheckCircleIcon size={12} className="text-luxury-gold" /> Verified Owner
                </p>
              </div>
            </div>
            
            <button className="w-full mt-6 py-3 border border-luxury-border rounded-xl text-sm font-medium hover:bg-luxury-bg-lighter transition-colors text-luxury-text-beige">
              Contact Host
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}