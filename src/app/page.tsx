"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Film, History, ArrowRight, Flame, Trophy, Tv, Compass } from "lucide-react";
import { tmdb, MediaItem, IMAGE_BASE, BACKUP_HINDI_MOVIES, BACKUP_HINDI_SERIES } from "@/lib/tmdb";
import { playbackHistory, WatchProgressItem } from "@/lib/playbackHistory";
import { HeroCarousel } from "@/components/HeroCarousel";
import { OttShelf } from "@/components/OttShelf";
import { soundFx } from "@/lib/soundFx";

export default function HomePage() {
  const [top10India, setTop10India] = useState<MediaItem[]>(BACKUP_HINDI_MOVIES);
  const [southIndianHits, setSouthIndianHits] = useState<MediaItem[]>(BACKUP_HINDI_MOVIES);
  const [bollywoodHits, setBollywoodHits] = useState<MediaItem[]>(BACKUP_HINDI_MOVIES);
  const [crimeSeries, setCrimeSeries] = useState<MediaItem[]>(BACKUP_HINDI_SERIES);
  const [regionalSpotlight, setRegionalSpotlight] = useState<MediaItem[]>(BACKUP_HINDI_MOVIES);
  const [continueWatching, setContinueWatching] = useState<WatchProgressItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    const loadOttData = async () => {
      const history = playbackHistory.getAll();
      setContinueWatching(history.length > 0 ? history : [
        { id: "c1", tmdbId: 976573, title: "Jawan", type: "movie", posterPath: "/jCdqvdhpj340M1c6R3w2P6uM3wK.jpg", currentTime: 2400, duration: 9800, progressPercent: 24, lastWatched: Date.now() },
        { id: "c2", tmdbId: 119051, title: "Wednesday", type: "tv", season: 1, episode: 2, posterPath: "/9PFonQ95165agq9uWjWn4U3X3v7.jpg", currentTime: 1200, duration: 3200, progressPercent: 38, lastWatched: Date.now() }
      ]);

      try {
        const [trendData, southData, bollyData, crimeData, regData] = await Promise.all([
          tmdb.getTrendingIndia(),
          tmdb.discoverMedia("movie", 28, "&with_original_language=te|ta"),
          tmdb.getHindiCinema(),
          tmdb.discoverMedia("tv", 80, "&with_original_language=hi"),
          tmdb.discoverMedia("movie", undefined, "&with_original_language=ml|kn|bn"),
        ]);

        if (isMounted) {
          const enrich = (items: MediaItem[], audios: string[]) =>
            items.map((i) => ({ ...i, audioLanguages: audios }));

          if (trendData?.length) setTop10India(enrich(trendData.slice(0, 10), ["HIN", "TAM", "TEL"]));
          if (southData?.length) setSouthIndianHits(enrich(southData, ["TEL", "TAM", "HIN"]));
          if (bollyData?.length) setBollywoodHits(enrich(bollyData, ["HIN"]));
          if (crimeData?.length) setCrimeSeries(enrich(crimeData, ["HIN", "ENG"]));
          if (regData?.length) setRegionalSpotlight(enrich(regData, ["MAL", "KAN", "BEN"]));
        }
      } catch (e) {
        console.error("Home load error:", e);
      }
    };

    loadOttData();
    window.addEventListener("spectra_playback_updated", () => setContinueWatching(playbackHistory.getAll()));
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 pb-28 space-y-6">
      {/* 1. TOP 10-POSTER HERO CAROUSEL */}
      <HeroCarousel items={top10India} defaultType="movie" badgePrefix="Top in India" />

      {/* 2. CONTINUE WATCHING */}
      {continueWatching.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-emerald-400" />
              <span>Continue Watching</span>
            </h3>
            <Link href="/me" onClick={() => soundFx.playCinematicPop()} className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-0.5 font-bold">
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1 px-1">
            {continueWatching.map((item, idx) => (
              <Link
                key={`continue-${item.id}-${idx}`}
                href={item.type === "tv" ? `/watch/${item.tmdbId}?type=tv&season=${item.season || 1}&episode=${item.episode || 1}` : `/watch/${item.tmdbId}?type=movie`}
                onClick={() => soundFx.playCinematicSwell()}
                className="flex-none snap-start w-52 sm:w-60 p-2 rounded-2xl bg-[#0e0e14]/80 border border-white/10 hover:border-white/25 transition group flex items-center gap-2.5 shadow-md"
              >
                <div className="relative w-12 h-16 rounded-xl overflow-hidden bg-zinc-950 flex-none border border-white/15">
                  {item.posterPath ? (
                    <Image src={`${IMAGE_BASE}/w185${item.posterPath}`} alt={item.title} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-zinc-600"><Film className="w-4 h-4" /></div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-4 h-4 fill-white text-white" />
                  </div>
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-zinc-300 font-bold uppercase">{item.type === "tv" ? `S${item.season || 1}:E${item.episode || 1}` : "Movie"}</span>
                  <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                  <div className="space-y-0.5">
                    <div className="w-full h-1 bg-white/15 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${item.progressPercent || 35}%` }} />
                    </div>
                    <span className="text-[9px] text-zinc-400 font-mono block">{item.progressPercent || 35}% completed</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 3. NUMBERED TOP 10 OTT SHELF */}
      <OttShelf title="Top 10 in India Today" subtitle="Ranked by active streams & viewership" icon={Trophy} items={top10India} isRanked={true} />

      {/* 4. SOUTH INDIAN PAN-INDIA */}
      <OttShelf title="South Indian Hits in Hindi" subtitle="Telugu, Tamil & Kannada Blockbusters" icon={Flame} items={southIndianHits} type="movie" />

      {/* 5. BOLLYWOOD */}
      <OttShelf title="Bollywood Big Screen" subtitle="Popular Hindi Theatrical Releases" icon={Film} items={bollywoodHits} type="movie" />

      {/* 6. CRIME SERIES */}
      <OttShelf title="Indian Crime & Suspense Thrillers" subtitle="Binge-worthy mystery series" icon={Tv} items={crimeSeries} type="tv" />

      {/* 7. REGIONAL SPOTLIGHT */}
      <OttShelf title="Regional Spotlight" subtitle="Malayalam, Kannada & Bengali Cinema" icon={Compass} items={regionalSpotlight} type="movie" />
    </div>
  );
}
