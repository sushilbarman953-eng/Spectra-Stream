"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Film, Tv, PlaySquare, Compass, Radio, X, Star, Sparkles } from "lucide-react";
import { IMAGE_BASE } from "@/lib/tmdb";

const QUICK_EXPLORE_GENRES = [
  { name: "Action", href: "/movies?genre=28" },
  { name: "Sci-Fi", href: "/movies?genre=878" },
  { name: "Horror", href: "/movies?genre=27" },
  { name: "Anime", href: "/anime" },
  { name: "Drama", href: "/series?genre=18" },
  { name: "Comedy", href: "/movies?genre=35" },
];

export const Navbar = () => {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          const data = await res.json();
          setResults(data.results || []);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { label: "Home", href: "/", icon: Compass },
    { label: "Movies", href: "/movies", icon: Film },
    { label: "Series", href: "/series", icon: Tv },
    { label: "Anime", href: "/anime", icon: PlaySquare },
    { label: "Live TV", href: "/tv", icon: Radio },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex justify-center">
      <div
        className="w-full max-w-7xl flex items-center justify-between px-5 py-2.5 rounded-2xl border border-white/20 shadow-[0_10px_35px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.35)] relative"
        style={{
          background: "rgba(12, 12, 16, 0.65)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
        }}
      >
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-extrabold tracking-widest text-white uppercase drop-shadow-[0_2px_8px_rgba(255,255,255,0.45)]">
            SPECTRA
          </span>
        </Link>

        {/* Desktop Tabs */}
        <nav
          className="hidden md:flex items-center gap-1 p-1 rounded-full border border-white/15"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.2)",
          }}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] ${
                  isActive
                    ? "bg-white text-black shadow-[0_0_16px_rgba(255,255,255,0.45)]"
                    : "text-zinc-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Search Engine with Integrated Explore Chips */}
        <div ref={searchRef} className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder="Search or explore..."
            className="w-36 md:w-56 rounded-full py-1.5 pl-9 pr-8 text-xs text-white placeholder-zinc-300 focus:outline-none focus:border-white/50 focus:w-64 transition-all duration-300 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          />
          <Search className="w-3.5 h-3.5 text-zinc-200 absolute left-3 pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />

          {query && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
              }}
              className="absolute right-2.5 text-zinc-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Search Dropdown with Explore Section */}
          {isOpen && (
            <div
              className="absolute top-12 right-0 w-72 sm:w-84 max-h-[85vh] overflow-y-auto no-scrollbar rounded-2xl border border-white/20 p-3 shadow-[0_16px_40px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.3)] flex flex-col gap-3 z-50"
              style={{
                background: "rgba(12, 12, 16, 0.95)",
                backdropFilter: "blur(24px) saturate(180%)",
                WebkitBackdropFilter: "blur(24px) saturate(180%)",
              }}
            >
              {/* Explore Genres Section Inside Search */}
              <div className="pb-2 border-b border-white/10">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  <Sparkles className="w-3 h-3 text-white" />
                  Explore Categories
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_EXPLORE_GENRES.map((g) => (
                    <Link
                      key={g.name}
                      href={g.href}
                      onClick={() => setIsOpen(false)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-semibold text-zinc-200 bg-white/5 border border-white/10 hover:bg-white hover:text-black transition"
                    >
                      {g.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Dynamic Search Results */}
              {results.length > 0 && (
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    Matching Titles
                  </span>
                  {results.slice(0, 7).map((item) => {
                    const itemTitle = item.title || item.name || "Untitled";
                    const year = (item.release_date || item.first_air_date || "").slice(0, 4);
                    const poster = item.poster_path ? `${IMAGE_BASE}/w92${item.poster_path}` : null;

                    return (
                      <Link
                        key={item.id}
                        href={`/details/${item.id}?type=${item.media_type}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-white/10 transition group"
                      >
                        <div className="relative w-9 h-12 rounded-lg overflow-hidden bg-zinc-900 flex-none border border-white/10">
                          {poster ? (
                            <Image src={poster} alt={itemTitle} fill className="object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-[8px] text-zinc-600">N/A</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white truncate group-hover:text-zinc-200">
                            {itemTitle}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-zinc-400">
                            <span className="uppercase">{item.media_type}</span>
                            {year && <span>• {year}</span>}
                            {item.vote_average > 0 && (
                              <span className="flex items-center gap-0.5 text-zinc-300">
                                <Star className="w-2.5 h-2.5 fill-white text-white" />
                                {item.vote_average.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
