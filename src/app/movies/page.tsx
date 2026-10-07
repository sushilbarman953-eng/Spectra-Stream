"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Film,
  Flame,
  Globe2,
  Clapperboard,
  Sparkles,
  ChevronRight,
  Compass,
  Sliders,
} from "lucide-react";
import { MediaItem } from "@/lib/tmdb";
import { catalogManager, CustomCatalogState } from "@/lib/catalogManager";
import { HeroCarousel } from "@/components/HeroCarousel";
import { FilterableRankedShelf } from "@/components/FilterableRankedShelf";
import { MediaPosterCard } from "@/components/MediaPosterCard";
import { StudioFranchiseHubs } from "@/components/StudioFranchiseHubs";
import { StarSpotlightCapsules } from "@/components/StarSpotlightCapsules";
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
  const [catalog, setCatalog] = useState<CustomCatalogState | null>(null);

  useEffect(() => {
    const load = () => setCatalog(catalogManager.get());
    load();
    window.addEventListener("spectra_catalog_updated", load);
    return () => window.removeEventListener("spectra_catalog_updated", load);
  }, []);

  if (!catalog) return null;

  const trendingTabs = [
    { id: "top_hits", label: "Top Hits" },
    { id: "cinema", label: "Cinema" },
    { id: "bollywood", label: "Bollywood" },
    { id: "south", label: "South" },
    { id: "hollywood", label: "Hollywood" },
  ];

  const trendingByTab: Record<string, MediaItem[]> = {
    top_hits: [...catalog.bollywood.slice(0, 3), ...catalog.south.slice(0, 3)],
    cinema: [...catalog.bollywood, ...catalog.south],
    bollywood: catalog.bollywood,
    south: catalog.south,
    hollywood: catalog.hollywood,
  };

  const renderSectionShelf = (
    title: string,
    items: MediaItem[],
    icon: any,
    viewAllHref: string = "/explore"
  ) => {
    const IconComp = icon;
    const validItems = (items || []).filter((item): item is MediaItem => Boolean(item && item.id));

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
          {validItems.map((item, idx) => (
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
        <HeroCarousel items={catalog.hero} />
      </section>

      {/* Floating Quick Admin Studio Shortcut */}
      <div className="flex justify-end -mt-4 pr-1">
        <Link
          href="/admin"
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[10px] font-mono text-zinc-300 hover:text-white transition shadow-glow"
        >
          <Sliders className="w-3 h-3 text-red-400" />
          <span>Open Content Studio</span>
        </Link>
      </div>

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
      {renderSectionShelf("Franchise Spotlights", catalog.hollywood.slice(1, 5), Sparkles)}

      {/* 04. Studio Franchises & Brand Hubs */}
      <StudioFranchiseHubs />

      {/* 05. Hollywood */}
      {renderSectionShelf("Hollywood", catalog.hollywood, Globe2)}

      {/* 06. Bollywood */}
      {renderSectionShelf("Bollywood", catalog.bollywood, Film)}

      {/* 07. South Indian */}
      {renderSectionShelf("South Indian", catalog.south, Clapperboard)}

      {/* 08. Regional Hits */}
      {renderSectionShelf("Regional Hits", catalog.regional, Flame)}

      {/* 09. Indian Stars */}
      <StarSpotlightCapsules
        title="Indian Stars"
        subtitle="Movie Headliners"
        stars={catalog.indianStars}
      />

      {/* 10. Hollywood Stars Showcase */}
      <StarSpotlightCapsules
        title="Hollywood Stars Showcase"
        subtitle="Global Spotlight"
        stars={catalog.hollywoodStars}
      />

      {/* 11. Random Movies */}
      {renderSectionShelf(
        "Random Movies",
        [
          catalog.bollywood[2],
          catalog.south[1],
          catalog.hollywood[0],
          catalog.south[0],
          catalog.bollywood[0],
        ].filter(Boolean),
        Compass
      )}
    </div>
  );
}
