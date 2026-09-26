"use client";

import React, { useState, useEffect } from "react";
import { Tv, Trophy, ShieldAlert, Smile, Radio } from "lucide-react";
import { tmdb, MediaItem, BACKUP_HINDI_SERIES } from "@/lib/tmdb";
import { HeroCarousel } from "@/components/HeroCarousel";
import { OttShelf } from "@/components/OttShelf";

export default function SeriesPage() {
  const [top10Series, setTop10Series] = useState<MediaItem[]>(BACKUP_HINDI_SERIES);
  const [indianSeries, setIndianSeries] = useState<MediaItem[]>(BACKUP_HINDI_SERIES);
  const [crimeThrillers, setCrimeThrillers] = useState<MediaItem[]>(BACKUP_HINDI_SERIES);
  const [globalDubbed, setGlobalDubbed] = useState<MediaItem[]>(BACKUP_HINDI_SERIES);
  const [comedySitcoms, setComedySitcoms] = useState<MediaItem[]>(BACKUP_HINDI_SERIES);

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

          if (trend?.length) setTop10Series(enrich(trend.slice(0, 10), ["HIN", "ENG"]));
          if (inWeb?.length) setIndianSeries(enrich(inWeb, ["HIN"]));
          if (crime?.length) setCrimeThrillers(enrich(crime, ["HIN", "ENG"]));
          if (global?.length) setGlobalDubbed(enrich(global, ["HIN", "KOR", "ENG"]));
          if (com?.length) setComedySitcoms(enrich(com, ["HIN", "ENG"]));
        }
      } catch (e) {
        console.error("Series load error:", e);
      }
    };

    loadSeries();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 pb-28 space-y-6">
      {/* 10-POSTER HERO CAROUSEL */}
      <HeroCarousel items={top10Series} defaultType="tv" badgePrefix="Trending Series" />

      {/* OTT SHELVES */}
      <OttShelf title="Top 10 Series Today" subtitle="Most watched web shows across India" icon={Trophy} items={top10Series} isRanked={true} type="tv" />
      <OttShelf title="Indian OTT Originals" subtitle="Exclusive Hindi & regional shows" icon={Tv} items={indianSeries} type="tv" />
      <OttShelf title="Suspense & Crime Thrillers" subtitle="Investigative and dark mystery series" icon={ShieldAlert} items={crimeThrillers} type="tv" />
      <OttShelf title="Global Dramas in Hindi" subtitle="Korean & Spanish shows with Hindi audio" icon={Radio} items={globalDubbed} type="tv" badgeLabel="HIN DUB" />
      <OttShelf title="Comedy & Sitcoms" subtitle="Lighthearted episodes for binge-watching" icon={Smile} items={comedySitcoms} type="tv" />
    </div>
  );
}
