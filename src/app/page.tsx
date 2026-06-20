"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { 
  UsersIcon, 
  MapPinIcon, 
  StarIcon, 
  HouseLineIcon, 
  MagnifyingGlassIcon, 
  ArrowRightIcon, 
  CheckCircleIcon,
  PizzaIcon,
  MoonIcon,
  MusicNotesIcon
} from "@phosphor-icons/react";
import GradientText from "@/components/ui/GradientText";

// Types
type VibeTag = "Night Owl" | "Foodie" | "Quiet Study" | "Music Lover";

interface RoommateMock {
  name: string;
  match: number;
  tags: VibeTag[];
  img: string;
  desc: string;
}

// Mock Data for Interactive Match Experience
const VIBE_TAGS: { id: VibeTag; icon: React.ReactNode }[] = [
  { id: "Night Owl", icon: <MoonIcon size={14} weight="fill" /> },
  { id: "Foodie", icon: <PizzaIcon size={14} weight="fill" /> },
  { id: "Quiet Study", icon: <CheckCircleIcon size={14} weight="fill" /> },
  { id: "Music Lover", icon: <MusicNotesIcon size={14} weight="fill" /> },
];

const ROOMMATE_MOCKS: RoommateMock[] = [
  { name: "Aarav Sharma", match: 98, tags: ["Night Owl", "Foodie"], img: "/Homely1.jpg", desc: "Tech grad moving into the tech hub. Let's find a flat & hunt late night street food." },
  { name: "Riya Patel", match: 94, tags: ["Quiet Study", "Foodie"], img: "/Homely2.jpg", desc: "Architectural intern. Clean spaces and weekend cafe hopping are non-negotiable." },
  { name: "Kabir Mehta", match: 89, tags: ["Music Lover", "Night Owl"], img: "/Homely3.jpg", desc: "UI Designer working remotely. Love vinyl records, lo-fi beats, and cooking brunch." },
];

