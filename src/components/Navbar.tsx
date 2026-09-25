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
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex justify-center">
      <div className="w-full max-w-7xl flex items-center justify-between px-5 py-2.5 rounded-2xl glass-panel">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-widest text-white uppercase drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
            SPECTRA
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 glass-pill p-1 rounded-full">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setActiveTab(item.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  : "text-zinc-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search titles..."
            className="w-36 md:w-56 glass-pill rounded-full py-1.5 pl-9 pr-4 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-white/40 focus:w-64 transition-all duration-300"
          />
          <Search className="w-3.5 h-3.5 text-zinc-300 absolute left-3 pointer-events-none" />
        </div>
      </div>
    </header>
  );
};
