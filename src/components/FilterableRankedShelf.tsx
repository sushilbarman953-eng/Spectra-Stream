"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { MediaItem } from "@/lib/tmdb";
import { soundFx } from "@/lib/soundFx";
import { MediaPosterCard } from "@/components/MediaPosterCard";

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
      {/* Header */}
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

      {/* Sub-Filter Pill Tabs */}
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

      {/* Ranked Poster Row */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 px-0.5">
        {currentItems.map((item, idx) => (
          <MediaPosterCard
            key={`${activeTab}-${item.id}-${idx}`}
            item={item}
            rank={idx + 1}
            defaultType={defaultType}
          />
        ))}
      </div>
    </div>
  );
};
