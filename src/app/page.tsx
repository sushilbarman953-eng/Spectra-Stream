"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Play, Plus, Star, Film, Volume2 } from "lucide-react";
import { tmdb, MediaItem, IMAGE_BASE } from "@/lib/tmdb";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { soundFx } from "@/lib/soundFx";

export default function HomePage() {
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [hindiCinema, setHindiCinema] = useState<MediaItem[]>([]);
  const [hindiSeries, setHindiSeries] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        const [trendData, cinemaData, seriesData] = await Promise.all([
          tmdb.getTrendingIndia(),
          tmdb.getHindiCinema(),
          tmdb.getHindiSeries(),
        ]);
        setTrending(trendData.results || []);
        setHindiCinema(cinemaData.results || []);
        setHindiSeries(seriesData.results || []);
      } catch (e) {
        console.error("Catalog fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    loadCatalogs();
  }, []);

  const heroItem = trending[0];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-2 pb-28 space-y-6">
      {/* Hero Showcase */}
      {heroItem && (
        <div className="relative aspect-[16/10] sm:aspect-[21/9] w-full rounded-3xl overflow-hidden border border-white/15 bg-black shadow-2xl">
          {heroItem.backdrop_path && (
            <Image
              src={`${IMAGE_BASE}/w1280${heroItem.backdrop_path}`}
              alt={heroItem.title || heroItem.name || "Hero"}
              fill
              priority
              sizes="1200px"
              className="object-cover object-top"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-black/40 to-transparent" />

          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 max-w-xl space-y-2 z-10">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/90 text-black font-black text-[9px] uppercase tracking-wider">
                Trending in India
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-white font-mono text-[9px] uppercase border border-white/20">
                Hindi Audio Available
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
              {heroItem.title || heroItem.name}
            </h1>
            <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed max-w-md">
              {heroItem.overview}
            </p>

            <div className="flex items-center gap-2 pt-1">
              <Link
                href={`/watch/${heroItem.id}?type=${heroItem.media_type || "movie"}`}
                onClick={() => soundFx.playCinematicSwell()}
              >
                <GlassButton variant="primary" className="text-xs px-5 py-2 font-black flex items-center gap-1.5 shadow-glow">
                  <Play className="w-3.5 h-3.5 fill-black text-black" />
                  <span>Stream Now</span>
                </GlassButton>
              </Link>

              <Link
                href={`/details/${heroItem.id}?type=${heroItem.media_type || "movie"}`}
                onClick={() => soundFx.playCinematicPop()}
              >
                <GlassButton variant="secondary" className="text-xs px-4 py-2 font-bold">
                  <span>Dossier</span>
                </GlassButton>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Shelf 1: Popular Hindi Cinema */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white uppercase tracking-wide flex items-center gap-2">
            <Film className="w-4 h-4 text-white" />
            <span>Popular Hindi Cinema</span>
          </h3>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {hindiCinema.map((item) => {
            const poster = item.poster_path ? `${IMAGE_BASE}/w342${item.poster_path}` : null;
            return (
              <Link
                key={item.id}
                href={`/details/${item.id}?type=movie`}
                onClick={() => soundFx.playCinematicPop()}
                className="flex-none w-36 sm:w-44 group"
              >
                <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 group-hover:border-white/30 transition shadow-lg">
                  {poster && (
                    <Image
                      src={poster}
                      alt={item.title || "Movie"}
                      fill
                      sizes="180px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute top-2 left-2 bg-emerald-400 text-black px-1.5 py-0.5 rounded text-[8px] font-black uppercase">
                    Hindi
                  </div>
                </div>
                <h4 className="text-xs font-bold text-white truncate mt-1.5">{item.title}</h4>
                <p className="text-[10px] text-zinc-400">{item.release_date?.slice(0, 4)}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Shelf 2: Indian Web Series */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white uppercase tracking-wide flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span>Top Indian Web Series</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {hindiSeries.slice(0, 12).map((item) => {
            const poster = item.poster_path ? `${IMAGE_BASE}/w342${item.poster_path}` : null;
            return (
              <Link
                key={item.id}
                href={`/details/${item.id}?type=tv`}
                onClick={() => soundFx.playCinematicPop()}
                className="group relative"
              >
                <GlassCard hoverEffect className="overflow-hidden border border-white/10 rounded-2xl h-full flex flex-col justify-between bg-[#0b0b10]">
                  <div className="relative aspect-[2/3] w-full bg-zinc-950">
                    {poster && (
                      <Image
                        src={poster}
                        alt={item.name || "Series"}
                        fill
                        sizes="180px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute top-2 left-2 bg-emerald-400 text-black px-1.5 py-0.5 rounded text-[8px] font-black uppercase shadow-glow">
                      Hindi
                    </div>
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
