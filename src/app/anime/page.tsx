"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Volume2, Trophy, Swords, Skull } from "lucide-react";
import { animeService, AnimeItem, HINDI_DUBBED_ANIME_CATALOG } from "@/lib/animeService";
import { HeroCarousel } from "@/components/HeroCarousel";
import { OttShelf } from "@/components/OttShelf";

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

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 pb-28 space-y-6">
      {/* 10-POSTER HERO CAROUSEL */}
      <HeroCarousel items={top10Anime} defaultType="tv" badgePrefix="Top Anime" />

      {/* OTT SHELVES */}
      <OttShelf title="Top 10 Anime in India" subtitle="Ranked by streaming hours across India" icon={Trophy} items={top10Anime} isRanked={true} type="tv" />
      <OttShelf title="Popular in Hindi Dub" subtitle="Full season Hindi audio tracks" icon={Volume2} items={hindiDubbed} type="tv" badgeLabel="HINDI DUB" />
      <OttShelf title="Japanese Simulcast (Subbed)" subtitle="Original audio with official English subs" icon={Sparkles} items={japaneseSubbed} type="tv" badgeLabel="JAP • SUB" />
      <OttShelf title="Shonen & Power Battle" subtitle="Action, chakra, and cursed energy" icon={Swords} items={shonenBattle} type="tv" />
      <OttShelf title="Dark Fantasy & Thrillers" subtitle="Grim suspense and supernatural horror" icon={Skull} items={darkFantasy} type="tv" />
    </div>
  );
}
