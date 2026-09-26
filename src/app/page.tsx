"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Play, Film, Volume2, Star } from "lucide-react";
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
    let isMounted = true;

    const loadCatalogs = async () => {
      try {
        const [trendData, cinemaData, seriesData] = await Promise.all([
          tmdb.getTrendingIndia(),
          tmdb.getHindiCinema(),
          tmdb.getHindiSeries(),
        ]);

        if (isMounted) {
          // Normalize whether returned as array directly or as { results: [...] }
          setTrending(Array.isArray(trendData) ? trendData : (trendData as any)?.results || []);
          setHindiCinema(Array.isArray(cinemaData) ? cinemaData : (cinemaData as any)?.results || []);
          setHindiSeries(Array.isArray(seriesData) ? seriesData : (seriesData as any)?.results || []);
        }
      } catch (e) {
        console.error("Catalog load failed:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCatalogs();

    return () => {
      isMounted = false;
    };
  }, []);

  const heroItem = trending.length > 0 ? trending[0] : (hindiCinema[0] || null);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-2 pb-28 space-y-6">
      {/* 1. HERO SHOWCASE */}
      {heroItem ? (
        <div className="relative aspect-[16/10] sm:aspect-[21/9] w-full rounded-3xl overflow-hidden border border-white/15 bg-black shadow-2xl">
          {heroItem.backdrop_path || heroItem.poster_path ? (
            <Image
              src={`${IMAGE_BASE}/w1280${heroItem.backdrop_path || heroItem.poster_path}`}
              alt={heroItem.title || heroItem.name || "Hero Banner"}
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
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/90 text-black font-black text-[9px] uppercase tracking-wider">
                Trending in India
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-white font-mono text-[9px] uppercase border border-white/20">
                Hindi Dubbed Available
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
              {heroItem.title || heroItem.name}
            </h1>
            <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed max-w-md">
              {heroItem.overview || "Stream in ultra high-definition with low-latency Indian servers."}
            </p>

            <div className="flex items-center gap-2 pt-1">
              <Link
                href={`/watch/${heroItem.id}?type=${heroItem.media_type || (heroItem.name ? "tv" : "movie")}`}
                onClick={() => soundFx.playCinematicSwell()}
              >
                <GlassButton variant="primary" className="text-xs px-5 py-2 font-black flex items-center gap-1.5 shadow-glow">
                  <Play className="w-3.5 h-3.5 fill-black text-black" />
                  <span>Stream Now</span>
                </GlassButton>
              </Link>

              <Link
                href={`/details/${heroItem.id}?type=${heroItem.media_type || (heroItem.name ? "tv" : "movie")}`}
                onClick={() => soundFx.playCinematicPop()}
              >
                <GlassButton variant="secondary" className="text-xs px-4 py-2 font-bold">
                  <span>Dossier</span>
                </GlassButton>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        loading && (
          <div className="aspect-[16/10] sm:aspect-[21/9] w-full rounded-3xl bg-white/[0.03] border border-white/10 animate-pulse flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-zinc-500 animate-spin" />
          </div>
        )
      )}

      {/* 2. POPULAR HINDI CINEMA SHELF */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white uppercase tracking-wide flex items-center gap-2">
            <Film className="w-4 h-4 text-white" />
            <span>Popular Hindi Cinema</span>
          </h3>
          <span className="text-[10px] text-zinc-500 font-mono">{hindiCinema.length} Films</span>
        </div>

        {hindiCinema.length === 0 && loading ? (
          <div className="flex gap-3 overflow-hidden">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="w-36 sm:w-44 aspect-[2/3] rounded-2xl bg-white/5 animate-pulse flex-none" />
            ))}
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {hindiCinema.map((item, idx) => {
              const poster = item.poster_path ? `${IMAGE_BASE}/w342${item.poster_path}` : null;
              return (
                <Link
                  key={`cinema-${item.id}-${idx}`}
                  href={`/details/${item.id}?type=movie`}
                  onClick={() => soundFx.playCinematicPop()}
                  className="flex-none w-36 sm:w-44 group"
                >
                  <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 group-hover:border-white/30 transition shadow-lg">
                    {poster ? (
                      <Image
                        src={poster}
                        alt={item.title || "Movie"}
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
                  <h4 className="text-xs font-bold text-white truncate mt-1.5">{item.title}</h4>
                  <p className="text-[10px] text-zinc-400">{item.release_date?.slice(0, 4) || "Cinema"}</p>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. TOP INDIAN WEB SERIES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white uppercase tracking-wide flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span>Top Indian Web Series</span>
          </h3>
          <span className="text-[10px] text-zinc-500 font-mono">{hindiSeries.length} Series</span>
        </div>

        {hindiSeries.length === 0 && loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="aspect-[2/3] rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {hindiSeries.slice(0, 12).map((item, idx) => {
              const poster = item.poster_path ? `${IMAGE_BASE}/w342${item.poster_path}` : null;
              return (
                <Link
                  key={`series-${item.id}-${idx}`}
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
        )}
      </div>
    </div>
  );
}
