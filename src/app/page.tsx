"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Users, MapPin, Sparkle, HouseLine } from "@phosphor-icons/react";

const features = [
  {
    icon: <Users size={24} weight="light" />,
    title: "Roommate Search",
    desc: "Find people who match your lifestyle, not just your budget.",
  },
  {
    icon: <HouseLine size={24} weight="light" />,
    title: "Curated Rentals",
    desc: "Discover verified PGs and apartments that feel like home.",
  },
  {
    icon: <MapPin size={24} weight="light" />,
    title: "Map Integration",
    desc: "Explore neighborhoods and commute times seamlessly.",
  },
  {
    icon: <Sparkle size={24} weight="light" />,
    title: "Vibe Match",
    desc: "Our algorithm connects you based on shared habits and interests.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] text-neutral-900 overflow-hidden pt-24 md:pt-32">
      
      {/* HERO SECTION */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto flex flex-col items-center text-center mt-12 md:mt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[1.1] text-neutral-900">
            Find your space. <br />
            <span className="text-neutral-400">Find your people.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto font-light leading-relaxed">
            A curated platform for discovering modern rentals and connecting with roommates who share your vibe.
          </p>
        </motion.div>
      </section>

      {/* STAGGERED IMAGE GALLERY */}
      <section className="mt-20 md:mt-32 px-6 md:px-12 w-full max-w-screen-2xl mx-auto pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 h-[60vh] md:h-[70vh]">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative w-full h-full rounded-2xl overflow-hidden group"
          >
            <Image src="/Homely1.jpg" alt="Living space" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full h-full rounded-2xl overflow-hidden group hidden md:block md:-translate-y-12"
          >
            <Image src="/Homely2.jpg" alt="Work space" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative w-full h-full rounded-2xl overflow-hidden group hidden md:block"
          >
            <Image src="/Homely3.jpg" alt="Dining space" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="bg-white py-32 px-6 md:px-12 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 justify-between items-start mb-20">
            <h2 className="text-3xl md:text-5xl tracking-tight max-w-md">
              Everything you need to settle in.
            </h2>
            <p className="text-neutral-500 max-w-md text-lg font-light">
              Designed for both tenants seeking comfort and owners looking for reliable occupants. A seamless experience from search to move-in.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-8 rounded-2xl bg-neutral-50 hover:bg-neutral-100 transition-colors group cursor-default"
              >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm text-neutral-900 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl mb-3">{feature.title}</h3>
                <p className="text-neutral-500 font-light leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}