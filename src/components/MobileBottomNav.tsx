"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Compass, Film, Tv, PlaySquare } from "lucide-react";

export const MobileBottomNav = () => {
  const [activeTab, setActiveTab] = useState("all");

  const navItems = [
    { label: "Home", href: "/", icon: Compass, id: "all" },
    { label: "Movies", href: "/#movies", icon: Film, id: "movie" },
    { label: "TV", href: "/#series", icon: Tv, id: "tv" },
    { label: "Anime", href: "/#anime", icon: PlaySquare, id: "anime" },
  ];

  return (
    <nav className="fixed bottom-3 left-4 right-4 z-50 md:hidden flex justify-center pointer-events-auto">
      <div className="w-full max-w-sm flex items-center justify-around py-2.5 px-3 rounded-full glass-panel bg-black/75 border border-white/15 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-all ${
                  isActive ? "bg-white/15 border border-white/20 shadow-glow" : ""
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-medium tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
