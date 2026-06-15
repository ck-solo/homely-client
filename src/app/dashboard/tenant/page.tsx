"use client";

import { motion } from "framer-motion";
import { useAppSelector } from "@/redux/store";
import { 
  Heart, 
  House, 
  Users, 
  MagnifyingGlass, 
  Chat, 
  UserCircle, 
  MapPin, 
  ArrowUpRight 
} from "@phosphor-icons/react";
import Link from "next/link";

export default function TenantDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const displayName = user?.name || "Tenant";

  // Mock data for Tenant Dashboard
  const metrics = [
    {
      icon: <Heart size={22} weight="light" className="text-neutral-900" />,
      title: "Saved Spaces",
      value: "6",
      desc: "Properties you liked",
      href: "/listings?filter=saved",
    },
    {
      icon: <Users size={22} weight="light" className="text-neutral-900" />,
      title: "Roommate Matches",
      value: "12",
      desc: "Compatible users found",
      href: "#",
    },
    {
      icon: <House size={22} weight="light" className="text-neutral-900" />,
      title: "Applications",
      value: "2",
      desc: "Pending review by owners",
      href: "#",
    },
  ];

  const suggestedListings = [
    {
      id: "1",
      title: "Minimalist Loft near City Center",
      location: "Downtown, New York",
      price: "₹1,850/mo",
      type: "Studio • 1 BA",
      image: "/Homely1.jpg",
      matchScore: "95% Vibe Match",
    },
    {
      id: "2",
      title: "Cozy Shared Apartment",
      location: "Brooklyn, New York",
      price: "₹1,200/mo",
      type: "1 BR in 3BHK • Shared BA",
      image: "/Homely2.jpg",
      matchScore: "88% Vibe Match",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 pt-25 md:pt-30 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight mt-1">
            Welcome back, <span className="text-neutral-500">{displayName}</span>
          </h1>
          <p className="text-neutral-500 font-light mt-1">
            Here's what is happening with your rental search today.
          </p>
        </div>
        <Link href="/listings">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-neutral-900 text-white px-5 py-3 rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm"
          >
            <MagnifyingGlass size={16} />
            Explore Properties
          </motion.button>
        </Link>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {metrics.map((metric, idx) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="p-6 rounded-2xl bg-white border border-neutral-200/60 shadow-xs flex items-start justify-between group hover:border-neutral-300 transition-colors"
          >
            <div>
              <p className="text-sm text-neutral-500 font-light">{metric.title}</p>
              <h3 className="text-3xl font-medium tracking-tight mt-1 mb-2">{metric.value}</h3>
              <p className="text-xs text-neutral-400 font-light">{metric.desc}</p>
            </div>
            <div className="p-3 bg-neutral-50 rounded-xl group-hover:bg-neutral-100/80 transition-colors">
              {metric.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Suggested listings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2 flex flex-col gap-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium tracking-tight">Handpicked for you</h2>
            <Link href="/listings" className="text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suggestedListings.map((listing) => (
              <div 
                key={listing.id}
                className="bg-white rounded-2xl overflow-hidden border border-neutral-200/60 shadow-xs group hover:border-neutral-300/80 transition-all duration-300"
              >
                <div className="relative h-48 bg-neutral-100 overflow-hidden">
                  <div className="absolute top-3 left-3 bg-indigo-600/90 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-full z-10">
                    {listing.matchScore}
                  </div>
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${listing.image})` }}
                  />
                </div>
                <div className="p-5">
                  <span className="text-[11px] font-semibold text-indigo-600 tracking-wider uppercase">{listing.type}</span>
                  <h3 className="font-medium text-neutral-950 mt-1 truncate group-hover:text-indigo-600 transition-colors">{listing.title}</h3>
                  <div className="flex items-center gap-1 text-neutral-400 mt-2 mb-3">
                    <MapPin size={14} />
                    <span className="text-xs font-light truncate">{listing.location}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                    <span className="font-medium text-neutral-900">{listing.price}</span>
                    <Link href={`/listing/${listing.id}`} className="text-xs font-medium text-neutral-900 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sidebar activity / matches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col gap-6"
        >
          <h2 className="text-xl font-medium tracking-tight">Vibe matches</h2>
          <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 flex flex-col gap-5">
            {[
              { name: "Sarah Jenkins", match: "98% Match", habits: "Night Owl • Vegan • Quiet", image: "SJ" },
              { name: "Marcus Chen", match: "91% Match", habits: "Early Bird • Gym • Social", image: "MC" },
            ].map((match, idx) => (
              <div key={idx} className="flex items-center justify-between pb-4 border-b border-neutral-100 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-950 text-white flex items-center justify-center text-xs font-medium">
                    {match.image}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{match.name}</h4>
                    <p className="text-xs text-neutral-400 font-light mt-0.5">{match.habits}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-emerald-600">{match.match}</span>
                  <button className="block text-[11px] text-indigo-600 font-medium hover:underline mt-1">Connect</button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
