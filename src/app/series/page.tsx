"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Play, Star, Film, Volume2, Tv } from "lucide-react";
import { tmdb, MediaItem, IMAGE_BASE } from "@/lib/tmdb";
import { GlassCard } from "@/components/ui/GlassCard";
import { soundFx } from "@/lib/soundFx";

export default function SeriesPage() {
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [popular, setPopular] = useState<MediaItem[]>([]);
  const [drama, setDrama] = useState<MediaItem[]>([]);
  const [scifi, setScifi] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadSeries = async () => {
      try {
        const [trendData, popData, dramaData, scifiData] = await Promise.all([
          tmdb.getTrending("tv"),
          tmdb.getPopularTV(),
          tmdb.discoverMedia("tv", 18),
          tmdb.discoverMedia("tv", 10765),
        ]);

        if (isMounted) {
          setTrending(trendData || []);
          setPopular(popData || []);
          setDrama(dramaData || []);
          setScifi(scifiData || []);
        }
      } catch (e) {
        console.error("Series catalog error:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadSeries();

    return () => {
      isMounted = false;
    };
  }, []);

  const heroSeries = trending[0] || popular[0];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-2 pb-28 space-y-6">
      {/* 1. HERO SHOWCASE */}
      {heroSeries && (
        <div className="relative aspect-[16/10] sm:aspect-[21/9] w-full rounded-3xl overflow-hidden border border-white/15 bg-black shadow-2xl">
          {heroSeries.backdrop_path || heroSeries.poster_path ? (
            <Image
              src={`${IMAGE_BASE}/w1280${heroSeries.backdrop_path || heroSeries.poster_path}`}
              alt={heroSeries.name || "Series"}
              fill
              priority
              unoptimized
              sizes="1200px"
              className="object-cover object-top"
            />
          ) : (
            <div className="w-full h-full bg-zinc-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-black/40 to-transparent" />

          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 max-w-xl space-y-2 z-10">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-black font-black text-[9px] uppercase tracking-wider">
                Hindi Dub Available
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-white font-mono text-[9px] uppercase border border-white/20">
                Web Series
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
              {heroSeries.name}
            </h1>
            <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed max-w-md">
              {heroSeries.overview}
            </p>

            <div className="flex items-center gap-2 pt-1">
              <Link
                href={`/watch/${heroSeries.id}?type=tv&season=1&episode=1`}
                onClick={() => soundFx.playCinematicSwell()}
                className="px-5 py-2 rounded-xl bg-white text-black font-black text-xs shadow-glow hover:bg-zinc-200 active:scale-95 transition flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-black text-black" />
                <span>Watch S1:E1</span>
              </Link>

              <Link
                href={`/details/${heroSeries.id}?type=tv`}
                onClick={() => soundFx.playCinematicPop()}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs backdrop-blur-xl transition"
              >
                <span>Episodes & Info</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 2. TRENDING SERIES SHELF */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white uppercase tracking-wide flex items-center gap-2">
            <Tv className="w-4 h-4 text-emerald-400" />
            <span>Trending Indian & Global Series</span>
          </h3>
          <span className="text-[10px] text-zinc-500 font-mono">{trending.length} Shows</span>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {trending.map((item, idx) => {
            const poster = item.poster_path ? `${IMAGE_BASE}/w342${item.poster_path}` : null;
            return (
              <Link
                key={`trending-series-${item.id}-${idx}`}
                href={`/details/${item.id}?type=tv`}
                onClick={() => soundFx.playCinematicPop()}
                className="flex-none w-36 sm:w-44 group"
              >
                <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 group-hover:border-white/30 transition shadow-lg">
                  {poster ? (
                    <Image
                      src={poster}
                      alt={item.name || "Series"}
                      fill
                      unoptimized
                      sizes="180px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-zinc-600">
                      <Film className="w-6 h-6" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-emerald-400 text-black px-1.5 py-0.5 rounded text-[8px] font-black uppercase shadow-glow">
                    Hindi
                  </div>
                  {item.vote_average ? (
                    <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] text-white font-bold border border-white/15">
                      <Star className="w-2.5 h-2.5 fill-white text-white" />
                      {item.vote_average.toFixed(1)}
                    </div>
                  ) : null}
                </div>
                <h4 className="text-xs font-bold text-white truncate mt-1.5">{item.name}</h4>
                <p className="text-[10px] text-zinc-400 font-mono">SERIES</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 3. POPULAR WEB DRAMAS GRID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white uppercase tracking-wide flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-white" />
            <span>Popular Drama & Thriller Shows</span>
          </h3>
          <span className="text-[10px] text-zinc-500 font-mono">{popular.length} Shows</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {popular.slice(0, 12).map((item, idx) => {
            const poster = item.poster_path ? `${IMAGE_BASE}/w342${item.poster_path}` : null;
            return (
              <Link
                key={`pop-series-${item.id}-${idx}`}
                href={`/details/${item.id}?type=tv`}
                onClick={() => soundFx.playCinematicPop()}
                className="group relative"
              >
                <GlassCard hoverEffect className="overflow-hidden border border-white/10 rounded-2xl h-full flex flex-col justify-between bg-[#0b0b10]">
                  <div className="relative aspect-[2/3] w-full bg-zinc-950">
                    {poster ? (
                      <Image
                        src={poster}
                        alt={item.name || "Series"}
                        fill
                        unoptimized
                        sizes="180px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-zinc-600">
                        <Film className="w-6 h-6" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-emerald-400 text-black px-1.5 py-0.5 rounded text-[8px] font-black uppercase shadow-glow">
                      Hindi
                    </div>
                    {item.vote_average ? (
                      <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] text-white font-bold border border-white/15">
                        <Star className="w-2.5 h-2.5 fill-white text-white" />
                        {item.vote_average.toFixed(1)}
                      </div>
                    ) : null}
                  </div>
                  <div className="p-2.5 bg-black/60">
                    <h4 className="text-xs font-semibold text-white truncate">{item.name}</h4>
                    <span className="text-[9px] text-zinc-400 font-mono">SERIES</span>
                  </div>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
