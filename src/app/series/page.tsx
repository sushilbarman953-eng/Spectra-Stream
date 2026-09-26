"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Tv, Flame, Trophy, ShieldAlert, Sparkles, Smile, Radio } from "lucide-react";
import { tmdb, MediaItem, IMAGE_BASE, BACKUP_HINDI_SERIES } from "@/lib/tmdb";
import { OttShelf } from "@/components/OttShelf";
import { soundFx } from "@/lib/soundFx";

export default function SeriesPage() {
  const [top10Series, setTop10Series] = useState<MediaItem[]>([]);
  const [indianSeries, setIndianSeries] = useState<MediaItem[]>([]);
  const [crimeThrillers, setCrimeThrillers] = useState<MediaItem[]>([]);
  const [globalDubbed, setGlobalDubbed] = useState<MediaItem[]>([]);
  const [comedySitcoms, setComedySitcoms] = useState<MediaItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    const loadSeries = async () => {
      try {
        const [trend, inWeb, crime, global, com] = await Promise.all([
          tmdb.getTrending("tv"),
          tmdb.getHindiSeries(),
          tmdb.discoverMedia("tv", 80),
          tmdb.discoverMedia("tv", 10765, "&with_original_language=ko|es|en"),
          tmdb.discoverMedia("tv", 35),
        ]);

        if (isMounted) {
          const enrich = (items: MediaItem[], audios: string[]) =>
            (items?.length ? items : BACKUP_HINDI_SERIES).map((i) => ({ ...i, audioLanguages: audios }));

          setTop10Series(enrich(trend?.slice(0, 10) || [], ["HIN", "ENG"]));
          setIndianSeries(enrich(inWeb, ["HIN"]));
          setCrimeThrillers(enrich(crime, ["HIN", "ENG"]));
          setGlobalDubbed(enrich(global, ["HIN", "KOR", "ENG"]));
          setComedySitcoms(enrich(com, ["HIN", "ENG"]));
        }
      } catch (e) {
        console.error("Series OTT load failed:", e);
      }
    };

    loadSeries();
    return () => { isMounted = false; };
  }, []);

  const heroItem = top10Series[0] || BACKUP_HINDI_SERIES[0];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 pb-28 space-y-6">
      {/* SPOTLIGHT HERO */}
      {heroItem && (
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl">
          {heroItem.backdrop_path || heroItem.poster_path ? (
            <Image
              src={`${IMAGE_BASE}/w780${heroItem.backdrop_path || heroItem.poster_path}`}
              alt={heroItem.name || "Series"}
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
                Top Series in India
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-white font-mono text-[9px] border border-white/20">
                Hindi Dub
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight drop-shadow truncate">
              {heroItem.name}
            </h1>
            <div className="flex items-center gap-2 pt-1">
              <Link
                href={`/watch/${heroItem.id}?type=tv&season=1&episode=1`}
                onClick={() => soundFx.playCinematicSwell()}
                className="px-3.5 py-1.5 rounded-xl bg-white text-black font-black text-xs shadow-glow hover:bg-zinc-200 active:scale-95 transition flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-black text-black" />
                <span>Watch S1:E1</span>
              </Link>
              <Link
                href={`/details/${heroItem.id}?type=tv`}
                onClick={() => soundFx.playCinematicPop()}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs backdrop-blur-xl transition"
              >
                <span>Episodes</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TOP 10 SERIES */}
      <OttShelf
        title="Top 10 Series Today"
        subtitle="Most watched web shows across India"
        icon={Trophy}
        items={top10Series}
        isRanked={true}
        type="tv"
      />

      {/* INDIAN ORIGINALS */}
      <OttShelf
        title="Indian OTT Originals"
        subtitle="Exclusive Hindi & regional shows"
        icon={Tv}
        items={indianSeries}
        type="tv"
      />

      {/* CRIME & SUSPENSE */}
      <OttShelf
        title="Suspense & Crime Thrillers"
        subtitle="Investigative and dark mystery series"
        icon={ShieldAlert}
        items={crimeThrillers}
        type="tv"
      />

      {/* GLOBAL DUBBED (K-DRAMAS IN HINDI) */}
      <OttShelf
        title="Global Dramas in Hindi"
        subtitle="Korean & Spanish shows with Hindi audio"
        icon={Radio}
        items={globalDubbed}
        type="tv"
        badgeLabel="HIN DUB"
      />

      {/* COMEDY SITCOMS */}
      <OttShelf
        title="Comedy & Sitcoms"
        subtitle="Lighthearted episodes for binge-watching"
        icon={Smile}
        items={comedySitcoms}
        type="tv"
      />
    </div>
  );
}
