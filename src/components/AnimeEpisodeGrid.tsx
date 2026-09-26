"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, Sparkles, LayoutGrid, List, Film } from "lucide-react";
import { EpisodeItem, IMAGE_BASE } from "@/lib/tmdb";
import { GlassCard } from "@/components/ui/GlassCard";

interface AnimeEpisodeGridProps {
  episodes: EpisodeItem[];
  currentEpisode: number;
  currentSeason: number;
  seasonsCount: number;
  onSelectEpisode: (epNum: number) => void;
  onSelectSeason: (sNum: number) => void;
}

export const AnimeEpisodeGrid = ({
  episodes,
  currentEpisode,
  currentSeason,
  seasonsCount,
  onSelectEpisode,
  onSelectSeason,
}: AnimeEpisodeGridProps) => {
  const [viewMode, setViewMode] = useState<"small-grid" | "list">("small-grid");
  const [activeTab, setActiveTab] = useState<number>(0);

  const CHUNK_SIZE = 25;
  const chunkCount = Math.ceil(episodes.length / CHUNK_SIZE) || 1;
  const displayedEpisodes = episodes.slice(
    activeTab * CHUNK_SIZE,
    (activeTab + 1) * CHUNK_SIZE
  );

  return (
    <div className="space-y-3 pt-2">
      {/* Header Bar: Episodes Count, Season Switcher, Chunk Tabs & View Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-white">
            <Sparkles className="w-4 h-4 text-white" />
            <span>Episodes</span>
            <span className="text-xs text-zinc-400 font-normal">({episodes.length})</span>
          </div>

          {/* Season Switcher */}
          {seasonsCount > 1 && (
            <select
              value={currentSeason}
              onChange={(e) => onSelectSeason(parseInt(e.target.value, 10))}
              className="bg-white/10 text-white text-xs font-semibold px-2.5 py-1 rounded-xl border border-white/15 focus:outline-none cursor-pointer"
            >
              {Array.from({ length: seasonsCount }).map((_, idx) => (
                <option key={idx + 1} value={idx + 1} className="bg-[#0f0f13] text-white">
                  Season {idx + 1}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center gap-2 justify-between sm:justify-end">
          {/* Episode Batch Chunk Tabs (1-25, 26-50...) */}
          {chunkCount > 1 && (
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              {Array.from({ length: chunkCount }).map((_, idx) => {
                const start = idx * CHUNK_SIZE + 1;
                const end = Math.min((idx + 1) * CHUNK_SIZE, episodes.length);
                const isSelected = activeTab === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold whitespace-nowrap transition border ${
                      isSelected
                        ? "bg-white text-black border-white shadow-glow"
                        : "bg-white/5 text-zinc-400 border-white/10 hover:text-white"
                    }`}
                  >
                    {start}-{end}
                  </button>
                );
              })}
            </div>
          )}

          {/* View Switcher: Small Grid vs List Mode Toggle */}
          <div className="flex items-center p-0.5 rounded-xl bg-white/5 border border-white/15">
            <button
              onClick={() => setViewMode("small-grid")}
              className={`p-1.5 rounded-lg transition ${
                viewMode === "small-grid"
                  ? "bg-white text-black shadow-glow"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Small Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition ${
                viewMode === "list"
                  ? "bg-white text-black shadow-glow"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 1. SMALL GRID MODE (Compact 2-col on mobile, 4-col on desktop) */}
      {viewMode === "small-grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
          {displayedEpisodes.map((ep) => {
            const isCurrent = ep.episode_number === currentEpisode;
            const thumbnail = ep.still_path ? `${IMAGE_BASE}/w300${ep.still_path}` : null;

            return (
              <div
                key={ep.id || ep.episode_number}
                onClick={() => onSelectEpisode(ep.episode_number)}
                className="cursor-pointer group"
              >
                <GlassCard
                  hoverEffect
                  className={`p-2 rounded-2xl flex flex-col justify-between gap-1.5 border transition ${
                    isCurrent
                      ? "bg-white/20 border-white shadow-glow"
                      : "border-white/10 hover:border-white/25 bg-[#0a0a0f]"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-zinc-950 border border-white/10">
                    {thumbnail ? (
                      <Image
                        src={thumbnail}
                        alt={ep.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 200px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-zinc-600 text-[10px]">
                        <Film className="w-4 h-4" />
                      </div>
                    )}

                    <div className="absolute top-1 left-1">
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                          isCurrent
                            ? "bg-white text-black"
                            : "bg-black/80 text-white backdrop-blur-md border border-white/15"
                        }`}
                      >
                        EP {ep.episode_number}
                      </span>
                    </div>

                    {isCurrent && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="p-1.5 rounded-full bg-white text-black shadow-glow">
                          <Play className="w-3 h-3 fill-black text-black" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <div className="px-0.5">
                    <h4 className="text-[11px] font-semibold text-white truncate group-hover:text-zinc-200">
                      {ep.name || `Episode ${ep.episode_number}`}
                    </h4>
                  </div>
                </GlassCard>
              </div>
            );
          })}
        </div>
      ) : (
        /* 2. LIST MODE (Clean horizontal row format) */
        <div className="space-y-2">
          {displayedEpisodes.map((ep) => {
            const isCurrent = ep.episode_number === currentEpisode;
            const thumbnail = ep.still_path ? `${IMAGE_BASE}/w300${ep.still_path}` : null;

            return (
              <div
                key={ep.id || ep.episode_number}
                onClick={() => onSelectEpisode(ep.episode_number)}
                className="cursor-pointer group"
              >
                <GlassCard
                  hoverEffect
                  className={`p-2 sm:p-2.5 rounded-2xl flex items-center gap-3 border transition ${
                    isCurrent
                      ? "bg-white/20 border-white shadow-glow"
                      : "border-white/10 hover:border-white/25 bg-[#0a0a0f]"
                  }`}
                >
                  {/* Thumbnail on Left */}
                  <div className="relative w-28 sm:w-36 aspect-video rounded-xl overflow-hidden bg-zinc-950 border border-white/10 flex-none">
                    {thumbnail ? (
                      <Image
                        src={thumbnail}
                        alt={ep.name}
                        fill
                        sizes="150px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-zinc-600 text-xs">
                        <Film className="w-4 h-4" />
                      </div>
                    )}

                    <div className="absolute top-1 left-1">
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                          isCurrent
                            ? "bg-white text-black"
                            : "bg-black/80 text-white backdrop-blur-md border border-white/15"
                        }`}
                      >
                        EP {ep.episode_number}
                      </span>
                    </div>

                    {isCurrent && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="p-1.5 rounded-full bg-white text-black shadow-glow">
                          <Play className="w-3 h-3 fill-black text-black" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Metadata on Right */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-zinc-200">
                        {ep.name || `Episode ${ep.episode_number}`}
                      </h4>
                      {isCurrent && (
                        <span className="flex-none text-[9px] text-white font-extrabold uppercase px-1.5 py-0.5 rounded bg-white/20 border border-white/25">
                          Playing
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] sm:text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {ep.overview || "Stream this episode now on Spectra."}
                    </p>
                  </div>
                </GlassCard>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
