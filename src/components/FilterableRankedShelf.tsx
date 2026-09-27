"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";
import { MediaItem, IMAGE_BASE } from "@/lib/tmdb";
import { soundFx } from "@/lib/soundFx";

export interface FilterTab {
  id: string;
  label: string;
}

interface FilterableRankedShelfProps {
  title: string;
  tabs: FilterTab[];
  itemsByTab: Record<string, MediaItem[]>;
  allLinkHref?: string;
  defaultType?: "movie" | "tv";
}

export const FilterableRankedShelf: React.FC<FilterableRankedShelfProps> = ({
  title,
  tabs,
  itemsByTab,
  allLinkHref = "/movies",
  defaultType = "movie",
}) => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id || "top");

  const currentItems = itemsByTab[activeTab] || Object.values(itemsByTab)[0] || [];

  return (
    <div className="space-y-3 select-none">
      {/* 1. Header Structure: Left Title, Right "All >" */}
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
          {title}
        </h2>
        <Link
          href={allLinkHref}
          onClick={() => soundFx.playCinematicPop()}
          className="text-xs font-bold text-zinc-400 hover:text-white transition flex items-center gap-0.5 group"
        >
          <span>All</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 2. Sub-Filter Pill Tabs: Horizontal Scrollable Chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundFx.playMechanicalTick();
                setActiveTab(tab.id);
              }}
              className={`px-3 py-1 rounded-xl text-xs whitespace-nowrap transition-all duration-200 active:scale-95 font-bold border ${
                isActive
                  ? "bg-white text-black border-white shadow-glow font-black"
                  : "bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-200 border-white/10"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 3. Horizontal Ranked Poster Row */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 px-0.5">
        {currentItems.map((item, idx) => {
          const rank = idx + 1;
          const poster = item.poster_path
            ? item.poster_path.startsWith("http")
              ? item.poster_path
              : `${IMAGE_BASE}/w342${item.poster_path}`
            : null;
          const itemType = item.media_type || defaultType;

          // Determine language tag
          const displayLang =
            item.audioLanguages && item.audioLanguages.length > 1
              ? "MULTI"
              : item.audioLanguages?.[0] || "Hindi";

          const itemTitle = item.title || item.name || "Untitled";

          return (
            <Link
              key={`${activeTab}-${item.id}-${idx}`}
              href={`/details/${item.id}?type=${itemType}`}
              onClick={() => soundFx.playCinematicPop()}
              className="flex-none w-28 sm:w-32 group relative flex flex-col"
            >
              {/* Poster Frame */}
              <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 group-hover:border-white/30 transition shadow-lg group-hover:scale-[1.02]">
                {poster ? (
                  <Image
                    src={poster}
                    alt={itemTitle}
                    fill
                    unoptimized
                    className="object-cover transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs font-mono">
                    Poster
                  </div>
                )}

                {/* Ambient vignette for rank watermark contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                {/* Top-Left Badge: Rating */}
                <div className="absolute top-1.5 left-1.5 z-10 flex items-center gap-0.5 bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded-lg border border-white/15 text-[8px] font-black text-white shadow-md">
                  <Star className="w-2.5 h-2.5 fill-white text-white" />
                  <span>{item.vote_average ? item.vote_average.toFixed(1) : "8.5"}</span>
                </div>

                {/* Top-Right Badge: Frosted Glass Audio Language */}
                <div className="absolute top-1.5 right-1.5 z-10">
                  <span className="px-1.5 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-wider bg-red-600/30 backdrop-blur-md border border-red-500/40 text-red-200 shadow-[0_0_8px_rgba(239,68,68,0.45)]">
                    {displayLang}
                  </span>
                </div>

                {/* Giant Translucent Watermark Ranking Number */}
                <span className="absolute -bottom-2 right-1 text-5xl sm:text-6xl font-black italic tracking-tighter text-white/35 pointer-events-none select-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] font-sans">
                  {rank}
                </span>
              </div>

              {/* Under-Poster Caption: Title with localized language in brackets */}
              <div className="mt-1.5 space-y-0.5">
                <h4 className="text-[11px] font-bold text-white truncate group-hover:text-red-300 transition">
                  {itemTitle}
                </h4>
                <p className="text-[9px] text-zinc-400 truncate font-mono">
                  [{displayLang}] • {(item.release_date || item.first_air_date || "2024").slice(0, 4)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
