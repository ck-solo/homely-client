"use client";

import { motion } from "framer-motion";
import { useAppSelector } from "@/redux/store";
import { 
  House, 
  Users, 
  FileText, 
  TrendUp, 
  Plus, 
  MapPin, 
  ArrowUpRight, 
  UserCircle 
} from "@phosphor-icons/react";
import Link from "next/link";

export default function OwnerDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const displayName = user?.name || "Owner";

  // Mock data for Owner Dashboard
  const metrics = [
    {
      icon: <House size={22} weight="light" className="text-neutral-900" />,
      title: "Active Listings",
      value: "4",
      desc: "Properties live",
      href: "/listings",
    },
    {
      icon: <FileText size={22} weight="light" className="text-neutral-900" />,
      title: "Applications",
      value: "9",
      desc: "Pending review",
      href: "#",
    },
    {
      icon: <TrendUp size={22} weight="light" className="text-neutral-900" />,
      title: "Monthly Revenue",
      value: "₹6,400",
      desc: "+12% from last month",
      href: "#",
    },
  ];

  const myProperties = [
    {
      id: "1",
      title: "Modern Loft in Manhattan",
      location: "East Village, NY",
      rent: "₹3,200/mo",
      status: "Occupied",
      views: "182 views",
      image: "/Homely1.jpg",
    },
    {
      id: "2",
      title: "Spacious Sublet with Balcony",
      location: "Williamsburg, Brooklyn",
      rent: "₹3,200/mo",
      status: "Listed (2 Apps)",
      views: "94 views",
      image: "/Homely3.jpg",
    },
  ];

  const recentApplications = [
    {
      applicant: "Jane Doe",
      email: "jane.doe@example.com",
      property: "Spacious Sublet with Balcony",
      status: "New",
      date: "Just now",
      initials: "JD",
    },
    {
      applicant: "Alex Miller",
      email: "a.miller@example.com",
      property: "Modern Loft in Manhattan",
      status: "Reviewing",
      date: "2 hours ago",
      initials: "AM",
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
            Here is the status of your listed properties and rentals.
          </p>
        </div>
        <Link href="/list-property">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-neutral-900 text-white px-5 py-3 rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm"
          >
            <Plus size={16} />
            List New Property
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
        {/* Listed Properties */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2 flex flex-col gap-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium tracking-tight">Your listed properties</h2>
            <Link href="/listings" className="text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1">
              Manage all <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myProperties.map((prop) => (
              <div 
                key={prop.id}
                className="bg-white rounded-2xl overflow-hidden border border-neutral-200/60 shadow-xs group hover:border-neutral-300/80 transition-all duration-300"
              >
                <div className="relative h-48 bg-neutral-100 overflow-hidden">
                  <div className="absolute top-3 left-3 bg-neutral-900/90 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-full z-10">
                    {prop.status}
                  </div>
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${prop.image})` }}
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-medium text-neutral-950 truncate group-hover:text-indigo-600 transition-colors">{prop.title}</h3>
                  <div className="flex items-center gap-1 text-neutral-400 mt-2 mb-3">
                    <MapPin size={14} />
                    <span className="text-xs font-light truncate">{prop.location}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                    <span className="font-medium text-neutral-950">{prop.rent}</span>
                    <span className="text-xs font-light text-neutral-400">{prop.views}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sidebar Applications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col gap-6"
        >
          <h2 className="text-xl font-medium tracking-tight">Recent applications</h2>
          <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 flex flex-col gap-5">
            {recentApplications.map((app, idx) => (
              <div key={idx} className="flex flex-col gap-3 pb-4 border-b border-neutral-100 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-950 text-white flex items-center justify-center text-xs font-medium">
                      {app.initials}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{app.applicant}</h4>
                      <p className="text-xs text-neutral-400 font-light">{app.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      app.status === "New" ? "bg-indigo-50 text-indigo-600" : "bg-amber-50 text-amber-600"
                    }`}>
                      {app.status}
                    </span>
                    <p className="text-[10px] text-neutral-400 mt-1">{app.date}</p>
                  </div>
                </div>
                <div className="bg-neutral-50 rounded-lg p-2.5 text-xs text-neutral-500 font-light border border-neutral-100 truncate">
                  For: {app.property}
                </div>
                <div className="flex gap-2 justify-end">
                  <button className="text-[11px] text-neutral-500 hover:text-neutral-900 font-medium px-3 py-1">Decline</button>
                  <button className="text-[11px] bg-neutral-900 text-white hover:bg-neutral-800 rounded-md px-3 py-1 font-medium shadow-xs">Approve</button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
