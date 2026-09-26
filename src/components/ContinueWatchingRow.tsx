"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, RotateCcw, Clock } from "lucide-react";
import { WatchProgressItem } from "@/lib/watchProgress";
import { GlassCard } from "@/components/ui/GlassCard";

export const ContinueWatchingRow = () => {
  const [items, setItems] = useState<WatchProgressItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("spectra_watch_progress");
      if (raw) {
        const parsed: Record<string, WatchProgressItem> = JSON.parse(raw);
        const sorted = Object.values(parsed)
          .sort((a, b) => b.updatedAt - a.updatedAt)
          .slice(0, 8);
        setItems(sorted);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  if (!items.length) return null;

  return (
    <section className="space-y-3 py-2">
      <div className="flex items-center gap-2 px-1">
        <Clock className="w-4 h-4 text-white" />
        <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
          Continue Watching
        </h3>
      </div>

      <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2 pt-1">
        {items.map((item) => (
          <Link
            key={`${item.id}-${item.season}-${item.episode}`}
            href={`/watch/${item.id}?type=${item.type}&season=${item.season || 1}&episode=${item.episode || 1}`}
            className="flex-none w-44 sm:w-52 group"
          >
            <GlassCard
              hoverEffect
              className="p-2 rounded-2xl flex flex-col justify-between gap-2 border border-white/10 bg-[#0c0c10]"
            >
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-zinc-950 flex items-center justify-center">
                <div className="p-3 rounded-full bg-white/20 text-white backdrop-blur-md border border-white/20 group-hover:scale-110 transition">
                  <Play className="w-4 h-4 fill-white" />
                </div>

                {/* Bottom Progress Bar */}
                <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20">
                  <div
                    className="h-full bg-white shadow-glow"
                    style={{ width: `${item.progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-300 font-semibold px-1">
                <span>
                  {item.type === "tv" ? `S${item.season} : Ep ${item.episode}` : "Movie"}
                </span>
                <span className="text-[10px] text-zinc-400">{item.progressPercent}%</span>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </section>
  );
};
