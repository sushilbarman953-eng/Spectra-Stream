"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Tv, Trophy, ShieldAlert, Radio, Smile, ChevronRight } from "lucide-react";
import { BACKUP_HINDI_SERIES, MediaItem } from "@/lib/tmdb";
import { HeroCarousel } from "@/components/HeroCarousel";
import { MediaPosterCard } from "@/components/MediaPosterCard";
import { soundFx } from "@/lib/soundFx";

export default function SeriesPage() {
  const [activeTab] = useState<string>("all");

  const renderShelf = (title: string, items: MediaItem[], icon: any) => {
    const IconComp = icon;
    return (
      <section className="space-y-2.5 select-none">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <IconComp className="w-4 h-4 text-red-500" />
            <h2 className="text-sm font-bold text-white tracking-wide">{title}</h2>
          </div>
          <Link
            href="/explore"
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
              defaultType="tv"
            />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-[#08080c] text-white pt-2 pb-28 px-3 sm:px-6 flex flex-col gap-7 max-w-7xl mx-auto">
      <HeroCarousel items={BACKUP_HINDI_SERIES} />

      {renderShelf("Top 10 Series Today", BACKUP_HINDI_SERIES, Trophy)}
      {renderShelf("Indian OTT Originals", BACKUP_HINDI_SERIES.slice(4), Tv)}
      {renderShelf("Suspense & Crime Thrillers", BACKUP_HINDI_SERIES.slice(0, 4), ShieldAlert)}
      {renderShelf("Global Dramas in Hindi", BACKUP_HINDI_SERIES.slice(2, 6), Radio)}
      {renderShelf("Binge-Worthy Shows", BACKUP_HINDI_SERIES.slice(1, 5), Smile)}
    </div>
  );
}