const FEATURES = [
  {
    icon: <UsersIcon size={24} weight="light" />,
    title: "Roommate Search",
    desc: "Filter through verified profiles looking for spaces in the exact same neighborhood.",
  },
  {
    icon: <StarIcon size={24} weight="light" />,
    title: "Vibe Matching",
    desc: "Connect seamlessly based on shared cleaning habits, sleep schedules, and noise preferences.",
  },
  {
    icon: <HouseLineIcon size={24} weight="light" />,
    title: "Curated Rentals",
    desc: "Explore rental options uploaded straight from verified platform owners to host your group.",
  },
  {
    icon: <MapPinIcon size={24} weight="light" />,
    title: "Proximity Mapping",
    desc: "Calculate precise work commute vectors and local neighborhood walking scores automatically.",
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"roommates" | "rentals">("roommates");
  const [selectedVibe, setSelectedVibe] = useState<VibeTag | null>(null);

  // Filter matching roommates based on simulation clicks
  const filteredRoommates = selectedVibe 
    ? ROOMMATE_MOCKS.filter(r => r.tags.includes(selectedVibe))
    : ROOMMATE_MOCKS;

  return (
    <main className="min-h-screen bg-[#f8fafc] text-neutral-900 overflow-hidden pt-24 md:pt-36">
      
      {/* 1. HERO SECTION */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          {/* Context Badge */}
          <span className="inline-flex items-center gap-2 bg-neutral-100 text-neutral-800 text-xs px-4 py-1.5 rounded-full mb-6 font-medium tracking-wide uppercase border border-neutral-200/40">
            <StarIcon size={14} weight="fill" className="text-neutral-900 animate-spin-slow" /> 
            The Social Roommate Ecosystem
          </span>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[1.05] font-normal text-neutral-900">
            Find your space. <br />
            <GradientText
              colors={["#04384f", "#0f74ff", "#0ea5e9", "#0f74ff"]}
              animationSpeed={5}
              showBorder={false}
              className="font-light italic font-instrument mx-0 inline-block!"
            >
              Match your vibe.
            </GradientText>
          </h1>
          
          <p className="mt-4 text-md md:text-md text-neutral-500 max-w-xl mx-auto font-normal leading-5">
            Moving to a new city shouldn&apos;t mean compromising on who you live with. Match with roommates who fit your lifestyle and secure premium verified listings.
          </p>
        </motion.div>

        {/* INTEGRATED ACTION HUB CONTAINER */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl mt-12 bg-white rounded-3xl p-4 shadow-[0_8px_20px_rgb(0,0,0,0.1)] border border-neutral-200/60"
        >
          {/* Sub-navigation Tabs */}
          <div className="flex bg-neutral-100 p-1.5 rounded-2xl w-fit mx-auto md:mx-0">
            <button
              onClick={() => setActiveTab("roommates")}
              className={`relative px-5 py-2 text-sm rounded-xl font-medium transition-colors ${
                activeTab === "roommates" ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              {activeTab === "roommates" && (
                <motion.div layoutId="activeHubTab" className="absolute inset-0 bg-white shadow-sm rounded-xl" />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <UsersIcon size={16} /> Find Roommates
              </span>
            </button>
            <button
              onClick={() => setActiveTab("rentals")}
              className={`relative px-5 py-2 text-sm rounded-xl font-medium transition-colors ${
                activeTab === "rentals" ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              {activeTab === "rentals" && (
                <motion.div layoutId="activeHubTab" className="absolute inset-0 bg-white shadow-sm rounded-xl" />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <HouseLineIcon size={16} /> Explore Rentals
              </span>
            </button>
          </div>

          {/* Dynamic Search Box Layout */}
          <div className="mt-4 flex flex-col md:flex-row items-center gap-3">
            <div className="w-full relative flex items-center">
              <MapPinIcon size={18} className="absolute left-4 text-neutral-400" />
              <input 
                type="text" 
                placeholder={activeTab === "roommates" ? "Where are you hunting for roommates? (e.g. Indiranagar, HSR Layout)" : "Enter city, neighborhood or area..."}
                className="w-full bg-neutral-50 text-neutral-900 placeholder-neutral-400 pl-11 pr-4 py-3.5 rounded-2xl text-sm border border-neutral-200/40 focus:outline-hidden focus:border-neutral-400 transition-colors"
              />
            </div>
            <Link href="/login" className="w-full md:w-auto">
              <button className="w-full bg-linear-to-r from-homely-primary to-homely-secondary text-white shadow-lg shadow-homely-primary/20 hover:shadow-homely-primary/40 text-sm font-medium px-6 py-3.5 rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                <MagnifyingGlassIcon size={16} weight="bold" /> Search Now
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 2. LIVE VIBE-MATCH SIMULATION ENGINE */}
      <section id="vibe-match" className="mt-28 md:mt-40 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="bg-neutral-900 text-white rounded-[2.5rem] p-8 md:p-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-neutral-800/30 rounded-full blur-3xl pointer-events-none" />
          
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="text-neutral-400 text-xs font-medium uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Try it live
            </span>
            <h2 className="text-3xl md:text-5xl tracking-tight leading-tight font-normal">
              Say goodbye to <br />
              <span className="text-homely-secondary italic font-instrument">roommate roulette.</span>
            </h2>
            <p className="mt-4 text-neutral-400 font-light leading-relaxed text-sm md:text-base">
              Filter profiles cleanly on individual energy preferences. Our matching engine shifts compatibility algorithms dynamically based on real lifestyle values.
            </p>

            {/* Simulated Live Filters */}
            <div className="mt-8 flex flex-wrap gap-2">
              <button 
                onClick={() => setSelectedVibe(null)}
                className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                  selectedVibe === null 
                    ? "bg-white text-neutral-900 border-white" 
                    : "bg-neutral-800/40 text-neutral-400 border-neutral-800 hover:border-neutral-700"
                }`}
              >
                All Profiles
              </button>
              {VIBE_TAGS.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setSelectedVibe(tag.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
                    selectedVibe === tag.id
                      ? "bg-linear-to-r from-homely-primary to-homely-secondary text-white border-transparent shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                      : "bg-neutral-800/40 text-neutral-400 border-neutral-800 hover:border-neutral-700"
                  }`}
                >
                  {tag.icon}
                  {tag.id}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Stack Cards Container */}
          <div className="lg:col-span-7 w-full flex flex-col gap-4 relative min-h-[380px] justify-center">
            <AnimatePresence mode="popLayout">
              {filteredRoommates.map((person) => (
                <motion.div
                  key={person.name}
                  layout
                  initial={{ opacity: 0, x: 30, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -30, scale: 0.95 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-neutral-800/50 backdrop-blur-md border border-neutral-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border border-neutral-700">
                      <Image src={person.img} alt={person.name} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-white text-base">{person.name}</h4>
                        <span className="bg-neutral-800 text-neutral-300 text-[10px] px-2 py-0.5 rounded-md font-mono">
                          {person.match}% Match
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 font-light mt-1 max-w-md">{person.desc}</p>
                    </div>
                  </div>
                  
                  {/* Tags Group */}
                  <div className="flex gap-1.5 flex-wrap">
                    {person.tags.map((t) => (
                      <span key={t} className="bg-homely-primary/15 text-homely-secondary border border-homely-primary/20 text-[10px] px-2.5 py-1 rounded-full font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 3. CORE ARCHITECTURAL FEATURES LINK */}
      <section className="py-24 md:py-36 px-6 md:px-12 bg-white mt-24 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 justify-between items-start mb-24">
            <div className="max-w-xl">
              <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider block mb-2">Designed For Settle-In</span>
              <h2 className="text-4xl md:text-5xl tracking-tight text-neutral-900 font-normal">
                Everything you need to <br />plant roots in a new city.
              </h2>
            </div>
            <p className="text-neutral-500 max-w-md text-base md:text-lg font-light leading-relaxed lg:mt-6">
              Homely bridges the gap perfectly between discovering curated physical architecture and building your fundamental social foundation safely[cite: 1].
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className="p-8 rounded-2xl bg-white hover:bg-neutral-50/80 border border-neutral-200/40 hover:border-homely-primary/30 hover:shadow-xl hover:shadow-homely-primary/5 hover:-translate-y-1 transition-all duration-300 group cursor-default"
              >
                <div className="w-12 h-12 rounded-xl bg-neutral-50 border border-neutral-200/50 flex items-center justify-center mb-6 shadow-xs text-neutral-900 group-hover:bg-linear-to-br group-hover:from-homely-primary group-hover:to-homely-secondary group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium mb-2 text-neutral-900">{feature.title}</h3>
                <p className="text-neutral-500 text-sm font-light leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CURATED CONTEXT DRIVEN GALLERY */}
      <section id="listings" className="py-20 px-6 md:px-12 w-full max-w-screen-2xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider block mb-1">Premium Ecosystem Listings</span>
            <h3 className="text-2xl md:text-3xl tracking-tight">Explore Shared Rentals</h3>
          </div>
          <Link href="/listings" className="text-sm font-medium flex items-center gap-1.5 text-neutral-900 hover:gap-2.5 transition-all">
            View All Spaces <ArrowRightIcon size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { img: "/Homely1.jpg", area: "Indiranagar", type: "3 BHK Premium Shared", price: "₹18,500/mo" },
            { img: "/Homely2.jpg", area: "HSR Layout Sector 4", type: "Studio Loft Space", price: "₹24,000/mo" },
            { img: "/Homely3.jpg", area: "Koramangala 5th Block", type: "2 BHK Luxury Apartment", price: "₹16,000/mo" }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-neutral-100">
                <Image 
                  src={item.img} 
                  alt={item.type} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 33vw" 
                  className="object-cover transition-transform duration-700 ease-[0.16, 1, 0.3, 1] group-hover:scale-105" 
                />
              </div>
              <div className="mt-4 flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-neutral-900 text-base group-hover:text-neutral-600 transition-colors">{item.type}</h4>
                  <p className="text-sm text-neutral-400 font-light flex items-center gap-1 mt-0.5">
                    <MapPinIcon size={14} /> {item.area}
                  </p>
                </div>
                <span className="text-sm font-medium bg-neutral-100 px-3 py-1 rounded-lg text-neutral-900">{item.price}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </main>
  );
}