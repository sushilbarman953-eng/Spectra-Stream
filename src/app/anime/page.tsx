"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Sparkles, Volume2, Trophy, Swords, Skull, Flame } from "lucide-react";
import { animeService, AnimeItem, HINDI_DUBBED_ANIME_CATALOG } from "@/lib/animeService";
import { OttShelf } from "@/components/OttShelf";
import { soundFx } from "@/lib/soundFx";

export default function AnimePage() {
  const [top10Anime, setTop10Anime] = useState<any[]>([]);
  const [hindiDubbed, setHindiDubbed] = useState<any[]>([]);
  const [japaneseSubbed, setJapaneseSubbed] = useState<any[]>([]);
  const [shonenBattle, setShonenBattle] = useState<any[]>([]);
  const [darkFantasy, setDarkFantasy] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    const loadAnime = async () => {
      try {
        const [airing, popular] = await Promise.all([
          animeService.getTopAiring(),
          animeService.getHindiDubbedPopular(),
        ]);

        if (isMounted) {
          const mapToOtt = (items: AnimeItem[], audios: string[]) =>
            items.map((i) => ({
              id: i.mal_id,
              title: i.title_english || i.title,
              name: i.title_english || i.title,
              poster_path: i.images?.jpg?.image_url || null,
              backdrop_path: i.images?.jpg?.large_image_url || null,
              overview: i.synopsis || "Anime streaming in high quality.",
              vote_average: i.score,
              media_type: "tv" as const,
              audioLanguages: audios,
            }));

          const cleanPop = popular.length > 0 ? popular : HINDI_DUBBED_ANIME_CATALOG;
          const cleanAiring = airing.length > 0 ? airing : HINDI_DUBBED_ANIME_CATALOG;

          setTop10Anime(mapToOtt(cleanPop.slice(0, 10), ["HIN", "JAP", "ENG"]));
          setHindiDubbed(mapToOtt(cleanPop, ["HIN", "ENG"]));
          setJapaneseSubbed(mapToOtt(cleanAiring, ["JAP", "SUB"]));
          setShonenBattle(mapToOtt(cleanPop.slice(0, 8), ["HIN", "JAP"]));
          setDarkFantasy(mapToOtt(cleanPop.slice(4, 12), ["HIN", "JAP"]));
        }
      } catch (e) {
        console.error("Anime OTT load failed:", e);
      }
    };

    loadAnime();
    return () => { isMounted = false; };
  }, []);

  const heroItem = top10Anime[0] || {
    id: 38000,
    title: "Demon Slayer: Kimetsu no Yaiba",
    poster_path: "https://cdn.myanimelist.net/images/anime/1286/99889l.jpg",
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 pb-28 space-y-6">
      {/* SPOTLIGHT HERO */}
      {heroItem && (
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl">
          <Image
            src={heroItem.backdrop_path || heroItem.poster_path}
            alt={heroItem.title}
            fill
            priority
            unoptimized
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-black/35 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 max-w-lg space-y-1.5 z-10">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full bg-orange-500 text-black font-black text-[9px] uppercase tracking-wider">
                #1 Anime in India
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-white font-mono text-[9px] border border-white/20">
                Hindi Dub • Japanese Sub
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight drop-shadow truncate">
              {heroItem.title}
            </h1>
            <div className="flex items-center gap-2 pt-1">
              <Link
                href={`/watch/${heroItem.id}?type=tv&season=1&episode=1`}
                onClick={() => soundFx.playCinematicSwell()}
                className="px-3.5 py-1.5 rounded-xl bg-white text-black font-black text-xs shadow-glow hover:bg-zinc-200 active:scale-95 transition flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-black text-black" />
                <span>Stream Anime</span>
              </Link>
              <Link
                href={`/details/${heroItem.id}?type=tv&source=anime`}
                onClick={() => soundFx.playCinematicPop()}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs backdrop-blur-xl transition"
              >
                <span>Details</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TOP 10 ANIME IN INDIA */}
      <OttShelf
        title="Top 10 Anime in India"
        subtitle="Ranked by streaming hours across India"
        icon={Trophy}
        items={top10Anime}
        isRanked={true}
        type="tv"
      />

      {/* POPULAR IN HINDI DUB */}
      <OttShelf
        title="Popular in Hindi Dub"
        subtitle="Full season Hindi audio tracks"
        icon={Volume2}
        items={hindiDubbed}
        type="tv"
        badgeLabel="HINDI DUB"
      />

      {/* JAPANESE ORIGINAL AUDIO WITH ENGLISH SUBTITLES */}
      <OttShelf
        title="Japanese Simulcast (Subbed)"
        subtitle="Original audio with official English subs"
        icon={Sparkles}
        items={japaneseSubbed}
        type="tv"
        badgeLabel="JAP • SUB"
      />

      {/* SHONEN BATTLE */}
      <OttShelf
        title="Shonen & Power Battle"
        subtitle="Action, chakra, and cursed energy"
        icon={Swords}
        items={shonenBattle}
        type="tv"
      />

      {/* DARK FANTASY & THRILLERS */}
      <OttShelf
        title="Dark Fantasy & Psychological"
        subtitle="Grim suspense and supernatural horror"
        icon={Skull}
        items={darkFantasy}
        type="tv"
      />
    </div>
  );
}
