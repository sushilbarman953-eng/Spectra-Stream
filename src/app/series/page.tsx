"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Tv,
  Trophy,
  ShieldAlert,
  Radio,
  Smile,
  Heart,
  Globe2,
  Sparkles,
  Compass,
  Film,
  Flame,
  ChevronRight,
  Landmark,
} from "lucide-react";
import { MediaItem } from "@/lib/tmdb";
import { catalogManager, CustomCatalogState } from "@/lib/catalogManager";
import { HeroCarousel } from "@/components/HeroCarousel";
import { FilterableRankedShelf } from "@/components/FilterableRankedShelf";
import { MediaPosterCard } from "@/components/MediaPosterCard";
import { soundFx } from "@/lib/soundFx";

const SERIES_GENRE_PILLS = [
  { id: "all", label: "All" },
  { id: "web_series", label: "Web Series" },
  { id: "kdrama", label: "K-Drama" },
  { id: "anime", label: "Anime" },
  { id: "reality", label: "Reality" },
  { id: "crime", label: "Crime" },
  { id: "romance", label: "Romance" },
];

export default function SeriesPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [catalog, setCatalog] = useState<CustomCatalogState | null>(null);

  useEffect(() => {
    const load = () => setCatalog(catalogManager.get());
    load();
    window.addEventListener("spectra_catalog_updated", load);
    return () => window.removeEventListener("spectra_catalog_updated", load);
  }, []);

  if (!catalog) return null;

  const heroItems = catalog.seriesHero?.length ? catalog.seriesHero : catalog.trendingSeries;

  const trendingTabs = [
    { id: "top_series", label: "Top Series" },
    { id: "crime", label: "Crime Thrillers" },
    { id: "romance", label: "Romance" },
    { id: "kdrama", label: "K-Drama" },
  ];

  const trendingByTab: Record<string, MediaItem[]> = {
    top_series: catalog.trendingSeries || [],
    crime: catalog.crimeThrillers || [],
    romance: catalog.romanceSeries || [],
    kdrama: catalog.kdrama || [],
  };

  const renderSectionShelf = (
    title: string,
    items: MediaItem[],
    icon: any,
    viewAllHref: string = "/explore?type=tv"
  ) => {
    const IconComp = icon;
    const validItems = (items || []).filter((item): item is MediaItem => Boolean(item && item.id));

    return (
      <section className="space-y-2.5 select-none">
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
              defaultType="tv"
            />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-[#08080c] text-white pt-2 pb-28 px-3 sm:px-6 flex flex-col gap-7 max-w-7xl mx-auto">
      {/* 00. Series Hero Carousel */}
      <section className="w-full">
        <HeroCarousel items={heroItems} />
      </section>

      {/* 01. Series Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
        {SERIES_GENRE_PILLS.map((pill) => {
          const isSelected = activeFilter === pill.id;
          return (
            <button
              key={pill.id}
              onClick={() => {
                soundFx.playMechanicalTick();
                setActiveFilter(pill.id);
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

      {/* 02. Trending TV Series (Ranked Shelf with Watermarks & Sub-chips) */}
      <FilterableRankedShelf
        title="Trending TV Series"
        tabs={trendingTabs}
        itemsByTab={trendingByTab}
        allLinkHref="/explore?type=tv"
        defaultType="tv"
      />

      {/* 03. K-Drama Fever */}
      {renderSectionShelf("K-Drama Fever", catalog.kdrama || [], Heart)}

      {/* 04. Indian Web Originals */}
      {renderSectionShelf("Indian Web Originals", catalog.indianWeb || [], Tv)}

      {/* 05. Crime & Investigation Thrillers */}
      {renderSectionShelf("Crime & Investigation Thrillers", catalog.crimeThrillers || [], ShieldAlert)}

      {/* 06. Romance & High School Dramas */}
      {renderSectionShelf("Romance & High School Dramas", catalog.romanceSeries || [], Smile)}

      {/* 07. Historical & Period Epics */}
      {renderSectionShelf("Historical & Period Epics", catalog.historicalEpics || [], Landmark)}

      {/* 08. Reality TV & Talk Shows */}
      {renderSectionShelf("Reality TV & Talk Shows", catalog.realityTv || [], Trophy)}

      {/* 09. Pakistani Dramas */}
      {renderSectionShelf("Pakistani Dramas", catalog.pakistaniDramas || [], Film)}

      {/* 10. Western Binge-Worthy Series */}
      {renderSectionShelf("Western Binge-Worthy Series", catalog.westernSeries || [], Globe2)}

      {/* 11. Asian Dramas (C-Drama, J-Drama, Thai) */}
      {renderSectionShelf("Asian Dramas", catalog.asianDramas || [], Sparkles)}

      {/* 12. Sci-Fi & Fantasy Universes */}
      {renderSectionShelf("Sci-Fi & Fantasy Universes", catalog.scifiFantasy || [], Compass)}
    </div>
  );
}
