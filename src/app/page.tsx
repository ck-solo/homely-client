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
    <main className="min-h-screen bg-luxury-bg text-luxury-text-beige overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative px-6 md:px-12 pt-32 pb-24 md:pt-48 md:pb-32 flex flex-col items-center text-center border-b border-luxury-border">
        {/* Dark Cinematic Overlay */}
        <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1542314831-c6a4d27ece91?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-20 mix-blend-luminosity"></div>
        <div className="absolute inset-0 z-0 bg-linear-to-b from-luxury-bg/50 via-luxury-bg/80 to-luxury-bg"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-4xl"
        >
          <span className="inline-flex items-center gap-2 text-luxury-gold text-xs px-4 py-1.5 mb-6 font-medium tracking-[0.2em] uppercase border border-luxury-gold/30 rounded-full bg-luxury-card/50 backdrop-blur-xs">
            <StarIcon size={14} weight="fill" /> 
            Luxury Hotel & Resort
          </span>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[1.05] font-instrument text-luxury-text-beige">
            Find Your <span className="text-luxury-gold italic">Luxury</span> Stay
          </h1>
          
          <p className="mt-6 text-md md:text-lg text-luxury-text-muted max-w-xl mx-auto font-light leading-relaxed">
            Discover premium villas, resorts, and boutique hotels curated for the ultimate experience.
          </p>
        </motion.div>

        {/* INTEGRATED ACTION HUB CONTAINER */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-3xl mt-12 bg-luxury-card/80 backdrop-blur-xl rounded-2xl p-4 border border-luxury-border shadow-2xl"
        >
          {/* Sub-navigation Tabs */}
          <div className="flex bg-luxury-bg p-1.5 rounded-xl w-fit mx-auto md:mx-0 border border-luxury-border/50">
            <button
              onClick={() => setActiveTab("roommates")}
              className={`relative px-5 py-2 text-sm rounded-lg font-medium transition-all duration-300 ${
                activeTab === "roommates" ? "text-luxury-bg bg-luxury-gold shadow-md" : "text-luxury-text-muted hover:text-luxury-text-beige"
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <UsersIcon size={16} /> Shared Spaces
              </span>
            </button>
            <button
              onClick={() => setActiveTab("rentals")}
              className={`relative px-5 py-2 text-sm rounded-lg font-medium transition-all duration-300 ${
                activeTab === "rentals" ? "text-luxury-bg bg-luxury-gold shadow-md" : "text-luxury-text-muted hover:text-luxury-text-beige"
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <HouseLineIcon size={16} /> Premium Rentals
              </span>
            </button>
          </div>

          {/* Dynamic Search Box Layout */}
          <div className="mt-5 flex flex-col md:flex-row items-center gap-3">
            <div className="w-full relative flex items-center">
              <MapPinIcon size={18} className="absolute left-4 text-luxury-gold" />
              <input 
                type="text" 
                placeholder={activeTab === "roommates" ? "Search luxury shared spaces..." : "Enter destination or hotel name..."}
                className="w-full bg-luxury-bg/50 text-luxury-text-beige placeholder-luxury-text-muted/50 pl-11 pr-4 py-3.5 rounded-xl text-sm border border-luxury-border focus:outline-hidden focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/50 transition-all"
              />
            </div>
            <Link href="/listings" className="w-full md:w-auto">
              <button className="w-full bg-luxury-gold text-luxury-bg shadow-[0_0_15px_rgba(201,164,92,0.3)] hover:shadow-[0_0_25px_rgba(201,164,92,0.5)] text-sm font-medium px-8 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap">
                <MagnifyingGlassIcon size={16} weight="bold" /> Discover
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 2. LIVE VIBE-MATCH SIMULATION ENGINE */}
      <section id="vibe-match" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="bg-luxury-card border border-luxury-border rounded-[2rem] p-8 md:p-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="lg:col-span-5 flex flex-col justify-center relative z-10">
            <span className="text-luxury-gold text-xs font-medium uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse" /> Curated Experience
            </span>
            <h2 className="text-3xl md:text-5xl tracking-tight leading-tight font-instrument">
              Find your <br />
              <span className="text-luxury-gold italic">perfect match.</span>
            </h2>
            <p className="mt-4 text-luxury-text-muted font-light leading-relaxed text-sm md:text-base">
              Filter profiles cleanly on individual preferences. Our engine ensures you find spaces and people that align with your premium lifestyle.
            </p>

            {/* Simulated Live Filters */}
            <div className="mt-8 flex flex-wrap gap-2">
              <button 
                onClick={() => setSelectedVibe(null)}
                className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all duration-300 ${
                  selectedVibe === null 
                    ? "bg-luxury-gold text-luxury-bg border-luxury-gold" 
                    : "bg-luxury-bg/50 text-luxury-text-muted border-luxury-border hover:border-luxury-gold/50 hover:text-luxury-text-beige"
                }`}
              >
                All Profiles
              </button>
              {VIBE_TAGS.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setSelectedVibe(tag.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all duration-300 ${
                    selectedVibe === tag.id
                      ? "bg-luxury-gold text-luxury-bg border-luxury-gold shadow-[0_0_15px_rgba(201,164,92,0.3)]"
                      : "bg-luxury-bg/50 text-luxury-text-muted border-luxury-border hover:border-luxury-gold/50 hover:text-luxury-text-beige"
                  }`}
                >
                  {tag.icon}
                  {tag.id}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Stack Cards Container */}
          <div className="lg:col-span-7 w-full flex flex-col gap-4 relative min-h-[380px] justify-center z-10">
            <AnimatePresence mode="popLayout">
              {filteredRoommates.map((person) => (
                <motion.div
                  key={person.name}
                  layout
                  initial={{ opacity: 0, x: 30, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -30, scale: 0.95 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-luxury-bg/50 backdrop-blur-md border border-luxury-border p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 luxury-hover-glow"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-luxury-gold/30">
                      <Image src={person.img} alt={person.name} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-instrument text-luxury-text-beige text-lg">{person.name}</h4>
                        <span className="bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20 text-[10px] px-2 py-0.5 rounded-md tracking-wider">
                          {person.match}% MATCH
                        </span>
                      </div>
                      <p className="text-xs text-luxury-text-muted font-light mt-1 max-w-md leading-relaxed">{person.desc}</p>
                    </div>
                  </div>
                  
                  {/* Tags Group */}
                  <div className="flex gap-1.5 flex-wrap">
                    {person.tags.map((t) => (
                      <span key={t} className="bg-luxury-bg border border-luxury-border text-luxury-gold text-[10px] px-2.5 py-1 rounded-full font-medium">
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
      <section className="py-24 md:py-36 px-6 md:px-12 bg-luxury-bg border-y border-luxury-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 justify-between items-start mb-24">
            <div className="max-w-xl">
              <span className="text-xs text-luxury-gold font-medium uppercase tracking-[0.2em] block mb-4">Premium Amenities</span>
              <h2 className="text-4xl md:text-6xl tracking-tight text-luxury-text-beige font-instrument">
                Experience unparalleled <br /><span className="italic text-luxury-gold">comfort & style.</span>
              </h2>
            </div>
            <p className="text-luxury-text-muted max-w-md text-base md:text-lg font-light leading-relaxed lg:mt-8">
              Every detail is meticulously crafted to ensure your stay is extraordinary. From curated spaces to verified hosts, we redefine luxury living.
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
                className="p-8 rounded-2xl bg-luxury-card border border-luxury-border hover:border-luxury-gold/50 transition-all duration-300 group cursor-default luxury-hover-glow"
              >
                <div className="w-12 h-12 rounded-xl bg-luxury-bg border border-luxury-border flex items-center justify-center mb-6 text-luxury-gold group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-instrument tracking-wide text-luxury-text-beige mb-3">{feature.title}</h3>
                <p className="text-luxury-text-muted text-sm font-light leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CURATED CONTEXT DRIVEN GALLERY */}
      <section id="listings" className="py-24 px-6 md:px-12 w-full max-w-screen-2xl mx-auto">
        <div className="flex items-end justify-between mb-16">
          <div>
            <span className="text-xs text-luxury-gold font-medium uppercase tracking-[0.2em] block mb-3">Featured Properties</span>
            <h3 className="text-3xl md:text-5xl font-instrument text-luxury-text-beige tracking-tight">Our Premium Collection</h3>
          </div>
          <Link href="/listings" className="text-sm font-medium flex items-center gap-2 text-luxury-gold hover:text-luxury-gold-light transition-colors pb-2">
            View All <ArrowRightIcon size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { img: "/Homely1.jpg", area: "Beverly Hills", type: "Royal Suite Villa", price: "$2,400/night" },
            { img: "/Homely2.jpg", area: "Malibu Coast", type: "Oceanfront Penthouse", price: "$3,100/night" },
            { img: "/Homely3.jpg", area: "Hollywood Hills", type: "Panoramic Mansion", price: "$4,500/night" }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.1 }}
              className="group cursor-pointer block"
            >
              <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-luxury-bg border border-luxury-border">
                <Image 
                  src={item.img} 
                  alt={item.type} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 33vw" 
                  className="object-cover transition-transform duration-1000 ease-[0.16, 1, 0.3, 1] group-hover:scale-105 opacity-90 group-hover:opacity-100" 
                />
                <div className="absolute inset-0 bg-linear-to-t from-luxury-bg via-luxury-bg/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end text-left z-10">
                  <p className="text-xs text-luxury-gold font-medium uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <MapPinIcon size={14} /> {item.area}
                  </p>
                  <h4 className="font-instrument text-2xl text-luxury-text-beige mb-3">{item.type}</h4>
                  <div className="w-full h-[1px] bg-luxury-border mb-3"></div>
                  <span className="text-sm font-medium text-luxury-text-muted">{item.price}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </main>
  );
}