"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User, Mic } from "lucide-react";
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

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#08080c]/80 backdrop-blur-2xl border-b border-white/10 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Top Row: Brand Logo | Quick Search Box | User Avatar */}
        <div className="flex items-center justify-between h-14 gap-3">
          <Link href="/" className="flex items-center gap-2 group flex-none">
            <span className="font-black text-lg md:text-xl tracking-wider text-white uppercase group-hover:text-zinc-300 transition-colors">
              SPECTRA
            </span>
          </Link>

          {/* Quick Search Action Bar */}
          <div
            onClick={openSearch}
            className="flex-1 max-w-sm flex items-center justify-between py-1.5 px-3 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/15 cursor-pointer transition select-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
          >
            <div className="flex items-center gap-2 text-zinc-400 text-xs">
              <Search className="w-3.5 h-3.5" />
              <span className="truncate">Search movies, anime...</span>
            </div>
            <Mic className="w-3.5 h-3.5 text-zinc-400 hover:text-white" />
          </div>

          {/* Me Link */}
          <Link
            href="/me"
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-300 hover:text-white transition flex-none"
            title="Profile & Watchlist"
          >
            <User className="w-4 h-4" />
          </Link>
        </div>

        {/* Bottom Row: Pinned Horizontal Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
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
      </div>
    </header>
  );
};
