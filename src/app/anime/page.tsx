"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Star, Flame, Sparkles, Volume2, Swords, Skull, Trophy } from "lucide-react";
import { animeService, AnimeItem, HINDI_DUBBED_ANIME_CATALOG } from "@/lib/animeService";
import { soundFx } from "@/lib/soundFx";

export default function AnimePage() {
  const [topAiring, setTopAiring] = useState<AnimeItem[]>(HINDI_DUBBED_ANIME_CATALOG.slice(0, 6));
  const [popularHindi, setPopularHindi] = useState<AnimeItem[]>(HINDI_DUBBED_ANIME_CATALOG);
  const [shonen, setShonen] = useState<AnimeItem[]>(HINDI_DUBBED_ANIME_CATALOG.slice(0, 5));
  const [darkFantasy, setDarkFantasy] = useState<AnimeItem[]>(HINDI_DUBBED_ANIME_CATALOG.slice(2, 6));

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
          if (popData?.length) {
            const cleanPop = dedupeAnime(popData);
            setPopularHindi(cleanPop);
            setShonen(cleanPop.slice(0, 6));
            setDarkFantasy(cleanPop.slice(4, 10));
          }
        }
      } catch (e) {
        console.error("Anime fetch error:", e);
      }
    };
    fetchAnime();
    return () => { isMounted = false; };
  }, []);

  const heroItem = popularHindi[0] || HINDI_DUBBED_ANIME_CATALOG[0];

  const renderShelf = (title: string, icon: any, items: AnimeItem[], badge = "Hindi") => {
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
          {items.map((item, idx) => (
            <Link
              key={`anime-shelf-${item.mal_id}-${idx}`}
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
                  {badge}
                </div>
                {item.score && (
                  <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/80 backdrop-blur-md px-1 py-0.5 rounded text-[8px] text-white font-bold border border-white/15">
                    <Star className="w-2 h-2 fill-white text-white" />
                    {item.score.toFixed(1)}
                  </div>
                )}
              </div>
              <h4 className="text-[11px] font-bold text-white truncate mt-1">{item.title_english || item.title}</h4>
              <p className="text-[9px] text-zinc-500 font-mono">{item.episodes ? `${item.episodes} EPS` : "AIRING"}</p>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 pb-28 space-y-5">
      {/* 1. ANIME SPOTLIGHT CAROUSEL */}
      {heroItem && (
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden border border-white/10 bg-black shadow-xl">
          <Image
            src={heroItem.images?.jpg?.large_image_url || heroItem.images?.jpg?.image_url || ""}
            alt={heroItem.title}
            fill
            priority
            unoptimized
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-black/40 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 max-w-lg space-y-1.5 z-10">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full bg-orange-500 text-black font-black text-[9px] uppercase tracking-wider">Anime Hub India</span>
              <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-white font-mono text-[9px] border border-white/20">Hindi Dub</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight drop-shadow truncate">{heroItem.title_english || heroItem.title}</h1>
            <div className="flex items-center gap-2 pt-1">
              <Link href={`/watch/${heroItem.mal_id}?type=tv&season=1&episode=1`} onClick={() => soundFx.playCinematicSwell()} className="px-3.5 py-1.5 rounded-xl bg-white text-black font-black text-xs shadow-glow hover:bg-zinc-200 active:scale-95 transition flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 fill-black text-black" />
                <span>Stream Anime</span>
              </Link>
              <Link href={`/details/${heroItem.mal_id}?type=tv&source=anime`} onClick={() => soundFx.playCinematicPop()} className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs backdrop-blur-xl transition">
                <span>Details</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 2. TOP AIRING */}
      {renderShelf("Top Airing Simulcasts", Sparkles, topAiring, "Simulcast")}

      {/* 3. POPULAR IN HINDI */}
      {renderShelf("Popular in Hindi Dub", Volume2, popularHindi, "Hindi")}

      {/* 4. SHONEN BATTLE */}
      {renderShelf("Shonen & Action Battle", Swords, shonen, "Hindi")}

      {/* 5. DARK FANTASY & SUPERNATURAL */}
      {renderShelf("Dark Fantasy & Thrillers", Skull, darkFantasy, "Hindi")}

      {/* 6. ALL TIME LEGENDS */}
      {renderShelf("All-Time Anime Legends", Trophy, HINDI_DUBBED_ANIME_CATALOG, "Legend")}
    </div>
  );
}
