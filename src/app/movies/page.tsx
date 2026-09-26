"use client";

import React, { useState, useEffect } from "react";
import { Film, Flame, Shield, Laugh, Crosshair, Trophy } from "lucide-react";
import { tmdb, MediaItem, BACKUP_HINDI_MOVIES } from "@/lib/tmdb";
import { HeroCarousel } from "@/components/HeroCarousel";
import { OttShelf } from "@/components/OttShelf";

export default function MoviesPage() {
  const [top10Movies, setTop10Movies] = useState<MediaItem[]>(BACKUP_HINDI_MOVIES);
  const [bollywood, setBollywood] = useState<MediaItem[]>(BACKUP_HINDI_MOVIES);
  const [southDubbed, setSouthDubbed] = useState<MediaItem[]>(BACKUP_HINDI_MOVIES);
  const [hollywoodDual, setHollywoodDual] = useState<MediaItem[]>(BACKUP_HINDI_MOVIES);
  const [actionHits, setActionHits] = useState<MediaItem[]>(BACKUP_HINDI_MOVIES);
  const [comedyHits, setComedyHits] = useState<MediaItem[]>(BACKUP_HINDI_MOVIES);

  useEffect(() => {
    let isMounted = true;
    const loadMovies = async () => {
      try {
        const [trend, bolly, south, holly, act, com] = await Promise.all([
          tmdb.getTrending("movie"),
          tmdb.getHindiCinema(),
          tmdb.discoverMedia("movie", undefined, "&with_original_language=te|ta|ml"),
          tmdb.discoverMedia("movie", 28, "&with_original_language=en"),
          tmdb.discoverMedia("movie", 28),
          tmdb.discoverMedia("movie", 35),
        ]);

        if (isMounted) {
          const enrich = (items: MediaItem[], audios: string[]) =>
            (items?.length ? items : BACKUP_HINDI_MOVIES).map((i) => ({ ...i, audioLanguages: audios }));

          if (trend?.length) setTop10Movies(enrich(trend.slice(0, 10), ["HIN", "ENG", "TAM"]));
          if (bolly?.length) setBollywood(enrich(bolly, ["HIN"]));
          if (south?.length) setSouthDubbed(enrich(south, ["TEL", "TAM", "MAL", "HIN"]));
          if (holly?.length) setHollywoodDual(enrich(holly, ["HIN", "ENG"]));
          if (act?.length) setActionHits(enrich(act, ["HIN", "ENG"]));
          if (com?.length) setComedyHits(enrich(com, ["HIN"]));
        }
      } catch (e) {
        console.error("Movies load error:", e);
      }
    };

    loadMovies();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 pb-28 space-y-6">
      {/* 10-POSTER HERO CAROUSEL */}
      <HeroCarousel items={top10Movies} defaultType="movie" badgePrefix="Blockbuster" />

      {/* OTT SHELVES */}
      <OttShelf title="Top 10 Movies Today" subtitle="Most streamed movies in India" icon={Trophy} items={top10Movies} isRanked={true} type="movie" />
      <OttShelf title="Pan-India Dubbed Blockbusters" subtitle="Telugu & Tamil hits with Hindi audio" icon={Flame} items={southDubbed} type="movie" />
      <OttShelf title="Hollywood in Hindi" subtitle="Dual-Audio (Hindi + English)" icon={Shield} items={hollywoodDual} type="movie" badgeLabel="HIN • ENG" />
      <OttShelf title="Pure Bollywood Cinema" subtitle="Original Hindi blockbusters" icon={Film} items={bollywood} type="movie" />
      <OttShelf title="Action & Combat" subtitle="High-octane spectacles" icon={Crosshair} items={actionHits} type="movie" />
      <OttShelf title="Comedy & Family Entertaining" subtitle="Laughs and feel-good movies" icon={Laugh} items={comedyHits} type="movie" />
    </div>
  );
}
