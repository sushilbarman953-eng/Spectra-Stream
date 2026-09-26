"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Play, Star, Film, Volume2, Tv } from "lucide-react";
import { tmdb, MediaItem, IMAGE_BASE, BACKUP_HINDI_SERIES } from "@/lib/tmdb";
import { soundFx } from "@/lib/soundFx";

export default function SeriesPage() {
  const [trending, setTrending] = useState<MediaItem[]>(BACKUP_HINDI_SERIES);
  const [popular, setPopular] = useState<MediaItem[]>(BACKUP_HINDI_SERIES);
  const [drama, setDrama] = useState<MediaItem[]>(BACKUP_HINDI_SERIES);

  useEffect(() => {
    let isMounted = true;

    const loadSeries = async () => {
      try {
        const [trendData, popData, dramaData] = await Promise.all([
          tmdb.getTrending("tv"),
          tmdb.getPopularTV(),
          tmdb.discoverMedia("tv", 18),
        ]);

        if (isMounted) {
          if (trendData?.length) setTrending(trendData);
          if (popData?.length) setPopular(popData);
          if (dramaData?.length) setDrama(dramaData);
        }
      } catch (e) {
        console.error("Series catalog error:", e);
      }
    };

    loadSeries();
    return () => { isMounted = false; };
  }, []);

  const renderShelf = (title: string, icon: any, items: MediaItem[]) => {
    const Icon = icon;
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
            <Icon className="w-3.5 h-3.5 text-emerald-400" />
            <span>{title}</span>
          </h3>
          <span className="text-[10px] text-zinc-500 font-mono">{items.length} Shows</span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 px-1">
          {items.map((item, idx) => {
            const poster = item.poster_path ? `${IMAGE_BASE}/w185${item.poster_path}` : null;
            return (
              <Link
                key={`series-${item.id}-${idx}`}
                href={`/details/${item.id}?type=tv`}
                onClick={() => soundFx.playCinematicPop()}
                className="flex-none w-28 sm:w-32 group"
              >
                <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-zinc-950 border border-white/10 group-hover:border-white/30 transition shadow-md">
                  {poster ? (
                    <Image
                      src={poster}
                      alt={item.name || "Series"}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-zinc-600">
                      <Film className="w-5 h-5" />
                    </div>
                  )}
                  <div className="absolute top-1.5 left-1.5 bg-emerald-400 text-black px-1 py-0.5 rounded text-[7px] font-black uppercase shadow-glow">
                    Hindi
                  </div>
                  {item.vote_average ? (
                    <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/80 backdrop-blur-md px-1 py-0.5 rounded text-[8px] text-white font-bold border border-white/15">
                      <Star className="w-2 h-2 fill-white text-white" />
                      {item.vote_average.toFixed(1)}
                    </div>
                  ) : null}
                </div>
                <h4 className="text-[11px] font-bold text-white truncate mt-1">{item.name}</h4>
                <p className="text-[9px] text-zinc-500 font-mono">SERIES</p>
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 pb-28 space-y-5">
      {renderShelf("Trending Series", Tv, trending)}
      {renderShelf("Popular Web Dramas", Volume2, popular)}
      {renderShelf("Top Hindi Thrillers", Film, drama)}
    </div>
  );
}
