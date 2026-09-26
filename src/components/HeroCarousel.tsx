"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Plus, Check, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { MediaItem, IMAGE_BASE } from "@/lib/tmdb";
import { GlassButton } from "@/components/ui/GlassButton";

interface HeroCarouselProps {
  items: MediaItem[];
  type: "movie" | "tv";
}

export const HeroCarousel = ({ items, type }: HeroCarouselProps) => {
  const top10 = items.slice(0, 10);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [watchlist, setWatchlist] = useState<number[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("spectra_watchlist");
      if (stored) setWatchlist(JSON.parse(stored).map((i: any) => i.id));
    } catch {
      // Storage access
    }
  }, []);

  useEffect(() => {
    if (top10.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % top10.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [top10.length]);

  if (!top10.length) return null;
  const active = top10[currentIndex];
  const title = active.title || active.name || "Featured Title";
  const backdropUrl = active.backdrop_path
    ? `${IMAGE_BASE}/original${active.backdrop_path}`
    : active.poster_path
    ? `${IMAGE_BASE}/original${active.poster_path}`
    : null;

  const isSaved = watchlist.includes(active.id);

  const toggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const stored = localStorage.getItem("spectra_watchlist");
      const currentList: MediaItem[] = stored ? JSON.parse(stored) : [];
      let updated: MediaItem[];

      if (isSaved) {
        updated = currentList.filter((item) => item.id !== active.id);
        setWatchlist((prev) => prev.filter((id) => id !== active.id));
      } else {
        updated = [active, ...currentList];
        setWatchlist((prev) => [...prev, active.id]);
      }
      localStorage.setItem("spectra_watchlist", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative w-full h-[52vh] sm:h-[60vh] max-h-[580px] rounded-3xl overflow-hidden border border-white/15 bg-black shadow-2xl group">
      {/* Background Image clickable to details */}
      <Link href={`/details/${active.id}?type=${type}`} className="absolute inset-0">
        {backdropUrl && (
          <Image
            src={backdropUrl}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-top opacity-60 group-hover:scale-105 transition-all duration-700 ease-out"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08080a] via-black/60 to-transparent" />
      </Link>

      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 max-w-2xl space-y-3 z-10 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/20 text-white backdrop-blur-md border border-white/20">
            Top #{currentIndex + 1}
          </span>
          {active.vote_average > 0 && (
            <div className="flex items-center gap-1 text-xs font-semibold text-zinc-200 bg-black/60 px-2 py-0.5 rounded-md border border-white/15">
              <Star className="w-3 h-3 text-white fill-white" />
              {active.vote_average.toFixed(1)}
            </div>
          )}
        </div>

        <Link href={`/details/${active.id}?type=${type}`} className="pointer-events-auto">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight hover:underline">
            {title}
          </h2>
        </Link>

        <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 sm:line-clamp-3 leading-relaxed">
          {active.overview || "Stream this title now on Spectra."}
        </p>

        {/* Play & Add To List Frosted Glass Action Buttons */}
        <div className="flex items-center gap-3 pt-2 pointer-events-auto">
          <Link href={`/details/${active.id}?type=${type}`}>
            <GlassButton variant="primary" className="text-xs py-2 px-5 font-bold shadow-glow flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Play</span>
            </GlassButton>
          </Link>

          <button
            onClick={toggleWatchlist}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition ${
              isSaved
                ? "bg-white/20 text-white border-white/40"
                : "bg-white/10 text-zinc-200 border-white/20 hover:bg-white/20 hover:text-white"
            }`}
          >
            {isSaved ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{isSaved ? "In List" : "Add to List"}</span>
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev - 1 + top10.length) % top10.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full glass-panel border border-white/15 text-white/70 hover:text-white transition z-20"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % top10.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full glass-panel border border-white/15 text-white/70 hover:text-white transition z-20"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Bottom Pips */}
      <div className="absolute bottom-3 right-6 flex items-center gap-1.5 z-20">
        {top10.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1 rounded-full transition-all duration-300 ${
              currentIndex === i ? "w-6 bg-white" : "w-1.5 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
