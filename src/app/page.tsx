"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Play, Film, Volume2, Star, ChevronRight } from "lucide-react";
import { tmdb, MediaItem, IMAGE_BASE, BACKUP_HINDI_MOVIES, BACKUP_HINDI_SERIES } from "@/lib/tmdb";
import { soundFx } from "@/lib/soundFx";

export default function HomePage() {
  const [trending, setTrending] = useState<MediaItem[]>(BACKUP_HINDI_MOVIES);
  const [hindiCinema, setHindiCinema] = useState<MediaItem[]>(BACKUP_HINDI_MOVIES);
  const [hindiSeries, setHindiSeries] = useState<MediaItem[]>(BACKUP_HINDI_SERIES);

  useEffect(() => {
    let isMounted = true;

    const loadCatalogs = async () => {
      try {
        const [trendData, cinemaData, seriesData] = await Promise.all([
          tmdb.getTrendingIndia(),
          tmdb.getHindiCinema(),
          tmdb.getHindiSeries(),
        ]);

        if (isMounted) {
          if (trendData?.length) setTrending(trendData);
          if (cinemaData?.length) setHindiCinema(cinemaData);
          if (seriesData?.length) setHindiSeries(seriesData);
        }
      } catch (e) {
        console.error("Catalog load failed:", e);
      }
    };

    loadCatalogs();
    return () => { isMounted = false; };
  }, []);

  const heroItem = trending[0] || BACKUP_HINDI_MOVIES[0];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 pb-28 space-y-5">
      {/* 1. COMPACT HERO SPOTLIGHT */}
      {heroItem && (
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden border border-white/10 bg-black shadow-xl">
          {heroItem.backdrop_path || heroItem.poster_path ? (
            <Image
              src={`${IMAGE_BASE}/w780${heroItem.backdrop_path || heroItem.poster_path}`}
              alt={heroItem.title || heroItem.name || "Hero"}
              fill
              priority
              unoptimized
              className="object-cover object-top"
            />
          ) : (
            <div className="w-full h-full bg-zinc-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-black/35 to-transparent" />

          <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 max-w-lg space-y-1.5 z-10">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-black font-black text-[9px] uppercase tracking-wider">
                Trending India
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-white font-mono text-[9px] border border-white/20">
                Hindi Dub
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight drop-shadow truncate">
              {heroItem.title || heroItem.name}
            </h1>

            <div className="flex items-center gap-2 pt-1">
              <Link
                href={`/watch/${heroItem.id}?type=${heroItem.media_type || (heroItem.name ? "tv" : "movie")}`}
                onClick={() => soundFx.playCinematicSwell()}
                className="px-3.5 py-1.5 rounded-xl bg-white text-black font-black text-xs shadow-glow hover:bg-zinc-200 active:scale-95 transition flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-black text-black" />
                <span>Stream</span>
              </Link>

              <Link
                href={`/details/${heroItem.id}?type=${heroItem.media_type || (heroItem.name ? "tv" : "movie")}`}
                onClick={() => soundFx.playCinematicPop()}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs backdrop-blur-xl transition"
              >
                <span>Info</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 2. POPULAR HINDI CINEMA (COMPACT SINGLE ROW) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-white" />
            <span>Popular Hindi Cinema</span>
          </h3>
          <span className="text-[10px] text-zinc-500 font-mono">{hindiCinema.length} Films</span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 px-1">
          {hindiCinema.map((item, idx) => {
            const poster = item.poster_path ? `${IMAGE_BASE}/w185${item.poster_path}` : null;
            return (
              <Link
                key={`home-cinema-${item.id}-${idx}`}
                href={`/details/${item.id}?type=movie`}
                onClick={() => soundFx.playCinematicPop()}
                className="flex-none w-28 sm:w-32 group"
              >
                <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-zinc-950 border border-white/10 group-hover:border-white/30 transition shadow-md">
                  {poster ? (
                    <Image
                      src={poster}
                      alt={item.title || "Movie"}
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
                <h4 className="text-[11px] font-bold text-white truncate mt-1">{item.title}</h4>
                <p className="text-[9px] text-zinc-500 font-mono">{item.release_date?.slice(0, 4) || "2024"}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 3. TOP INDIAN WEB SERIES (COMPACT SINGLE ROW) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Top Indian Web Series</span>
          </h3>
          <span className="text-[10px] text-zinc-500 font-mono">{hindiSeries.length} Series</span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 px-1">
          {hindiSeries.map((item, idx) => {
            const poster = item.poster_path ? `${IMAGE_BASE}/w185${item.poster_path}` : null;
            return (
              <Link
                key={`home-series-${item.id}-${idx}`}
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
    </div>
  );
}
