"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Plus, Check } from "lucide-react";
import { MediaItem, IMAGE_BASE } from "@/lib/tmdb";
import { watchlistManager } from "@/lib/watchlistManager";
import { soundFx } from "@/lib/soundFx";

interface HeroCarouselProps {
  items: MediaItem[];
}

export function HeroCarousel({ items }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Touch swipe coordinates
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const carouselItems = items.slice(0, 10);
  const currentItem = carouselItems[activeIndex] || carouselItems[0];

  useEffect(() => {
    if (!currentItem) return;
    setInWatchlist(watchlistManager.has(currentItem.id));
  }, [currentItem]);

  // Automatic 10-second rotation interval
  useEffect(() => {
    if (isPaused || carouselItems.length <= 1) return;

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % carouselItems.length);
    }, 10000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, carouselItems.length]);

  // Touch Swipe Handlers (Prevents tab changing and cycles posters)
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.touches[0].clientX;
    const diffY = touchStartY.current - e.touches[0].clientY;

    // If horizontal swipe is dominant, stop event propagation so global tabs don't change
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      e.stopPropagation();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStartX.current === null || touchStartY.current === null) return;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = touchStartX.current - endX;
    const diffY = touchStartY.current - endY;

    // Horizontal swipe threshold: 40px
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      e.stopPropagation();
      soundFx.playMechanicalTick();
      if (diffX > 0) {
        // Swiped Left -> Next poster
        setActiveIndex((prev) => (prev + 1) % carouselItems.length);
      } else {
        // Swiped Right -> Previous poster
        setActiveIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (!currentItem) return null;

  const rawBackdrop = currentItem.backdrop_path || currentItem.poster_path;
  const backdropUrl = rawBackdrop
    ? rawBackdrop.startsWith("http")
      ? rawBackdrop
      : `${IMAGE_BASE}/w1280${rawBackdrop}`
    : null;

  const rawPoster = currentItem.poster_path;
  const posterUrl = rawPoster
    ? rawPoster.startsWith("http")
      ? rawPoster
      : `${IMAGE_BASE}/w342${rawPoster}`
    : null;

  const itemType = currentItem.media_type || "movie";
  const title = currentItem.title || currentItem.name || "Featured Title";
  const releaseYear = (currentItem.release_date || currentItem.first_air_date || "2026").slice(0, 4);

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
      className="relative w-full rounded-3xl bg-black select-none border border-white/10 shadow-2xl pt-2 touch-pan-y"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. Backdrop Banner */}
      <Link
        href={`/details/${currentItem.id}?type=${itemType}`}
        onClick={() => soundFx.playCinematicWhoosh()}
        className="block relative aspect-[16/10] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden"
      >
        {backdropUrl && (
          <Image
            src={backdropUrl}
            alt={title}
            fill
            priority
            unoptimized
            className="object-cover object-top transition-all duration-700 brightness-100 contrast-100"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
      </Link>

      {/* 2. Capsule with Large Dominant Poster */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 z-20">
        <div className="rounded-2xl p-2.5 sm:p-3 bg-black/60 backdrop-blur-2xl border border-white/20 shadow-[0_10px_35px_rgba(0,0,0,0.85)] flex items-end gap-3.5">
          
          {/* Prominent Large Poster Thumbnail */}
          <Link
            href={`/details/${currentItem.id}?type=${itemType}`}
            onClick={() => soundFx.playCinematicPop()}
            className="relative w-20 sm:w-24 aspect-[2/3] -mt-10 sm:-mt-14 rounded-2xl overflow-hidden bg-zinc-950 border-2 border-white/35 flex-none shadow-[0_8px_24px_rgba(0,0,0,0.9)] hover:scale-105 transition"
          >
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={title}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[9px] text-zinc-500">
                Poster
              </div>
            )}
          </Link>

          {/* Right Section: Title, Badges, and Action Strip */}
          <div className="flex-1 min-w-0 flex flex-col justify-between gap-1.5 pb-0.5">
            {/* Title & Metadata */}
            <div className="min-w-0">
              <Link
                href={`/details/${currentItem.id}?type=${itemType}`}
                onClick={() => soundFx.playCinematicPop()}
                className="block truncate"
              >
                <h3 className="text-sm sm:text-base font-black text-white truncate hover:text-red-300 transition">
                  {title} <span className="text-[11px] text-zinc-400 font-medium">[Hindi]</span>
                </h3>
              </Link>
              <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono text-zinc-300 pt-0.5">
                <span>{releaseYear}</span>
                <span className="text-zinc-600">•</span>
                <span className="px-1.5 py-0.2 rounded bg-white/10 text-white font-medium border border-white/10">
                  Action
                </span>
              </div>
            </div>

            {/* Bottom Controls Shifted to the Right */}
            <div className="flex items-center justify-between pt-0.5">
              <div className="flex items-center gap-1.5">
                <Link
                  href={
                    itemType === "tv"
                      ? `/watch/${currentItem.id}?type=tv&season=1&episode=1`
                      : `/watch/${currentItem.id}?type=movie`
                  }
                  onClick={() => soundFx.playCinematicSwell()}
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/[0.16] hover:bg-white/[0.26] border border-white/30 backdrop-blur-xl text-white font-black text-[11px] transition active:scale-95 shadow-md"
                >
                  <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                    <Play className="w-2 h-2 fill-black text-black ml-0.5" />
                  </div>
                  <span>Play</span>
                </Link>

                <button
                  onClick={toggleWatchlist}
                  className={`p-1.5 rounded-full border transition active:scale-95 backdrop-blur-xl ${
                    inWatchlist
                      ? "bg-red-500/25 border-red-500/50 text-red-300"
                      : "bg-white/10 hover:bg-white/20 border-white/25 text-white"
                  }`}
                  title={inWatchlist ? "Remove from List" : "Add to List"}
                  aria-label="Add to List"
                >
                  {inWatchlist ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  )}
                </button>
              </div>

              {/* Progress Indicators */}
              <div className="flex items-center gap-1 pr-1">
                {carouselItems.map((_, idx) => (
                  <button
                    key={`dot-${idx}`}
                    onClick={() => {
                      soundFx.playMechanicalTick();
                      setActiveIndex(idx);
                    }}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      activeIndex === idx
                        ? "w-3.5 bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]"
                        : "w-1 bg-white/25 hover:bg-white/50"
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
