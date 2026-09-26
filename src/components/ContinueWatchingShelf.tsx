"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Sparkles, X, Clock } from "lucide-react";
import { playbackHistory, WatchProgressItem } from "@/lib/playbackHistory";
import { IMAGE_BASE } from "@/lib/tmdb";
import { GlassCard } from "@/components/ui/GlassCard";

export const ContinueWatchingShelf = () => {
  const [items, setItems] = useState<WatchProgressItem[]>([]);

  useEffect(() => {
    const load = () => setItems(playbackHistory.getAll());
    load();
    window.addEventListener("spectra_playback_updated", load);
    return () => window.removeEventListener("spectra_playback_updated", load);
  }, []);

  if (items.length === 0) return null;

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    playbackHistory.removeItem(id);
  };

  const formatRemainingTime = (current: number, total: number) => {
    const remainingSecs = Math.max(0, total - current);
    const mins = Math.floor(remainingSecs / 60);
    return mins > 0 ? `${mins}m left` : "Ending";
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-white" />
          <h3 className="text-base font-bold text-white tracking-wide">Continue Watching</h3>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-2 pt-1">
        {items.map((item) => {
          const imageSrc = item.backdropPath
            ? `${IMAGE_BASE}/w780${item.backdropPath}`
            : item.posterPath
            ? `${IMAGE_BASE}/w342${item.posterPath}`
            : null;

          const streamUrl =
            item.type === "tv"
              ? `/watch/${item.tmdbId}?type=tv&season=${item.season || 1}&episode=${item.episode || 1}&t=${Math.floor(
                  item.currentTime
                )}`
              : `/watch/${item.tmdbId}?type=movie&t=${Math.floor(item.currentTime)}`;

          return (
            <div key={item.id} className="flex-none w-48 sm:w-60 group relative">
              <Link href={streamUrl}>
                <GlassCard
                  hoverEffect
                  className="overflow-hidden border border-white/15 rounded-2xl bg-[#0b0b10] flex flex-col justify-between"
                >
                  {/* Backdrop Thumbnail with Play Overlay */}
                  <div className="relative aspect-video w-full bg-zinc-950">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={item.title}
                        fill
                        sizes="240px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-zinc-600 text-xs">
                        No Preview
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="p-2.5 rounded-full bg-white text-black shadow-glow group-hover:scale-110 transition-transform">
                        <Play className="w-3.5 h-3.5 fill-black text-black" />
                      </div>
                    </div>

                    {/* Quick remove button */}
                    <button
                      onClick={(e) => handleRemove(e, item.id)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 text-zinc-400 hover:text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove from history"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    {/* Episode Tag */}
                    {item.type === "tv" && (
                      <div className="absolute top-1.5 left-1.5 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-bold text-white border border-white/15">
                        S{item.season || 1}:E{item.episode || 1}
                      </div>
                    )}

                    {/* Progress Bar overlaying bottom of image */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                      <div
                        className="h-full bg-white shadow-glow"
                        style={{ width: `${item.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Info block */}
                  <div className="p-2.5 bg-black/60 flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        {formatRemainingTime(item.currentTime, item.duration)}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold text-zinc-300 px-1.5 py-0.5 rounded bg-white/10 border border-white/10">
                      {item.progressPercent}%
                    </span>
                  </div>
                </GlassCard>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
