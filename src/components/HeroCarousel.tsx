"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Info, ChevronLeft, ChevronRight, Star, Volume2 } from "lucide-react";
import { MediaItem, IMAGE_BASE } from "@/lib/tmdb";
import { soundFx } from "@/lib/soundFx";

interface HeroCarouselProps {
  items: MediaItem[];
  defaultType?: "movie" | "tv";
  badgePrefix?: string;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  items,
  defaultType = "movie",
  badgePrefix = "Featured",
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const slides = items.slice(0, 10);

  // Auto-advance every 6 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const current = slides[currentIdx];
  const mediaType = current.media_type || defaultType;

  const nextSlide = () => {
    soundFx.playMechanicalTick();
    setCurrentIdx((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    soundFx.playMechanicalTick();
    setCurrentIdx((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative aspect-[16/10] sm:aspect-[21/9] w-full rounded-3xl overflow-hidden border border-white/15 bg-black shadow-2xl group select-none">
      {/* Backdrop Image */}
      {current.backdrop_path || current.poster_path ? (
        <Image
          src={`${IMAGE_BASE}/w1280${current.backdrop_path || current.poster_path}`}
          alt={current.title || current.name || "Slide"}
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

      {/* Left/Right Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-white text-white hover:text-black border border-white/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-white text-white hover:text-black border border-white/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition z-20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Slide Content Overlay */}
      <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-8 max-w-xl space-y-2 z-10">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-black font-black text-[9px] uppercase tracking-wider">
            {badgePrefix} #{currentIdx + 1}
          </span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-white font-mono text-[9px] border border-white/20 flex items-center gap-1">
            <Volume2 className="w-2.5 h-2.5 text-emerald-400" />
            <span>Hindi • Tamil • Telugu • English</span>
          </span>
          {current.vote_average ? (
            <span className="px-1.5 py-0.5 rounded-full bg-black/60 text-white font-bold text-[9px] border border-white/15 flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              <span>{current.vote_average.toFixed(1)}</span>
            </span>
          ) : null}
        </div>

        <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight drop-shadow truncate">
          {current.title || current.name}
        </h1>

        <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed max-w-md">
          {current.overview || "Stream now in 4K Ultra-HD with low-latency Indian servers."}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <Link
            href={
              mediaType === "tv"
                ? `/watch/${current.id}?type=tv&season=1&episode=1`
                : `/watch/${current.id}?type=movie`
            }
            onClick={() => soundFx.playCinematicSwell()}
            className="px-4 py-2 rounded-xl bg-white text-black font-black text-xs shadow-glow hover:bg-zinc-200 active:scale-95 transition flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-black text-black" />
            <span>Stream Now</span>
          </Link>

          <Link
            href={`/details/${current.id}?type=${mediaType}`}
            onClick={() => soundFx.playCinematicPop()}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs backdrop-blur-xl transition flex items-center gap-1.5"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Dossier</span>
          </Link>
        </div>
      </div>

      {/* Slide Dots Indicator */}
      <div className="absolute bottom-3 right-4 sm:bottom-6 sm:right-8 flex items-center gap-1.5 z-20">
        {slides.map((_, dotIdx) => (
          <button
            key={dotIdx}
            onClick={() => {
              soundFx.playMechanicalTick();
              setCurrentIdx(dotIdx);
            }}
            className={`h-1 rounded-full transition-all ${
              currentIdx === dotIdx ? "w-5 bg-white shadow-glow" : "w-1.5 bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${dotIdx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
