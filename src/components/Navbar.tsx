"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, Sparkles, Film, Tv, Radio, Flame, Mic, X, Maximize2 } from "lucide-react";
import { useSearch } from "@/context/SearchContext";
import { soundFx } from "@/lib/soundFx";

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

  const [isDragging, setIsDragging] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const lastXRef = useRef<number | null>(null);
  const accumulatedDistance = useRef<number>(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // COMPLETELY HIDE NAVBAR on Details and Watch player pages
  if (pathname.startsWith("/details") || pathname.startsWith("/watch")) {
    return null;
  }

  const isUtilityPage = pathname === "/downloads" || pathname === "/me" || pathname === "/explore";
  const activeIdx = CATEGORIES.findIndex((c) => c.href === pathname);
  const baseIndex = activeIdx === -1 ? 0 : activeIdx;
  const N = CATEGORIES.length;
  const currentIndex = isDragging ? previewIndex : baseIndex;

  useEffect(() => {
    if (!isDragging) setPreviewIndex(baseIndex);
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

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#08080c]/85 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-2 transition-all select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between gap-1 sm:gap-2 h-10">
          <div className="flex-none">
            <Link
              href="/"
              onClick={() => soundFx.playCinematicPop()}
              className="font-black text-base sm:text-lg tracking-wider text-white uppercase"
            >
              <span>SPECTRA</span>
            </Link>
          </div>

          <div
            className="flex-1 max-w-[240px] sm:max-w-md mx-auto overflow-hidden relative cursor-grab active:cursor-grabbing touch-none select-none"
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
            onTouchEnd={handleDragEnd}
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onMouseMove={(e) => handleDragMove(e.clientX)}
            onMouseUp={handleDragEnd}
          >
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
          </div>

          <div className="flex-none">
            <button
              onClick={() => {
                soundFx.playCinematicWhoosh();
                openSearch();
              }}
              className="p-2 rounded-full bg-white/[0.07] hover:bg-white/[0.12] border border-white/15 text-zinc-300"
            >
              <Search className="w-3.5 h-3.5 text-zinc-300" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
