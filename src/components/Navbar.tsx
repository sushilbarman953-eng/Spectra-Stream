"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Mic } from "lucide-react";
import { useSearch } from "@/context/SearchContext";

const CATEGORIES = [
  { label: "Home", href: "/" },
  { label: "Movies", href: "/movies" },
  { label: "Series", href: "/series" },
  { label: "Anime", href: "/anime" },
  { label: "Live TV", href: "/tv" },
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

  const activeCategory =
    CATEGORIES.find((cat) => cat.href === pathname)?.label || "Home";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-[#08080c]/85 backdrop-blur-2xl border-b border-white/10 py-2.5 shadow-lg"
          : "bg-gradient-to-b from-[#08080c]/90 via-[#08080c]/40 to-transparent pt-3 pb-2"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Top Row: Brand & Active Subcategory (left) + Glass Search Input (right) */}
        <div className="flex items-center justify-between gap-3 h-10">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-black text-lg md:text-xl tracking-wider text-white uppercase">
              SPECTRA
            </Link>
            {isScrolled && (
              <>
                <span className="text-zinc-600 font-light text-sm">/</span>
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                  {activeCategory}
                </span>
              </>
            )}
          </div>

          {/* Frosted Glass Search Action (Retained) */}
          <div
            onClick={openSearch}
            className="flex-1 max-w-[210px] sm:max-w-xs flex items-center justify-between py-1.5 px-3 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/15 cursor-pointer transition select-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
          >
            <div className="flex items-center gap-2 text-zinc-400 text-xs">
              <Search className="w-3.5 h-3.5" />
              <span className="truncate">Search...</span>
            </div>
            <Mic className="w-3.5 h-3.5 text-zinc-400 hover:text-white" />
          </div>
        </div>

        {/* Sub-bar Category Pills: Shown beneath when at the top, hidden on scroll */}
        {!isScrolled && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2.5 pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 animate-in fade-in duration-200">
            {CATEGORIES.map((cat) => {
              const isActive = pathname === cat.href;

              return (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className={`px-3.5 py-1 rounded-full text-xs font-bold tracking-wide whitespace-nowrap transition-all duration-200 border ${
                    isActive
                      ? "bg-white text-black border-white shadow-glow"
                      : "bg-white/5 text-zinc-300 border-white/10 hover:bg-white/15 hover:text-white"
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
