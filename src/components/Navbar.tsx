"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Search, Sparkles, Film, Tv, Radio, Flame, Mic, X, Star, Maximize2 } from "lucide-react";
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
  const [smallGlassOpen, setSmallGlassOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const clickTimer = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close small glass popover on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSmallGlassOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Quick live query
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
          setResults((data.results || []).slice(0, 5));
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [query]);

  // Click Handler: Single tap opens small glass popover, double tap launches fullscreen search
  const handleSearchAction = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (clickTimer.current) {
      // 2 TAPS -> Open Fullscreen Search Page
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      setSmallGlassOpen(false);
      openSearch();
    } else {
      // 1 TAP -> Open Small Frosted Glass Popup
      clickTimer.current = setTimeout(() => {
        clickTimer.current = null;
        setSmallGlassOpen((prev) => {
          const next = !prev;
          if (next) setTimeout(() => inputRef.current?.focus(), 120);
          return next;
        });
      }, 260);
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
          
          {/* 1. Left: Brand */}
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

          {/* 3. Right: Original Frosted Glass Search Capsule */}
          <div className="flex justify-end relative" ref={containerRef}>
            <div
              onClick={handleSearchAction}
              className={`flex items-center gap-2 py-1.5 px-3 rounded-full border transition-all cursor-pointer select-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] active:scale-95 ${
                smallGlassOpen
                  ? "bg-white text-black border-white shadow-glow"
                  : "bg-white/[0.07] hover:bg-white/[0.12] border-white/15 text-zinc-300"
              }`}
              title="Tap 1x: Mini Glass Search | Tap 2x: Fullscreen Search"
            >
              <Search className={`w-3.5 h-3.5 ${smallGlassOpen ? "text-black" : "text-zinc-400"}`} />
              <span className={`text-[10px] sm:text-xs font-medium ${smallGlassOpen ? "text-black font-bold" : "text-zinc-400"}`}>
                Search..
              </span>
              <Mic className={`w-3 h-3 ${smallGlassOpen ? "text-black" : "text-zinc-500"}`} />
            </div>

            {/* SMALL FROSTED GLASS SEARCH POPOVER (1-Tap Floating Modal) */}
            {smallGlassOpen && (
              <div
                className="absolute top-12 right-0 w-72 sm:w-80 rounded-2xl p-2.5 bg-[#09090e]/95 backdrop-blur-3xl border border-white/25 shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.25)] z-50 space-y-2 animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Mini Glass Input */}
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 pointer-events-none" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search movies, anime..."
                    className="w-full py-1.5 pl-8 pr-14 rounded-xl text-xs text-white placeholder-zinc-400 bg-white/10 border border-white/20 focus:outline-none focus:border-white transition"
                  />
                  <div className="absolute right-2 flex items-center gap-1">
                    {query && (
                      <button
                        onClick={() => {
                          setQuery("");
                          setResults([]);
                        }}
                        className="p-0.5 rounded-full text-zinc-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSmallGlassOpen(false);
                        openSearch();
                      }}
                      className="p-1 rounded text-zinc-400 hover:text-white"
                      title="Expand to Fullscreen"
                    >
                      <Maximize2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Instant Suggestions */}
                <div className="max-h-56 overflow-y-auto no-scrollbar space-y-1">
                  {loading && (
                    <div className="py-3 text-center text-[10px] text-zinc-400">
                      Searching...
                    </div>
                  )}

                  {!loading && query && results.length === 0 && (
                    <div className="py-3 text-center text-[10px] text-zinc-500">
                      No results found
                    </div>
                  )}

                  {results.map((item) => {
                    const itemTitle = item.title || item.name || "Untitled";
                    const poster = item.poster_path ? `${IMAGE_BASE}/w92${item.poster_path}` : null;

                    return (
                      <div
                        key={`${item.media_type}-${item.id}`}
                        onClick={() => {
                          setSmallGlassOpen(false);
                          router.push(`/details/${item.id}?type=${item.media_type}`);
                        }}
                        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/10 transition cursor-pointer border border-transparent hover:border-white/10 group"
                      >
                        <div className="relative w-7 h-9 rounded-md overflow-hidden bg-zinc-950 flex-none border border-white/10">
                          {poster ? (
                            <Image src={poster} alt={itemTitle} fill className="object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-[8px] text-zinc-600">N/A</div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-[11px] font-bold text-white truncate group-hover:text-zinc-200">
                            {itemTitle}
                          </h4>
                          <div className="flex items-center gap-1.5 text-[9px] text-zinc-400">
                            <span className="uppercase font-semibold px-1 py-0.2 rounded bg-white/10 text-zinc-300">
                              {item.media_type === "tv" ? "TV" : "Movie"}
                            </span>
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
              </div>
            )}
          </div>
        </div>

        {/* Sub-bar Category Pills (Visible at top of feed) */}
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
