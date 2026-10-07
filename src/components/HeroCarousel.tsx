"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Play, Plus, Check } from "lucide-react";
import { MediaItem } from "@/lib/tmdb";
import { watchlistManager } from "@/lib/watchlistManager";
import { soundFx } from "@/lib/soundFx";
import { SafeImage } from "@/components/SafeImage";

interface HeroCarouselProps {
  items?: MediaItem[];
}

export function HeroCarousel({ items }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Safe fallback to prevent undefined.slice crashes
  const safeItems = Array.isArray(items) ? items : [];
  const carouselItems = safeItems.slice(0, 8);
  const currentItem = carouselItems[activeIndex] || carouselItems[0];

  useEffect(() => {
    if (!currentItem) return;
    setInWatchlist(watchlistManager.has(currentItem.id));
  }, [currentItem]);

  useEffect(() => {
    if (isPaused || carouselItems.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % carouselItems.length);
    }, 8000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, carouselItems.length]);

  if (!currentItem) return null;

  const backdropUrl = currentItem.backdrop_path || currentItem.poster_path;
  const posterUrl = currentItem.poster_path || currentItem.backdrop_path;
  const itemType = currentItem.media_type || "movie";
  const title = currentItem.title || currentItem.name || "Featured Title";
  const releaseYear = (currentItem.release_date || currentItem.first_air_date || "2024").slice(0, 4);

  const toggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    soundFx.playCinematicPop();

    if (inWatchlist) {
      watchlistManager.remove(currentItem.id);
      setInWatchlist(false);
    } else {
      watchlistManager.add({
        id: String(currentItem.id),
        title,
        type: itemType,
        posterPath: currentItem.poster_path,
        voteAverage: currentItem.vote_average,
        addedAt: Date.now(),
      });
      setInWatchlist(true);
    }
  };

  return (
    <div
      className="relative w-full rounded-3xl bg-black select-none border border-white/10 shadow-2xl overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 16:9 Widescreen Backdrop */}
      <Link
        href={`/details/${currentItem.id}?type=${itemType}`}
        onClick={() => soundFx.playCinematicWhoosh()}
        className="block relative aspect-[16/9] sm:aspect-[21/9] w-full"
      >
        <SafeImage
          src={backdropUrl || undefined}
          alt={title}
          className="object-cover object-center brightness-95 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />
      </Link>

      {/* Floating Lower Capsule with 9:16 Vertical Poster */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 z-20">
        <div className="rounded-2xl p-2.5 sm:p-3 bg-black/70 backdrop-blur-2xl border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.9)] flex items-end gap-3.5">
          <Link
            href={`/details/${currentItem.id}?type=${itemType}`}
            onClick={() => soundFx.playCinematicPop()}
            className="relative w-16 sm:w-20 aspect-[2/3] -mt-10 sm:-mt-12 rounded-xl overflow-hidden bg-zinc-950 border-2 border-white/40 flex-none shadow-2xl hover:scale-105 transition"
          >
            <SafeImage
              src={posterUrl || undefined}
              alt={title}
              className="object-cover"
            />
          </Link>

          <div className="flex-1 min-w-0 flex flex-col justify-between gap-1 pb-0.5">
            <div>
              <h3 className="text-sm sm:text-base font-black text-white truncate">
                {title}
              </h3>
              <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-300 pt-0.5">
                <span>{releaseYear}</span>
                <span className="text-zinc-500">•</span>
                <span className="px-1.5 py-0.2 rounded bg-white/10 text-white font-medium border border-white/10">
                  {itemType === "tv" ? "Series" : "Movie"}
                </span>
                <span className="text-zinc-500">•</span>
                <span className="text-amber-400 font-bold">★ {currentItem.vote_average?.toFixed(1) || "8.5"}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <Link
                  href={
                    itemType === "tv"
                      ? `/watch/${currentItem.id}?type=tv&season=1&episode=1`
                      : `/watch/${currentItem.id}?type=movie`
                  }
                  onClick={() => soundFx.playCinematicSwell()}
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-white text-black font-black text-[11px] shadow-glow active:scale-95 transition"
                >
                  <Play className="w-3 h-3 fill-black text-black ml-0.5" />
                  <span>Play</span>
                </Link>

                <button
                  onClick={toggleWatchlist}
                  className={`p-1.5 rounded-full border transition active:scale-95 ${
                    inWatchlist
                      ? "bg-red-500/25 border-red-500/50 text-red-300"
                      : "bg-white/10 hover:bg-white/20 border-white/25 text-white"
                  }`}
                  aria-label="Add to List"
                >
                  {inWatchlist ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center gap-1 pr-1">
                {carouselItems.map((_, idx) => (
                  <button
                    key={`hero-dot-${idx}`}
                    onClick={() => {
                      soundFx.playMechanicalTick();
                      setActiveIndex(idx);
                    }}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      activeIndex === idx
                        ? "w-3.5 bg-white shadow-glow"
                        : "w-1 bg-white/25"
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
