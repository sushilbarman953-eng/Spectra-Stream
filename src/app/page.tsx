"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Flame,
  Film,
  Sparkles,
  Clapperboard,
  Tv,
  Globe2,
  ChevronRight,
  Star,
  Play,
} from "lucide-react";
import {
  MediaItem,
  IMAGE_BASE,
  BACKUP_HINDI_MOVIES,
  BACKUP_HINDI_SERIES,
  BOLLYWOOD_CATALOG,
  SOUTH_INDIAN_CATALOG,
  HOLLYWOOD_CATALOG,
} from "@/lib/tmdb";
import { HINDI_DUBBED_ANIME_CATALOG } from "@/lib/animeService";
import { playbackHistory, PlaybackProgressItem } from "@/lib/playbackHistory";
import { HeroCarousel } from "@/components/HeroCarousel";
import { soundFx } from "@/lib/soundFx";

const INDUSTRY_CHIPS = [
  { id: "all", label: "Cinema", icon: Flame },
  { id: "bollywood", label: "Bollywood", icon: Film },
  { id: "south", label: "South Indian", icon: Clapperboard },
  { id: "hollywood", label: "Hollywood", icon: Globe2 },
  { id: "drama", label: "Indian Drama", icon: Tv },
  { id: "anime", label: "Top Anime", icon: Sparkles },
];

