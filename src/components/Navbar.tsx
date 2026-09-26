"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Search, Sparkles, Film, Tv, Radio, Flame, X, Star } from "lucide-react";
import { useSearch } from "@/context/SearchContext";
import { IMAGE_BASE } from "@/lib/tmdb";

const CATEGORIES = [
  { label: "Home", href: "/", icon: Sparkles },
  { label: "Movies", href: "/movies", icon: Film },
  { label: "Series", href: "/series", icon: Tv },
  { label: "Anime", href: "/anime", icon: Flame },
  { label: "Live TV", href: "/tv", icon: Radio },
];

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { openSearch } = useSearch();

  const [isScrolled, setIsScrolled] = useState(false);
  const [inlineSearchOpen, setInlineSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const clickTimer = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close inline search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setInlineSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search for inline input
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults((data.results || []).slice(0, 6));
        }
      } catch (err) {
        console.error("Inline search error:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Dual-action click handler (Single vs Double click)
  const handleSearchClick = () => {
    if (clickTimer.current) {
      // DOUBLE CLICK DETECTED: Open Fullscreen Drawer (bottom drawer behavior)
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      setInlineSearchOpen(false);
      openSearch();
    } else {
      // SINGLE CLICK DETECTED: Open original Inline Dropdown Search
      clickTimer.current = setTimeout(() => {
        clickTimer.current = null;
        setInlineSearchOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }, 280);
    }
  };

  const currentCategory =
    CATEGORIES.find((cat) => cat.href === pathname) || CATEGORIES[0];
  const Icon = currentCategory.icon;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-[#08080c]/85 backdrop-blur-2xl border-b border-white/10 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          : "bg-gradient-to-b from-[#08080c]/90 via-[#08080c]/40 to-transparent pt-3 pb-2"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* 3-Column Top Bar */}
        <div className="grid grid-cols-3 items-center h-10">
          {/* 1. Left: Brand with Luminous Dot */}
          <div className="flex items-center gap-1.5 justify-start">
            <Link
              href="/"
              className="font-black text-lg md:text-xl tracking-wider text-white uppercase flex items-center gap-1 group"
            >
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

          {/* 3. Right: Dual-Trigger Search Button */}
          <div className="flex justify-end" ref={searchContainerRef}>
            <button
              onClick={handleSearchClick}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full border transition select-none active:scale-95 ${
                inlineSearchOpen
                  ? "bg-white text-black border-white shadow-glow"
                  : "bg-white/[0.06] hover:bg-white/[0.12] border-white/15 text-zinc-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
              }`}
              title="1-tap: Quick search | 2-taps: Fullscreen search"
            >
              <Search className={`w-3.5 h-3.5 ${inlineSearchOpen ? "text-black" : "text-zinc-300"}`} />
              <span className="text-[10px] sm:text-xs font-semibold tracking-wide">
                {inlineSearchOpen ? "Close" : "Search"}
              </span>
            </button>
          </div>
        </div>

        {/* INLINE QUICK SEARCH DROPDOWN (Triggered by 1 Tap) */}
        {inlineSearchOpen && (
          <div
            ref={searchContainerRef}
            className="pt-2 animate-in fade-in slide-in-from-top-2 duration-200 relative"
          >
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Quick title search..."
                className="w-full py-2 pl-9 pr-8 rounded-2xl text-xs text-white placeholder-zinc-400 bg-white/[0.08] backdrop-blur-2xl border border-white/20 focus:outline-none focus:border-white shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition"
              />
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 pointer-events-none" />
              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    setResults([]);
                  }}
                  className="absolute right-2.5 p-1 rounded-full text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Autocomplete Results Card */}
            {(results.length > 0 || loading) && (
              <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl bg-[#09090e]/95 backdrop-blur-2xl border border-white/20 shadow-2xl space-y-1.5 z-50 max-h-72 overflow-y-auto no-scrollbar">
                {loading && (
                  <div className="py-3 text-center text-xs text-zinc-400">
                    Searching Spectra...
                  </div>
                )}
                {results.map((item) => {
                  const itemTitle = item.title || item.name || "Untitled";
                  const year = (item.release_date || item.first_air_date || "").slice(0, 4);
                  const poster = item.poster_path ? `${IMAGE_BASE}/w92${item.poster_path}` : null;

                  return (
                    <div
                      key={`${item.media_type}-${item.id}`}
                      onClick={() => {
                        setInlineSearchOpen(false);
                        setQuery("");
                        router.push(`/details/${item.id}?type=${item.media_type}`);
                      }}
                      className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/10 cursor-pointer transition border border-transparent hover:border-white/15"
                    >
                      <div className="relative w-8 h-10 rounded-lg overflow-hidden bg-zinc-950 flex-none border border-white/10">
                        {poster ? (
                          <Image src={poster} alt={itemTitle} fill className="object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-[8px] text-zinc-600">N/A</div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-white truncate">{itemTitle}</h4>
                        <div className="flex items-center gap-1.5 text-[9px] text-zinc-400">
                          <span className="uppercase font-semibold px-1 py-0.2 rounded bg-white/10 text-zinc-300">
                            {item.media_type === "tv" ? "Series" : "Movie"}
                          </span>
                          {year && <span>{year}</span>}
                          {item.vote_average > 0 && (
                            <span className="flex items-center gap-0.5 text-zinc-200">
                              <Star className="w-2 h-2 fill-white text-white" />
                              {item.vote_average.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Sub-bar Category Pills (At top of feed) */}
        {!isScrolled && !inlineSearchOpen && (
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
