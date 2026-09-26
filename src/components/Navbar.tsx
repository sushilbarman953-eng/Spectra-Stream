"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Search, Sparkles, Film, Tv, Radio, Flame, Mic, X, Maximize2 } from "lucide-react";
import { useSearch } from "@/context/SearchContext";
import { soundFx } from "@/lib/soundFx";
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

  const [smallGlassOpen, setSmallGlassOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Wheel Drag State
  const [isDragging, setIsDragging] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const lastXRef = useRef<number | null>(null);
  const accumulatedDistance = useRef<number>(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isUtilityPage = pathname === "/downloads" || pathname === "/me" || pathname === "/explore";

  const activeIdx = CATEGORIES.findIndex((c) => c.href === pathname);
  const baseIndex = activeIdx === -1 ? 0 : activeIdx;
  const N = CATEGORIES.length;

  const currentIndex = isDragging ? previewIndex : baseIndex;

  useEffect(() => {
    if (!isDragging) {
      setPreviewIndex(baseIndex);
    }
  }, [baseIndex, isDragging]);

  const loopOffsets = [-2, -1, 0, 1, 2];
  const visibleCategories = loopOffsets.map((offset) => {
    const rawIndex = (currentIndex + offset) % N;
    const realIndex = rawIndex < 0 ? rawIndex + N : rawIndex;
    return {
      ...CATEGORIES[realIndex],
      realIndex,
      isCenter: offset === 0,
      offset,
    };
  });

  // MECHANICAL ACCUMULATOR (Every 12px produces a physical tooth click)
  const STEP_PIXELS = 12;

  const handleDragStart = (clientX: number) => {
    if (isUtilityPage) return;
    setIsDragging(true);
    lastXRef.current = clientX;
    accumulatedDistance.current = 0;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging || lastXRef.current === null) return;
    const deltaX = clientX - lastXRef.current;
    lastXRef.current = clientX;

    accumulatedDistance.current += deltaX;

    if (Math.abs(accumulatedDistance.current) >= STEP_PIXELS) {
      const steps = Math.trunc(accumulatedDistance.current / STEP_PIXELS);
      accumulatedDistance.current -= steps * STEP_PIXELS;

      const shift = -steps;

      setPreviewIndex((prev) => {
        const next = (prev + shift) % N;
        const normalized = next < 0 ? next + N : next;
        
        // FIRING MECHANICAL GEAR TICK
        soundFx.playMechanicalTick();
        if (navigator.vibrate) navigator.vibrate(6);

        return normalized;
      });
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    lastXRef.current = null;
    accumulatedDistance.current = 0;

    const targetCategory = CATEGORIES[previewIndex];
    if (targetCategory && targetCategory.href !== pathname) {
      soundFx.playCinematicWhoosh();
      router.push(targetCategory.href);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSmallGlassOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleSearchAction = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      setSmallGlassOpen(false);
      soundFx.playCinematicWhoosh();
      openSearch();
    } else {
      clickTimer.current = setTimeout(() => {
        clickTimer.current = null;
        soundFx.playCinematicPop();
        setSmallGlassOpen((prev) => {
          const next = !prev;
          if (next) setTimeout(() => inputRef.current?.focus(), 120);
          return next;
        });
      }, 260);
    }
  };

  const getPageTitle = () => {
    if (pathname === "/downloads") return "DOWNLOADS";
    if (pathname === "/me") return "PROFILE";
    if (pathname === "/explore") return "EXPLORE";
    return CATEGORIES.find((cat) => cat.href === pathname)?.label.toUpperCase() || "HOME";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#08080c]/85 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-2 transition-all select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between gap-1 sm:gap-2 h-10">
          
          {/* Left: Brand */}
          <div className="flex-none">
            <Link
              href="/"
              onClick={() => soundFx.playCinematicPop()}
              className="font-black text-base sm:text-lg tracking-wider text-white uppercase group"
            >
              <span>SPECTRA</span>
            </Link>
          </div>

          {/* Middle: Continuous Mechanical Wheel */}
          <div
            className="flex-1 max-w-[240px] sm:max-w-md mx-auto overflow-hidden relative cursor-grab active:cursor-grabbing touch-none select-none"
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
            onTouchEnd={handleDragEnd}
            onTouchCancel={handleDragEnd}
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onMouseMove={(e) => handleDragMove(e.clientX)}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
          >
            {isUtilityPage ? (
              <div className="flex justify-center">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] border border-white/25 backdrop-blur-xl shadow-[0_0_16px_rgba(255,255,255,0.15)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                  <span className="text-[10px] sm:text-[11px] font-black text-white uppercase tracking-widest">
                    {getPageTitle()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="relative flex items-center justify-center pointer-events-none">
                <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#08080c] to-transparent z-20 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#08080c] to-transparent z-20 pointer-events-none" />

                <div className="flex items-center justify-center gap-1.5 sm:gap-2 overflow-visible py-0.5">
                  {visibleCategories.map((item, index) => {
                    const CatIcon = item.icon;
                    const isCenter = item.isCenter;

                    return (
                      <div
                        key={`${item.label}-${index}`}
                        className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 rounded-full text-[11px] sm:text-xs whitespace-nowrap transition-all duration-100 select-none ${
                          isCenter
                            ? "bg-white text-black border border-white shadow-[0_0_24px_rgba(255,255,255,0.85),inset_0_1px_1px_#ffffff] scale-100 z-10 font-black cursor-default"
                            : "bg-white/[0.04] text-zinc-400 border border-white/[0.08] shadow-[0_0_8px_rgba(255,255,255,0.03)] scale-90 opacity-60"
                        }`}
                      >
                        <CatIcon
                          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-colors ${
                            isCenter ? "text-black fill-black" : "text-zinc-400"
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: Search Capsule */}
          <div className="flex-none relative" ref={containerRef}>
            <div
              onClick={handleSearchAction}
              className={`flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-full border transition-all cursor-pointer select-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] active:scale-95 ${
                smallGlassOpen
                  ? "bg-white text-black border-white shadow-glow"
                  : "bg-white/[0.07] hover:bg-white/[0.12] border-white/15 text-zinc-300"
              }`}
            >
              <Search className={`w-3.5 h-3.5 ${smallGlassOpen ? "text-black" : "text-zinc-400"}`} />
              <span className={`text-[10px] sm:text-xs font-medium hidden sm:inline ${smallGlassOpen ? "text-black font-bold" : "text-zinc-400"}`}>
                Search..
              </span>
              <Mic className={`w-3 h-3 ${smallGlassOpen ? "text-black" : "text-zinc-500"}`} />
            </div>

            {/* Mini Popover */}
            {smallGlassOpen && (
              <div
                className="absolute top-12 right-0 w-72 sm:w-80 rounded-2xl p-2.5 bg-[#09090e]/95 backdrop-blur-3xl border border-white/25 shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50 space-y-2 animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 pointer-events-none" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search titles..."
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
                        soundFx.playCinematicWhoosh();
                        openSearch();
                      }}
                      className="p-1 rounded text-zinc-400 hover:text-white"
                    >
                      <Maximize2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="max-h-56 overflow-y-auto no-scrollbar space-y-1">
                  {loading && (
                    <div className="py-3 text-center text-[10px] text-zinc-400">
                      Searching...
                    </div>
                  )}

                  {results.map((item) => {
                    const itemTitle = item.title || item.name || "Untitled";
                    const poster = item.poster_path ? `${IMAGE_BASE}/w92${item.poster_path}` : null;

                    return (
                      <div
                        key={`${item.media_type}-${item.id}`}
                        onClick={() => {
                          soundFx.playCinematicPop();
                          setSmallGlassOpen(false);
                          router.push(`/details/${item.id}?type=${item.media_type}`);
                        }}
                        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/10 transition cursor-pointer"
                      >
                        <div className="relative w-7 h-9 rounded-md overflow-hidden bg-zinc-950 flex-none border border-white/10">
                          {poster ? (
                            <Image src={poster} alt={itemTitle} fill className="object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-[8px] text-zinc-600">N/A</div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-[11px] font-bold text-white truncate">{itemTitle}</h4>
                          <span className="text-[9px] text-zinc-400 uppercase">
                            {item.media_type === "tv" ? "Series" : "Movie"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
