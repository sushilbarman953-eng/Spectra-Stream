"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Sparkles, Film, Tv, Radio, Flame } from "lucide-react";
import { useSearch } from "@/context/SearchContext";

const CATEGORIES = [
  { label: "Home", href: "/", icon: Sparkles },
  { label: "Movies", href: "/movies", icon: Film },
  { label: "Series", href: "/series", icon: Tv },
  { label: "Anime", href: "/anime", icon: Flame },
  { label: "Live TV", href: "/tv", icon: Radio },
];

export const Navbar = () => {
  const pathname = usePathname();
  const { openSearch } = useSearch();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentCategory =
    CATEGORIES.find((cat) => cat.href === pathname) || CATEGORIES[0];
  const Icon = currentCategory.icon;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-[#08080c]/80 backdrop-blur-2xl border-b border-white/10 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          : "bg-gradient-to-b from-[#08080c]/90 via-[#08080c]/40 to-transparent pt-3 pb-2"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* 3-Column Top Bar */}
        <div className="grid grid-cols-3 items-center h-10">
          
          {/* 1. Left: Brand with Luminous Dot */}
          <div className="flex items-center gap-1.5 justify-start">
            <Link href="/" className="font-black text-lg md:text-xl tracking-wider text-white uppercase flex items-center gap-1 group">
              <span>SPECTRA</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80 group-hover:scale-125 transition-transform shadow-[0_0_8px_#ffffff]" />
            </Link>
          </div>

          {/* 2. Center: Cyber-Glass Indicator Pill (Morphs in when scrolled) */}
          <div className="flex justify-center">
            {isScrolled && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] hover:bg-white/[0.12] border border-white/25 backdrop-blur-xl shadow-[0_0_16px_rgba(255,255,255,0.15),inset_0_1px_1px_rgba(255,255,255,0.35)] animate-in fade-in zoom-in-95 duration-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                <Icon className="w-3 h-3 text-zinc-200" />
                <span className="text-[10px] sm:text-[11px] font-black text-white uppercase tracking-widest">
                  {currentCategory.label}
                </span>
              </div>
            )}
          </div>

          {/* 3. Right: Sleek Frosted Search Button */}
          <div className="flex justify-end">
            <button
              onClick={openSearch}
              className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 active:scale-95 transition select-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
            >
              <Search className="w-3.5 h-3.5 text-zinc-300" />
              <span className="text-zinc-300 text-[10px] sm:text-xs font-semibold tracking-wide">Search</span>
            </button>
          </div>
        </div>

        {/* Sub-bar Category Pills (At top of feed) */}
        {!isScrolled && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 animate-in fade-in slide-in-from-top-2 duration-300">
            {CATEGORIES.map((cat) => {
              const isActive = pathname === cat.href;
              const CatIcon = cat.icon;

              return (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide whitespace-nowrap transition-all duration-200 border ${
                    isActive
                      ? "bg-white text-black border-white shadow-[0_0_18px_rgba(255,255,255,0.45)]"
                      : "bg-white/5 text-zinc-300 border-white/10 hover:bg-white/15 hover:text-white"
                  }`}
                >
                  <CatIcon className={`w-3 h-3 ${isActive ? "text-black" : "text-zinc-400"}`} />
                  <span>{cat.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
