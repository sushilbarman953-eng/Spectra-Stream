"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, Disc } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface AnimeEpisodePickerProps {
  id: string;
  currentEpisode: number;
  totalEpisodes: number;
  episodeList?: { episode_number: number; name?: string; overview?: string }[];
}

export const AnimeEpisodePicker = ({
  id,
  currentEpisode,
  totalEpisodes,
  episodeList = [],
}: AnimeEpisodePickerProps) => {
  const [audioMode, setAudioMode] = useState<"sub" | "dub">("sub");
  const count = totalEpisodes > 0 ? totalEpisodes : episodeList.length || 12;

  // Group into pages of 25 for quick mobile thumb-scrolling
  const pageSize = 25;
  const totalPages = Math.ceil(count / pageSize);
  const [activePage, setActivePage] = useState(
    Math.floor((currentEpisode - 1) / pageSize)
  );

  const startEp = activePage * pageSize + 1;
  const endEp = Math.min((activePage + 1) * pageSize, count);
  const visibleEpisodes = Array.from(
    { length: endEp - startEp + 1 },
    (_, i) => startEp + i
  );

  return (
    <div className="space-y-4 pt-4">
      {/* Header with Sub/Dub Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Disc className="w-4 h-4 text-white" />
          <h3 className="text-sm font-semibold tracking-wide text-white uppercase">
            Episode Selection
          </h3>
          <span className="text-xs text-zinc-400">({count} Total)</span>
        </div>

        {/* Audio Toggle */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setAudioMode("sub")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              audioMode === "sub"
                ? "bg-white text-black shadow-glow"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            SUB
          </button>
          <button
            onClick={() => setAudioMode("dub")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              audioMode === "dub"
                ? "bg-white text-black shadow-glow"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            DUB
          </button>
        </div>
      </div>

      {/* Pagination Range Bar (e.g. 1-25, 26-50) */}
      {totalPages > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {Array.from({ length: totalPages }, (_, idx) => {
            const pageStart = idx * pageSize + 1;
            const pageEnd = Math.min((idx + 1) * pageSize, count);
            const isSelected = activePage === idx;

            return (
              <button
                key={idx}
                onClick={() => setActivePage(idx)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition border ${
                  isSelected
                    ? "bg-white/20 text-white border-white/40 shadow-glow"
                    : "bg-white/[0.03] text-zinc-400 border-white/10 hover:text-white"
                }`}
              >
                {pageStart} - {pageEnd}
              </button>
            );
          })}
        </div>
      )}

      {/* Episode Grid Matrix */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {visibleEpisodes.map((epNum) => {
          const isCurrent = epNum === currentEpisode;

          return (
            <Link
              key={epNum}
              href={`/watch/${id}?type=tv&s=1&e=${epNum}&audio=${audioMode}`}
            >
              <GlassCard
                hoverEffect
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition border text-center ${
                  isCurrent
                    ? "bg-white text-black border-white shadow-glow font-bold"
                    : "border-white/10 hover:border-white/30 text-zinc-300"
                }`}
              >
                <span className="text-xs">{epNum}</span>
                {isCurrent && (
                  <Play className="w-2.5 h-2.5 fill-black text-black mt-0.5 animate-pulse" />
                )}
              </GlassCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
