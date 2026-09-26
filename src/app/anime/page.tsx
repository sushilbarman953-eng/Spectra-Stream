"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Flame, Star, Sparkles, Volume2 } from "lucide-react";
import { animeService, AnimeItem, HINDI_DUBBED_ANIME_CATALOG } from "@/lib/animeService";
import { soundFx } from "@/lib/soundFx";

export default function AnimePage() {
  const [topAiring, setTopAiring] = useState<AnimeItem[]>(HINDI_DUBBED_ANIME_CATALOG.slice(0, 6));
  const [popular, setPopular] = useState<AnimeItem[]>(HINDI_DUBBED_ANIME_CATALOG);
  const [filterMode, setFilterMode] = useState<"hindi" | "all">("hindi");

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
          if (airingData?.length) setTopAiring(dedupeAnime(airingData));
          if (popData?.length) setPopular(dedupeAnime(popData));
        }
      } catch (e) {
        console.error("Anime fetch error:", e);
      }
    };
    fetchAnime();
    return () => { isMounted = false; };
  }, []);

  const displayList = filterMode === "hindi"
    ? popular.filter((a) => a.hasHindiDub !== false)
    : popular;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 pb-28 space-y-5">
      {/* 1. COMPACT AIRING ROW */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Top Airing Anime</span>
          </h3>
          <span className="text-[10px] text-zinc-500 font-mono">{topAiring.length} Shows</span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 px-1">
          {topAiring.map((item, idx) => (
            <Link
              key={`airing-${item.mal_id}-${idx}`}
              href={`/details/${item.mal_id}?type=tv&source=anime`}
              onClick={() => soundFx.playCinematicPop()}
              className="flex-none w-28 sm:w-32 group"
            >
              <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-zinc-950 border border-white/10 group-hover:border-white/30 transition shadow-md">
                <Image
                  src={item.images?.jpg?.image_url || ""}
                  alt={item.title || "Anime"}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {item.score && (
                  <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/80 backdrop-blur-md px-1 py-0.5 rounded text-[8px] text-white font-bold border border-white/15">
                    <Star className="w-2 h-2 fill-white text-white" />
                    {item.score.toFixed(1)}
                  </div>
                )}
                {item.hasHindiDub && (
                  <div className="absolute bottom-1.5 left-1.5 bg-emerald-500/90 px-1 py-0.5 rounded text-[7px] text-black font-black uppercase">
                    Hindi Dub
                  </div>
                )}
              </div>
              <h4 className="text-[11px] font-bold text-white truncate mt-1">{item.title_english || item.title}</h4>
              <p className="text-[9px] text-zinc-500 font-mono">{item.episodes ? `${item.episodes} EPS` : "AIRING"}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* 2. POPULAR IN HINDI (COMPACT ROW) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Popular in Hindi Dub</span>
          </h3>
          <span className="text-[10px] text-zinc-500 font-mono">{displayList.length} Titles</span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 px-1">
          {displayList.map((item, idx) => (
            <Link
              key={`anime-row-${item.mal_id}-${idx}`}
              href={`/details/${item.mal_id}?type=tv&source=anime`}
              onClick={() => soundFx.playCinematicPop()}
              className="flex-none w-28 sm:w-32 group"
            >
              <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-zinc-950 border border-white/10 group-hover:border-white/30 transition shadow-md">
                <Image
                  src={item.images?.jpg?.image_url || ""}
                  alt={item.title || "Anime"}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-1.5 left-1.5 bg-emerald-400 text-black px-1 py-0.5 rounded text-[7px] font-black uppercase shadow-glow">
                  Hindi
                </div>
                {item.score && (
                  <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/80 backdrop-blur-md px-1 py-0.5 rounded text-[8px] text-white font-bold border border-white/15">
                    <Star className="w-2 h-2 fill-white text-white" />
                    {item.score.toFixed(1)}
                  </div>
                )}
              </div>
              <h4 className="text-[11px] font-bold text-white truncate mt-1">{item.title_english || item.title}</h4>
              <p className="text-[9px] text-zinc-500 font-mono">{item.episodes ? `${item.episodes} EPS` : "SERIES"}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
