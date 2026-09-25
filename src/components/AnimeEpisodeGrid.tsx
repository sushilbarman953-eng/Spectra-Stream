"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, Sparkles, AlertCircle } from "lucide-react";
import { AnimeEpisode } from "@/lib/jikan";
import { GlassCard } from "@/components/ui/GlassCard";

interface AnimeEpisodeGridProps {
  episodes: AnimeEpisode[];
  currentEpisode: number;
  onSelectEpisode: (epNum: number) => void;
  posterUrl?: string;
}

export const AnimeEpisodeGrid = ({
  episodes,
  currentEpisode,
  onSelectEpisode,
  posterUrl,
}: AnimeEpisodeGridProps) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  // Chunk episodes into batches of 25 for long series
  const CHUNK_SIZE = 25;
  const chunkCount = Math.ceil(episodes.length / CHUNK_SIZE) || 1;
  const displayedEpisodes = episodes.slice(
    activeTab * CHUNK_SIZE,
    (activeTab + 1) * CHUNK_SIZE
  );

  return (
    <div className="space-y-4">
      {/* Header and Episode Chunk Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white" />
            Episodes ({episodes.length})
          </h3>
        </div>

        {chunkCount > 1 && (
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {Array.from({ length: chunkCount }).map((_, idx) => {
              const start = idx * CHUNK_SIZE + 1;
              const end = Math.min((idx + 1) * CHUNK_SIZE, episodes.length);
              const isSelected = activeTab === idx;

              return (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition border ${
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
      </div>

      {/* Episode Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {displayedEpisodes.map((ep) => {
          const isCurrent = ep.mal_id === currentEpisode;

          return (
            <div
              key={ep.mal_id}
              onClick={() => onSelectEpisode(ep.mal_id)}
              className="cursor-pointer group"
            >
              <GlassCard
                hoverEffect
                className={`p-3 rounded-2xl flex flex-col justify-between gap-2 border transition ${
                  isCurrent
                    ? "bg-white/15 border-white shadow-glow"
                    : "border-white/10 hover:border-white/20 bg-[#0c0c10]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-md ${
                        isCurrent ? "bg-white text-black" : "bg-white/10 text-white"
                      }`}
                    >
                      EP {ep.mal_id}
                    </span>
                    {ep.filler && (
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                        Filler
                      </span>
                    )}
                  </div>

                  {isCurrent && (
                    <span className="flex items-center gap-1 text-[10px] text-white font-bold uppercase tracking-wider">
                      <Play className="w-3 h-3 fill-white text-white" />
                      Playing
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-white truncate group-hover:text-zinc-200">
                    {ep.title || `Episode ${ep.mal_id}`}
                  </h4>
                  {ep.synopsis && (
                    <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">
                      {ep.synopsis}
                    </p>
                  )}
                </div>
              </GlassCard>
            </div>
          );
        })}
      </div>
    </div>
  );
};
