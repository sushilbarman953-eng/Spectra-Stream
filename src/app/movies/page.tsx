"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Film,
  Flame,
  Globe2,
  Clapperboard,
  Sparkles,
  ChevronRight,
  Compass,
} from "lucide-react";
import {
  MediaItem,
  BOLLYWOOD_CATALOG,
  SOUTH_INDIAN_CATALOG,
  HOLLYWOOD_CATALOG,
  REGIONAL_CATALOG,
  BACKUP_HINDI_MOVIES,
} from "@/lib/tmdb";
import { HeroCarousel } from "@/components/HeroCarousel";
import { FilterableRankedShelf } from "@/components/FilterableRankedShelf";
import { MediaPosterCard } from "@/components/MediaPosterCard";
import { StudioFranchiseHubs } from "@/components/StudioFranchiseHubs";
import {
  StarSpotlightCapsules,
  INDIAN_MOVIE_STARS,
  HOLLYWOOD_MOVIE_STARS,
} from "@/components/StarSpotlightCapsules";
import { soundFx } from "@/lib/soundFx";

const MOVIE_GENRE_PILLS = [
  { id: "all", label: "All" },
  { id: "action", label: "Action" },
  { id: "comedy", label: "Comedy" },
  { id: "romance", label: "Romance" },
  { id: "scifi", label: "Sci-Fi" },
  { id: "thriller", label: "Thriller" },
  { id: "horror", label: "Horror" },
  { id: "drama", label: "Drama" },
];

export default function MoviesPage() {
  const [activeGenre, setActiveGenre] = useState<string>("all");

  const trendingTabs = [
    { id: "top_hits", label: "Top Hits" },
    { id: "cinema", label: "Cinema" },
    { id: "bollywood", label: "Bollywood" },
    { id: "south", label: "South" },
    { id: "hollywood", label: "Hollywood" },
  ];

  const trendingByTab: Record<string, MediaItem[]> = {
    top_hits: [BOLLYWOOD_CATALOG[0], SOUTH_INDIAN_CATALOG[0], HOLLYWOOD_CATALOG[0], BOLLYWOOD_CATALOG[1], SOUTH_INDIAN_CATALOG[1]],
    cinema: BACKUP_HINDI_MOVIES,
    bollywood: BOLLYWOOD_CATALOG,
    south: SOUTH_INDIAN_CATALOG,
    hollywood: HOLLYWOOD_CATALOG,
  };

  const renderSectionShelf = (
    title: string,
    items: MediaItem[],
    icon: any,
    viewAllHref: string = "/explore"
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
          {items.map((item, idx) => (
            <MediaPosterCard
              key={`${title}-${item.id}-${idx}`}
              item={item}
              defaultType="movie"
            />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-[#08080c] text-white pt-2 pb-28 px-3 sm:px-6 flex flex-col gap-7 max-w-7xl mx-auto">
      {/* 00. Hero Carousel */}
      <section className="w-full">
        <HeroCarousel items={HOLLYWOOD_CATALOG.concat(BOLLYWOOD_CATALOG.slice(0, 3))} />
      </section>

      {/* 01. Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
        {MOVIE_GENRE_PILLS.map((pill) => {
          const isSelected = activeGenre === pill.id;
          return (
            <button
              key={pill.id}
              onClick={() => {
                soundFx.playMechanicalTick();
                setActiveGenre(pill.id);
              }}
              className={`flex items-center px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                isSelected
                  ? "bg-white text-black border-white shadow-glow font-black scale-100"
                  : "bg-white/[0.05] hover:bg-white/10 text-zinc-300 border-white/10 scale-95"
              }`}
            >
              <span>{pill.label}</span>
            </button>
          );
        })}
      </div>

      {/* 02. Trending Movies */}
      <FilterableRankedShelf
        title="Trending Movies"
        tabs={trendingTabs}
        itemsByTab={trendingByTab}
        allLinkHref="/explore"
        defaultType="movie"
      />

      {/* 03. Franchise Spotlights */}
      {renderSectionShelf("Franchise Spotlights", HOLLYWOOD_CATALOG.slice(2, 6), Sparkles)}

      {/* 04. Studio Franchises & Brand Hubs */}
      <StudioFranchiseHubs />

      {/* 05. Hollywood */}
      {renderSectionShelf("Hollywood", HOLLYWOOD_CATALOG, Globe2)}

      {/* 06. Bollywood */}
      {renderSectionShelf("Bollywood", BOLLYWOOD_CATALOG, Film)}

      {/* 07. South Indian */}
      {renderSectionShelf("South Indian", SOUTH_INDIAN_CATALOG, Clapperboard)}

      {/* 08. Regional Hits */}
      {renderSectionShelf("Regional Hits", REGIONAL_CATALOG, Flame)}

      {/* 09. Indian Stars */}
      <StarSpotlightCapsules
        title="Indian Stars"
        subtitle="Movie Headliners"
        stars={INDIAN_MOVIE_STARS}
      />

      {/* 10. Hollywood Stars Showcase */}
      <StarSpotlightCapsules
        title="Hollywood Stars Showcase"
        subtitle="Global Spotlight"
        stars={HOLLYWOOD_MOVIE_STARS}
      />

      {/* 11. Random Movies */}
      {renderSectionShelf(
        "Random Movies",
        [
          BOLLYWOOD_CATALOG[4],
          SOUTH_INDIAN_CATALOG[2],
          HOLLYWOOD_CATALOG[1],
          SOUTH_INDIAN_CATALOG[4],
          BOLLYWOOD_CATALOG[2],
        ],
        Compass
      )}
    </div>
  );
}
