"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Search, Sparkles, Film, Tv, Radio, Flame, Mic, X, Maximize2, Star } from "lucide-react";
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

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const [isDragging, setIsDragging] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const lastXRef = useRef<number | null>(null);
  const accumulatedDistance = useRef<number>(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isDetails = pathname.startsWith("/details");
  const isWatch = pathname.startsWith("/watch");
  const isSubPage = isDetails || isWatch;
  const isUtilityPage = pathname === "/downloads" || pathname === "/me" || pathname === "/explore";

  const activeIdx = CATEGORIES.findIndex((c) => c.href === pathname);
  const baseIndex = activeIdx === -1 ? 0 : activeIdx;
  const N = CATEGORIES.length;

  const currentIndex = isDragging ? previewIndex : baseIndex;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDiff = currentScrollY - lastScrollY.current;

      if (Math.abs(scrollDiff) > 8) {
        if (currentScrollY > 40 && scrollDiff > 0) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isDragging) setPreviewIndex(baseIndex);
  }, [baseIndex, isDragging]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSmallGlassOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // INSTANT PER-CHARACTER SEARCH (100ms debounce)
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [query]);

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

  const STEP_PIXELS = 12;

  const handleDragStart = (clientX: number) => {
    if (isUtilityPage || isSubPage) return;
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

  const handleItemSelect = (item: any) => {
    soundFx.playCinematicPop();
    setSmallGlassOpen(false);
    setQuery("");

    if (item.media_type === "live_tv") {
      router.push("/tv");
    } else if (item.media_type === "anime") {
      router.push(`/details/${item.id}?type=tv&source=anime`);
    } else {
      router.push(`/details/${item.id}?type=${item.media_type || "movie"}`);
    }
  };

  const getPageTitle = () => {
    if (isWatch) return "SPECTRA PLAYER";
    if (isDetails) return "DOSSIER VIEW";
    if (pathname === "/downloads") return "DOWNLOADS";
    if (pathname === "/me") return "PROFILE";
    if (pathname === "/explore") return "EXPLORE";
    return CATEGORIES.find((cat) => cat.href === pathname)?.label.toUpperCase() || "HOME";
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 bg-[#08080c]/85 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-2 transition-all duration-300 ease-out select-none ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between gap-1 sm:gap-2 h-10">
          {/* Left Brand */}
          <div className="flex-none">
            <Link
              href="/"
              onClick={() => soundFx.playCinematicPop()}
              className="font-black text-base sm:text-lg tracking-wider text-white uppercase"
            >
              <span>SPECTRA</span>
            </Link>
          </div>

          {/* Middle: Category Wheel or Context Pill */}
          <div
            className="flex-1 max-w-[240px] sm:max-w-md mx-auto overflow-hidden relative cursor-grab active:cursor-grabbing touch-none select-none"
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
            onTouchEnd={handleDragEnd}
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onMouseMove={(e) => handleDragMove(e.clientX)}
            onMouseUp={handleDragEnd}
          >
            {isSubPage || isUtilityPage ? (
              <div className="flex justify-center">
                <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/20 backdrop-blur-xl shadow-glow">
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
                            ? "bg-white text-black border border-white shadow-[0_0_24px_rgba(255,255,255,0.85)] scale-100 z-10 font-black cursor-default"
                            : "bg-white/[0.04] text-zinc-400 border border-white/[0.08] scale-90 opacity-60"
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

          {/* Right: Search Button & Live Dropdown */}
          <div className="flex-none relative" ref={containerRef}>
            <button
              onClick={handleSearchAction}
              className={`p-2 rounded-full border transition-all select-none active:scale-95 ${
                smallGlassOpen
                  ? "bg-white text-black border-white shadow-glow"
                  : "bg-white/[0.07] hover:bg-white/[0.12] border-white/15 text-zinc-300"
              }`}
              aria-label="Search"
              title="Click once for mini search, twice for full screen"
            >
              <Search className={`w-3.5 h-3.5 ${smallGlassOpen ? "text-black" : "text-zinc-300"}`} />
            </button>

            {/* Live Search Popup Overlay */}
            {smallGlassOpen && (
              <div
                className="absolute top-12 right-0 w-80 sm:w-96 rounded-3xl p-3 bg-[#09090e]/95 backdrop-blur-3xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50 space-y-2.5 animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 pointer-events-none" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search movies, anime, series, live TV..."
                    className="w-full py-2 pl-9 pr-14 rounded-2xl text-xs text-white placeholder-zinc-400 bg-white/10 border border-white/20 focus:outline-none focus:border-white transition"
                  />
                  <div className="absolute right-2.5 flex items-center gap-1.5">
                    {query && (
                      <button
                        onClick={() => {
                          setQuery("");
                          setResults([]);
                        }}
                        className="p-1 rounded-full text-zinc-400 hover:text-white"
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
                      title="Fullscreen Modal"
                    >
                      <Maximize2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Instant Result Rows */}
                <div className="max-h-72 overflow-y-auto no-scrollbar space-y-1.5">
                  {loading && (
                    <div className="py-4 text-center text-[11px] text-zinc-400 font-mono">
                      Searching catalog...
                    </div>
                  )}

                  {!loading && query && results.length === 0 && (
                    <div className="py-4 text-center text-xs text-zinc-400">
                      No results for &ldquo;{query}&rdquo;
                    </div>
                  )}

                  {results.map((item) => {
                    const poster = item.poster_path
                      ? item.poster_path.startsWith("http")
                        ? item.poster_path
                        : `${IMAGE_BASE}/w92${item.poster_path}`
                      : null;

                    const mediaBadge =
                      item.media_type === "live_tv"
                        ? "LIVE TV"
                        : item.media_type === "anime"
                        ? "ANIME"
                        : item.media_type === "tv"
                        ? "SERIES"
                        : "MOVIE";

                    const badgeColor =
                      item.media_type === "live_tv"
                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                        : item.media_type === "anime"
                        ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                        : "bg-white/10 text-zinc-300 border-white/15";

                    return (
                      <div
                        key={`${item.media_type}-${item.id}`}
                        onClick={() => handleItemSelect(item)}
                        className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/10 border border-transparent hover:border-white/15 transition cursor-pointer group"
                      >
                        <div className="relative w-10 h-14 rounded-xl overflow-hidden bg-zinc-950 flex-none border border-white/15">
                          {poster ? (
                            <Image
                              src={poster}
                              alt={item.title}
                              fill
                              unoptimized
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-zinc-600">
                              {item.media_type === "live_tv" ? (
                                <Radio className="w-4 h-4 text-red-400" />
                              ) : (
                                <Film className="w-4 h-4 text-zinc-500" />
                              )}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                          <h4 className="text-xs font-bold text-white truncate group-hover:text-red-300 transition">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase font-mono ${badgeColor}`}
                            >
                              {mediaBadge}
                            </span>
                            {item.vote_average ? (
                              <span className="flex items-center gap-0.5 text-[9px] font-bold text-zinc-300">
                                <Star className="w-2.5 h-2.5 fill-white text-white" />
                                {item.vote_average.toFixed(1)}
                              </span>
                            ) : null}
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
      </div>
    </header>
  );
};
