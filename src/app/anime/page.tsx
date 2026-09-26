"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Flame, Star, Sparkles, Volume2 } from "lucide-react";
import { animeService, AnimeItem, HINDI_DUBBED_ANIME_CATALOG } from "@/lib/animeService";
import { GlassCard } from "@/components/ui/GlassCard";
import { soundFx } from "@/lib/soundFx";

export default function AnimePage() {
  const [topAiring, setTopAiring] = useState<AnimeItem[]>(HINDI_DUBBED_ANIME_CATALOG.slice(0, 6));
  const [popular, setPopular] = useState<AnimeItem[]>(HINDI_DUBBED_ANIME_CATALOG);
  const [filterMode, setFilterMode] = useState<"hindi" | "all">("hindi");
  const [loading, setLoading] = useState(false);

  // Deduplicate anime lists by mal_id
  const dedupeAnime = (list: AnimeItem[]): AnimeItem[] => {
    const seen = new Set<number>();
    return list.filter((item) => {
      if (!item.mal_id || seen.has(item.mal_id)) return false;
      seen.add(item.mal_id);
      return true;
    });
  };

  useEffect(() => {
    let isMounted = true;

    const fetchAnime = async () => {
      try {
        const [airingData, popData] = await Promise.all([
          animeService.getTopAiring(),
          animeService.getHindiDubbedPopular(),
        ]);

        if (isMounted) {
          const finalAiring = airingData && airingData.length > 0 ? airingData : HINDI_DUBBED_ANIME_CATALOG;
          const finalPopular = popData && popData.length > 0 ? popData : HINDI_DUBBED_ANIME_CATALOG;

          setTopAiring(dedupeAnime(finalAiring));
          setPopular(dedupeAnime(finalPopular));
        }
      } catch (e) {
        console.error("Anime fetch error:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAnime();

    return () => {
      isMounted = false;
    };
  }, []);

  const displayList = filterMode === "hindi"
    ? popular.filter((a) => a.hasHindiDub !== false)
    : popular;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 pb-28 space-y-6">
      {/* Top Banner */}
      <GlassCard className="p-4 sm:p-6 rounded-3xl border border-white/15 bg-[#0e0e14]/75 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black tracking-widest uppercase">
              <Flame className="w-3.5 h-3.5 fill-orange-400" />
              <span>Anime Hub • India</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Hindi Dubbed & Simulcast Anime
            </h1>
            <p className="text-xs text-zinc-400 max-w-lg">
              Stream top-rated anime with official Hindi dubs, dual-audio tracks, and high-speed Indian mirrors.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 self-start sm:self-center p-1 rounded-2xl bg-white/5 border border-white/10">
            <button
              onClick={() => {
                soundFx.playCinematicPop();
                setFilterMode("hindi");
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                filterMode === "hindi"
                  ? "bg-white text-black shadow-glow font-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Hindi Dubbed</span>
            </button>
            <button
              onClick={() => {
                soundFx.playCinematicPop();
                setFilterMode("all");
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                filterMode === "all"
                  ? "bg-white text-black shadow-glow font-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <span>All Anime</span>
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Airing Carousel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white tracking-wide uppercase flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Top Airing Anime</span>
          </h3>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {topAiring.map((item, idx) => (
            <Link
              key={`airing-${item.mal_id}-${idx}`}
              href={`/details/${item.mal_id}?type=tv&source=anime`}
              onClick={() => soundFx.playCinematicPop()}
              className="flex-none w-36 sm:w-44 group"
            >
              <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 group-hover:border-white/30 transition shadow-lg">
                <Image
                  src={item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || ""}
                  alt={item.title || "Anime"}
                  fill
                  unoptimized
                  sizes="180px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {item.score && (
                  <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] text-white font-bold border border-white/15">
                    <Star className="w-2.5 h-2.5 fill-white text-white" />
                    {item.score.toFixed(1)}
                  </div>
                )}
                {item.hasHindiDub && (
                  <div className="absolute bottom-2 left-2 bg-emerald-500/90 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] text-black font-black uppercase">
                    Hindi Dub
                  </div>
                )}
              </div>
              <h4 className="text-xs font-bold text-white truncate mt-1.5">{item.title_english || item.title}</h4>
              <p className="text-[10px] text-zinc-400">{item.episodes ? `${item.episodes} Episodes` : "Simulcasting"}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Grid: POPULAR IN HINDI */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white tracking-wide uppercase flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span>{filterMode === "hindi" ? "Popular in Hindi" : "All Trending Anime"}</span>
          </h3>
          <span className="text-[10px] text-zinc-400 font-mono font-bold">{displayList.length} Titles</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="aspect-[2/3] rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {displayList.map((item, idx) => (
              <Link
                key={`anime-grid-${item.mal_id}-${idx}`}
                href={`/details/${item.mal_id}?type=tv&source=anime`}
                onClick={() => soundFx.playCinematicPop()}
                className="group relative"
              >
                <GlassCard
                  hoverEffect
                  className="overflow-hidden border border-white/10 rounded-2xl h-full flex flex-col justify-between bg-[#0b0b10]"
                >
                  <div className="relative aspect-[2/3] w-full bg-zinc-950">
                    <Image
                      src={item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || ""}
                      alt={item.title || "Anime"}
                      fill
                      unoptimized
                      sizes="180px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] text-white font-bold border border-white/15">
                      <Star className="w-2.5 h-2.5 fill-white text-white" />
                      {item.score?.toFixed(1) || "8.2"}
                    </div>
                    {item.hasHindiDub && (
                      <div className="absolute top-2 left-2 bg-emerald-400 text-black px-1.5 py-0.5 rounded text-[8px] font-black uppercase shadow-glow">
                        Hindi
                      </div>
                    )}
                  </div>
                  <div className="p-2.5 bg-black/60 space-y-0.5">
                    <h4 className="text-xs font-semibold text-white truncate">{item.title_english || item.title}</h4>
                    <span className="text-[9px] text-zinc-400 block font-mono">
                      {item.episodes ? `${item.episodes} EPS` : "SERIES"}
                    </span>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
