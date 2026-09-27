"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Play, Compass, ArrowRight } from "lucide-react";
import {
  MediaItem,
  BACKUP_HINDI_MOVIES,
  BACKUP_HINDI_SERIES,
  EXTENDED_MOVIES_CATALOG,
  EXTENDED_SERIES_CATALOG,
} from "@/lib/tmdb";
import { playbackHistory, PlaybackProgressItem } from "@/lib/playbackHistory";
import { HeroCarousel } from "@/components/HeroCarousel";
import { FilterableRankedShelf } from "@/components/FilterableRankedShelf";
import { soundFx } from "@/lib/soundFx";

export default function HomePage() {
  const [heroItems, setHeroItems] = useState<MediaItem[]>([]);
  const [continueWatching, setContinueWatching] = useState<PlaybackProgressItem[]>([]);
  const [lastWatchedTitle, setLastWatchedTitle] = useState<string | null>(null);

  useEffect(() => {
    setHeroItems(BACKUP_HINDI_MOVIES.slice(0, 8));
    const history = playbackHistory.getAll();
    setContinueWatching(history.slice(0, 4));
    if (history.length > 0 && history[0].title) {
      setLastWatchedTitle(history[0].title);
    }
  }, []);

  // Filter dataset for "Trending Movies"
  const movieTabs = [
    { id: "top", label: "TOP Movies" },
    { id: "cinema", label: "Cinema" },
    { id: "bollywood", label: "Bollywood" },
    { id: "south", label: "South Indian" },
    { id: "hollywood", label: "Hollywood" },
  ];

  const movieItemsByTab: Record<string, MediaItem[]> = {
    top: EXTENDED_MOVIES_CATALOG.slice(0, 10),
    cinema: [...EXTENDED_MOVIES_CATALOG].reverse().slice(0, 10),
    bollywood: EXTENDED_MOVIES_CATALOG.filter((m) => m.audioLanguages?.includes("HIN")),
    south: EXTENDED_MOVIES_CATALOG.filter((m) => m.audioLanguages?.some((l) => ["TAM", "TEL"].includes(l))),
    hollywood: EXTENDED_MOVIES_CATALOG.filter((m) => m.audioLanguages?.includes("ENG")),
  };

  // Filter dataset for "Trending TV Series"
  const seriesTabs = [
    { id: "top_series", label: "Top Series" },
    { id: "indian_drama", label: "Indian Drama" },
    { id: "reality_tv", label: "Reality-TV" },
    { id: "hollywood_series", label: "International" },
  ];

  const seriesItemsByTab: Record<string, MediaItem[]> = {
    top_series: EXTENDED_SERIES_CATALOG.slice(0, 10),
    indian_drama: EXTENDED_SERIES_CATALOG.filter((s) => s.audioLanguages?.includes("HIN")),
    reality_tv: [...EXTENDED_SERIES_CATALOG].reverse().slice(0, 6),
    hollywood_series: EXTENDED_SERIES_CATALOG.filter((s) => s.audioLanguages?.includes("ENG")),
  };

  return (
    <div className="min-h-screen bg-[#08080c] text-white pt-11 pb-28 px-3 sm:px-6 flex flex-col gap-7 max-w-7xl mx-auto">
      {/* 1. Hero Carousel */}
      <section className="w-full m-0 p-0">
        <HeroCarousel items={heroItems} />
      </section>

      {/* 2. Continue Watching (if exists) */}
      {continueWatching.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-zinc-200">
                Continue Watching
              </h2>
            </div>
            <Link
              href="/me"
              onClick={() => soundFx.playCinematicPop()}
              className="text-[11px] font-bold text-zinc-400 hover:text-white transition flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {continueWatching.map((item) => (
              <Link
                key={item.id}
                href={
                  item.type === "tv"
                    ? `/watch/${item.tmdbId}?type=tv&season=${item.season || 1}&episode=${item.episode || 1}`
                    : `/watch/${item.tmdbId}?type=movie`
                }
                onClick={() => soundFx.playCinematicSwell()}
                className="flex-none w-48 sm:w-56 p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition group space-y-2 backdrop-blur-xl"
              >
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-zinc-950 flex items-center justify-center">
                  <Play className="w-6 h-6 fill-white text-white group-hover:scale-110 transition-transform" />
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${item.progressPercent || 35}%` }}
                    />
                  </div>
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {item.progressPercent || 35}% watched
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 3. Filterable Ranked Shelf: Trending Movies */}
      <section>
        <FilterableRankedShelf
          title="Trending Movies"
          tabs={movieTabs}
          itemsByTab={movieItemsByTab}
          allLinkHref="/movies"
          defaultType="movie"
        />
      </section>

      {/* 4. Filterable Ranked Shelf: Trending TV Series */}
      <section>
        <FilterableRankedShelf
          title="Trending TV Series"
          tabs={seriesTabs}
          itemsByTab={seriesItemsByTab}
          allLinkHref="/series"
          defaultType="tv"
        />
      </section>
    </div>
  );
}
