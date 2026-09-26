"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Plus, Check, Star } from "lucide-react";
import { MediaItem, IMAGE_BASE } from "@/lib/tmdb";
import { watchlistManager } from "@/lib/watchlistManager";
import { soundFx } from "@/lib/soundFx";

interface HeroCarouselProps {
  items: MediaItem[];
  defaultType?: "movie" | "tv";
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  items,
  defaultType = "movie",
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slides = items.slice(0, 10);
  const current = slides[currentIdx] || items[0];

  // 10-second auto-timer with pause-on-touch/hover
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  if (!current) return null;

  const mediaType = current.media_type || defaultType;
  const inWatchlist = watchlistManager.has(current.id);

  const handleToggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    soundFx.playCinematicPop();
    if (inWatchlist) {
      watchlistManager.remove(current.id);
    } else {
      watchlistManager.add({
        id: String(current.id),
        title: current.title || current.name || "Title",
        type: mediaType,
        posterPath: current.poster_path,
        voteAverage: current.vote_average,
        addedAt: Date.now(),
      });
    }
  };

  return (
    <div
      data-no-swipe="true"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      className="relative aspect-[16/10] sm:aspect-[21/9] w-full rounded-3xl overflow-hidden border border-white/15 bg-black shadow-2xl select-none group"
    >
      {/* Background Poster / Backdrop */}
      {current.backdrop_path || current.poster_path ? (
        <Image
          src={
            current.backdrop_path?.startsWith("http")
              ? current.backdrop_path
              : `${IMAGE_BASE}/w1280${current.backdrop_path || current.poster_path}`
          }
          alt={current.title || current.name || "Hero"}
          fill
          priority
          unoptimized
          className="object-cover object-top transition-all duration-700 ease-out"
        />
      ) : (
        <div className="w-full h-full bg-zinc-900" />
      )}

      {/* Dark Vignette Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent hidden sm:block" />

      {/* Content Overlay */}
      <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-7 max-w-xl space-y-2 z-10">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-white text-black font-black text-[9px] uppercase tracking-wider">
            TOP #{currentIdx + 1}
          </span>
          {current.vote_average ? (
            <span className="px-1.5 py-0.5 rounded-full bg-black/60 text-white font-bold text-[9px] border border-white/15 flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5 fill-white text-white" />
              <span>{current.vote_average.toFixed(1)}</span>
            </span>
          ) : null}
        </div>

        <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight drop-shadow truncate">
          {current.title || current.name}
        </h1>

        <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed max-w-md">
          {current.overview || "Stream now in ultra high definition."}
        </p>

        {/* Action Buttons: ► Play (Opens Details) & + Add to List */}
        <div className="flex items-center gap-2 pt-1">
          <Link
            href={`/details/${current.id}?type=${mediaType}`}
            onClick={() => soundFx.playCinematicSwell()}
            className="px-5 py-2 rounded-xl bg-white text-black font-black text-xs shadow-glow hover:bg-zinc-200 active:scale-95 transition flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-black text-black" />
            <span>Play</span>
          </Link>

          <button
            onClick={handleToggleWatchlist}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs backdrop-blur-xl active:scale-95 transition flex items-center gap-1.5"
          >
            {inWatchlist ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{inWatchlist ? "In List" : "Add to List"}</span>
          </button>
        </div>
      </div>

      {/* Slide Indicators on Bottom-Right */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-7 flex items-center gap-1.5 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              soundFx.playMechanicalTick();
              setCurrentIdx(idx);
            }}
            className={`h-1 rounded-full transition-all ${
              currentIdx === idx ? "w-5 bg-white shadow-glow" : "w-1.5 bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
