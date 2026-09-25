"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Film, Tv, PlaySquare, Compass } from "lucide-react";

export const Navbar = () => {
  const [activeTab, setActiveTab] = useState("all");

  const navItems = [
    { label: "Home", href: "/", icon: Compass, id: "all" },
    { label: "Movies", href: "/#movies", icon: Film, id: "movie" },
    { label: "TV Shows", href: "/#series", icon: Tv, id: "tv" },
    { label: "Anime", href: "/#anime", icon: PlaySquare, id: "anime" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-black/40 border-b border-white/10 transition-all duration-300">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-widest text-white uppercase drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
            SPECTRA
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 bg-white/[0.04] p-1 rounded-full border border-white/10 backdrop-blur-md">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setActiveTab(item.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-white text-black shadow-glow"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search titles..."
            className="w-36 md:w-56 bg-white/[0.05] border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 focus:w-64 transition-all duration-300 backdrop-blur-md"
          />
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 pointer-events-none" />
        </div>
      </div>
    </header>
  );
};
