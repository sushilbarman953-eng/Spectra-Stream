"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Plus, Check, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { MediaItem, IMAGE_BASE } from "@/lib/tmdb";
import { GlassButton } from "@/components/ui/GlassButton";
import { watchlistManager } from "@/lib/watchlistManager";

interface HeroCarouselProps {
  items: MediaItem[];
  type?: "movie" | "tv";
}

export const HeroCarousel = ({ items, type = "movie" }: HeroCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inWatchlist, setInWatchlist] = useState(false);

  const heroItems = items.slice(0, 5);
  const currentItem = heroItems[currentIndex];

  useEffect(() => {
    if (!currentItem) return;
    const checkState = () => {
      setInWatchlist(watchlistManager.isInList(currentItem.id));
    };
    checkState();
    window.addEventListener("spectra_watchlist_updated", checkState);
    return () => window.removeEventListener("spectra_watchlist_updated", checkState);
  }, [currentItem, currentIndex]);

  const handleToggleWatchlist = () => {
    if (!currentItem) return;
    const itemTitle = currentItem.title || currentItem.name || "Untitled";
    watchlistManager.toggle({
      id: currentItem.id,
      title: itemTitle,
      type: currentItem.media_type || type,
      posterPath: currentItem.poster_path,
      backdropPath: currentItem.backdrop_path,
      voteAverage: currentItem.vote_average,
      overview: currentItem.overview,
    });
  };

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % heroItems.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + heroItems.length) % heroItems.length);

  if (!currentItem) return null;

  const itemTitle = currentItem.title || currentItem.name || "Featured Title";
  const backdropUrl = currentItem.backdrop_path
    ? `${IMAGE_BASE}/w1280${currentItem.backdrop_path}`
    : null;

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden border border-white/15 shadow-2xl group select-none bg-black">
      {/* Backdrop Image */}
      {backdropUrl && (
        <Image
          src={backdropUrl}
          alt={itemTitle}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
      )}

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#08080c]/90 via-transparent to-transparent hidden md:block" />

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/15 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        title="Previous"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/15 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        title="Next"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Hero Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 space-y-3 z-10 max-w-2xl">
        {/* Badges */}
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-white text-black text-[10px] font-black uppercase tracking-wider">
            TOP #{currentIndex + 1}
          </span>
          {currentItem.vote_average > 0 && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold">
              <Star className="w-3 h-3 fill-white text-white" />
              <span>{currentItem.vote_average.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight line-clamp-1">
          {itemTitle}
        </h1>

        {/* Overview */}
        <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 leading-relaxed">
          {currentItem.overview || "Stream this title now in high-definition on Spectra Cinema."}
        </p>

        {/* Action Buttons: Play + Add to List */}
        <div className="flex items-center gap-3 pt-1">
          <Link href={`/watch/${currentItem.id}?type=${currentItem.media_type || type}`}>
            <GlassButton variant="primary" className="text-xs px-4 py-2 font-bold flex items-center gap-1.5 shadow-glow">
              <Play className="w-3.5 h-3.5 fill-black text-black" />
              <span>Play</span>
            </GlassButton>
          </Link>

          <button
            onClick={handleToggleWatchlist}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition border ${
              inWatchlist
                ? "bg-white text-black border-white shadow-glow"
                : "bg-white/10 hover:bg-white/20 text-white border-white/20"
            }`}
          >
            {inWatchlist ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{inWatchlist ? "In List" : "Add to List"}</span>
          </button>
        </div>
      </div>

      {/* Pagination Dash Dots */}
      <div className="absolute bottom-3 right-4 flex items-center gap-1.5 z-10">
        {heroItems.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1 rounded-full transition-all ${
              idx === currentIndex ? "w-5 bg-white shadow-glow" : "w-1.5 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