export default function HomePage() {
  const [activeChip, setActiveChip] = useState("all");
  const [continueWatching, setContinueWatching] = useState<PlaybackProgressItem[]>([]);

  useEffect(() => {
    setContinueWatching(playbackHistory.getAll().slice(0, 4));
  }, []);

  const getHeroSelection = () => {
    switch (activeChip) {
      case "bollywood":
        return BOLLYWOOD_CATALOG;
      case "south":
        return SOUTH_INDIAN_CATALOG;
      case "hollywood":
        return HOLLYWOOD_CATALOG;
      case "drama":
        return BACKUP_HINDI_SERIES;
      case "anime":
        return HINDI_DUBBED_ANIME_CATALOG.slice(0, 6).map((a) => ({
          id: a.mal_id,
          title: a.title_english || a.title,
          overview: a.synopsis || "Hindi dubbed anime episode stream.",
          poster_path: a.images.jpg.large_image_url || a.images.jpg.image_url,
          backdrop_path: a.images.jpg.large_image_url,
          vote_average: a.score || 8.6,
          media_type: "tv" as const,
        }));
      default:
        return BACKUP_HINDI_MOVIES;
    }
  };

  const renderSectionShelf = (
    title: string,
    items: any[],
    icon: any,
    viewAllHref: string,
    isAnime = false
  ) => {
    const IconComp = icon;
    return (
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <IconComp className="w-4 h-4 text-red-500" />
            <h2 className="text-sm font-bold text-white tracking-wide">{title}</h2>
          </div>
          <Link
            href={viewAllHref}
            onClick={() => soundFx.playCinematicPop()}
            className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-0.5 transition"
          >
            <span>All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 px-0.5">
          {items.map((item, idx) => {
            const poster = item.poster_path
              ? item.poster_path.startsWith("http")
                ? item.poster_path
                : `${IMAGE_BASE}/w342${item.poster_path}`
              : null;
            const targetType = isAnime ? "tv" : item.media_type || "movie";
            const targetUrl = isAnime
              ? `/details/${item.id}?type=tv&source=anime`
              : `/details/${item.id}?type=${targetType}`;

            return (
              <Link
                key={`${item.id}-${idx}`}
                href={targetUrl}
                onClick={() => soundFx.playCinematicPop()}
                className="flex-none w-28 sm:w-32 group relative flex flex-col"
              >
                <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 group-hover:border-white/30 transition shadow-md group-hover:scale-[1.02]">
                  {poster ? (
                    <Image
                      src={poster}
                      alt={item.title || item.name || "Media Poster"}
                      fill
                      unoptimized
                      className="object-cover transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
                      Poster
                    </div>
                  )}

                  {/* Top-Right Language Pill */}
                  <div className="absolute top-1.5 right-1.5 z-10">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-black/75 backdrop-blur-md border border-white/20 text-zinc-200">
                      Hindi
                    </span>
                  </div>

                  {item.vote_average ? (
                    <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] text-white font-bold border border-white/15">
                      <Star className="w-2 h-2 fill-white text-white" />
                      {item.vote_average.toFixed(1)}
                    </div>
                  ) : null}
                </div>

                <h4 className="text-[11px] font-bold text-white truncate mt-1.5 group-hover:text-red-300 transition">
                  {item.title || item.name}
                </h4>
                <p className="text-[9px] text-zinc-400 font-mono truncate">
                  {(item.release_date || item.first_air_date || "2024").slice(0, 4)}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-[#08080c] text-white pt-11 pb-28 px-3 sm:px-6 flex flex-col gap-5 max-w-7xl mx-auto">
      {/* 1. Industry & Genre Filter Strip */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pt-2">
        {INDUSTRY_CHIPS.map((chip) => {
          const isSelected = activeChip === chip.id;
          const ChipIcon = chip.icon;
          return (
            <button
              key={chip.id}
              onClick={() => {
                soundFx.playMechanicalTick();
                setActiveChip(chip.id);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap border ${
                isSelected
                  ? "bg-white text-black border-white shadow-glow font-black scale-100"
                  : "bg-white/[0.05] hover:bg-white/10 text-zinc-300 border-white/10 scale-95"
              }`}
            >
              <ChipIcon className={`w-3.5 h-3.5 ${isSelected ? "text-black fill-black" : "text-zinc-400"}`} />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Dynamic Hero Carousel (Tied to selected industry category) */}
      <section className="w-full">
        <HeroCarousel items={getHeroSelection()} />
      </section>

      {/* 3. Continue Watching (if active history exists) */}
      {continueWatching.length > 0 && (
        <section className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-white tracking-wide">Continue Watching</h2>
            <Link href="/me" className="text-xs text-zinc-400 hover:text-white">
              All &gt;
            </Link>
          </div>
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {continueWatching.map((item) => (
              <Link
                key={item.id}
                href={
                  item.type === "tv"
                    ? `/watch/${item.tmdbId}?type=tv&season=${item.season || 1}&episode=${item.episode || 1}`
                    : `/watch/${item.tmdbId}?type=movie`
                }
                onClick={() => soundFx.playCinematicSwell()}
                className="flex-none w-48 sm:w-56 p-2 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1.5"
              >
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-zinc-950 flex items-center justify-center">
                  <Play className="w-5 h-5 fill-white text-white" />
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div className="h-full bg-red-500" style={{ width: `${item.progressPercent || 35}%` }} />
                  </div>
                </div>
                <h4 className="text-xs font-bold text-white truncate px-0.5">{item.title}</h4>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 4. Dedicated Industry Shelves */}
      {renderSectionShelf("Cinema", BACKUP_HINDI_MOVIES, Flame, "/movies")}
      {renderSectionShelf("Bollywood", BOLLYWOOD_CATALOG, Film, "/movies")}
      {renderSectionShelf("South Indian", SOUTH_INDIAN_CATALOG, Clapperboard, "/movies")}
      {renderSectionShelf("Hollywood", HOLLYWOOD_CATALOG, Globe2, "/movies")}
      {renderSectionShelf("Indian Drama", BACKUP_HINDI_SERIES, Tv, "/series")}
      {renderSectionShelf(
        "Top Anime",
        HINDI_DUBBED_ANIME_CATALOG.slice(0, 10).map((a) => ({
          id: a.mal_id,
          title: a.title_english || a.title,
          poster_path: a.images.jpg.image_url,
          vote_average: a.score,
          media_type: "tv",
        })),
        Sparkles,
        "/anime",
        true
      )}
    </div>
  );
}
