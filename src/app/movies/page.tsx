"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Film, Flame, Shield, Compass, Ghost, Laugh, Crosshair, Trophy } from "lucide-react";
import { tmdb, MediaItem, IMAGE_BASE, BACKUP_HINDI_MOVIES } from "@/lib/tmdb";
import { OttShelf } from "@/components/OttShelf";
import { soundFx } from "@/lib/soundFx";

export default function MoviesPage() {
  const [top10Movies, setTop10Movies] = useState<MediaItem[]>([]);
  const [bollywood, setBollywood] = useState<MediaItem[]>([]);
  const [southDubbed, setSouthDubbed] = useState<MediaItem[]>([]);
  const [hollywoodDual, setHollywoodDual] = useState<MediaItem[]>([]);
  const [actionHits, setActionHits] = useState<MediaItem[]>([]);
  const [comedyHits, setComedyHits] = useState<MediaItem[]>([]);

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

          setTop10Movies(enrich(trend?.slice(0, 10) || [], ["HIN", "ENG", "TAM"]));
          setBollywood(enrich(bolly, ["HIN"]));
          setSouthDubbed(enrich(south, ["TEL", "TAM", "MAL", "HIN"]));
          setHollywoodDual(enrich(holly, ["HIN", "ENG"]));
          setActionHits(enrich(act, ["HIN", "ENG"]));
          setComedyHits(enrich(com, ["HIN"]));
        }
      } catch (e) {
        console.error("Movies OTT load failed:", e);
      }
    };

    loadMovies();
    return () => { isMounted = false; };
  }, []);

  const heroItem = top10Movies[0] || BACKUP_HINDI_MOVIES[0];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 pb-28 space-y-6">
      {/* SPOTLIGHT HERO */}
      {heroItem && (
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl">
          {heroItem.backdrop_path || heroItem.poster_path ? (
            <Image
              src={`${IMAGE_BASE}/w780${heroItem.backdrop_path || heroItem.poster_path}`}
              alt={heroItem.title || "Movie"}
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
                Featured Blockbuster
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-white font-mono text-[9px] border border-white/20">
                Multi-Audio
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight drop-shadow truncate">
              {heroItem.title}
            </h1>
            <div className="flex items-center gap-2 pt-1">
              <Link
                href={`/watch/${heroItem.id}?type=movie`}
                onClick={() => soundFx.playCinematicSwell()}
                className="px-3.5 py-1.5 rounded-xl bg-white text-black font-black text-xs shadow-glow hover:bg-zinc-200 active:scale-95 transition flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-black text-black" />
                <span>Stream</span>
              </Link>
              <Link
                href={`/details/${heroItem.id}?type=movie`}
                onClick={() => soundFx.playCinematicPop()}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs backdrop-blur-xl transition"
              >
                <span>Info</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TOP 10 MOVIES */}
      <OttShelf
        title="Top 10 Movies Today"
        subtitle="Most streamed movies in India"
        icon={Trophy}
        items={top10Movies}
        isRanked={true}
        type="movie"
      />

      {/* SOUTH INDIAN IN HINDI */}
      <OttShelf
        title="Pan-India Dubbed Blockbusters"
        subtitle="Telugu & Tamil hits with Hindi audio"
        icon={Flame}
        items={southDubbed}
        type="movie"
      />

      {/* HOLLYWOOD IN HINDI */}
      <OttShelf
        title="Hollywood in Hindi"
        subtitle="Dual-Audio (Hindi + English)"
        icon={Shield}
        items={hollywoodDual}
        type="movie"
        badgeLabel="HIN • ENG"
      />

      {/* BOLLYWOOD HITS */}
      <OttShelf
        title="Pure Bollywood Cinema"
        subtitle="Original Hindi blockbusters"
        icon={Film}
        items={bollywood}
        type="movie"
      />

      {/* ACTION & ADVENTURE */}
      <OttShelf
        title="Action & Combat"
        subtitle="High-octane spectacles"
        icon={Crosshair}
        items={actionHits}
        type="movie"
      />

      {/* COMEDY & FEEL-GOOD */}
      <OttShelf
        title="Comedy & Family Entertaining"
        subtitle="Laughs and feel-good movies"
        icon={Laugh}
        items={comedyHits}
        type="movie"
      />
    </div>
  );
}
