"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Play,
  Flame,
  Trophy,
  Tv,
  Compass,
  ArrowRight,
  Star,
} from "lucide-react";
import {
  MediaItem,
  IMAGE_BASE,
  BACKUP_HINDI_MOVIES,
  BACKUP_HINDI_SERIES,
} from "@/lib/tmdb";
import { playbackHistory, PlaybackProgressItem } from "@/lib/playbackHistory";
import { HeroCarousel } from "@/components/HeroCarousel";
import { OttShelf } from "@/components/OttShelf";
import { soundFx } from "@/lib/soundFx";

export default function HomePage() {
  const [heroItems, setHeroItems] = useState<MediaItem[]>([]);
  const [continueWatching, setContinueWatching] = useState<PlaybackProgressItem[]>([]);
  const [lastWatchedTitle, setLastWatchedTitle] = useState<string | null>(null);
  const [personalizedRecs, setPersonalizedRecs] = useState<MediaItem[]>([]);

  useEffect(() => {
    setHeroItems(BACKUP_HINDI_MOVIES.slice(0, 10));

    const history = playbackHistory.getAll();
    setContinueWatching(history.slice(0, 4));

    if (history.length > 0 && history[0].title) {
      setLastWatchedTitle(history[0].title);
      const recs = BACKUP_HINDI_MOVIES.filter(
        (m) => (m.title || m.name)?.toLowerCase() !== history[0].title?.toLowerCase()
      );
      setPersonalizedRecs(recs);
    } else {
      setPersonalizedRecs(BACKUP_HINDI_MOVIES);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#08080c] text-white pt-0 pb-28 px-3 sm:px-6 flex flex-col gap-5 max-w-7xl mx-auto -mt-1">
      {/* 1. Dynamic Hero Carousel starting immediately below the top nav */}
      <section className="w-full pt-1 sm:pt-2">
        <HeroCarousel items={heroItems} />
      </section>

      {/* 2. Continue Watching Shelf */}
      {continueWatching.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-zinc-200">
                Continue Watching
              </h2>
            </div>
            <Link
              href="/me"
              onClick={() => soundFx.playCinematicPop()}
              className="text-[11px] font-bold text-zinc-400 hover:text-white transition flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {continueWatching.map((item) => (
              <Link
                key={item.id}
                href={
                  item.type === "tv"
                    ? `/watch/${item.tmdbId}?type=tv&season=${item.season || 1}&episode=${item.episode || 1}`
                    : `/watch/${item.tmdbId}?type=movie`
                }
                onClick={() => soundFx.playCinematicSwell()}
                className="flex-none w-48 sm:w-56 p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition group space-y-2 backdrop-blur-xl"
              >
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-zinc-950 flex items-center justify-center">
                  <Play className="w-6 h-6 fill-white text-white group-hover:scale-110 transition-transform" />
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${item.progressPercent || 35}%` }}
                    />
                  </div>
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {item.progressPercent || 35}% watched
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 3. Personalized Recommendation Shelf */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-red-500" />
            <div>
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                {lastWatchedTitle ? (
                  <>
                    Because You Played{" "}
                    <span className="text-red-400">&ldquo;{lastWatchedTitle}&rdquo;</span>
                  </>
                ) : (
                  "As You Explore, You Might Like"
                )}
              </h2>
              <p className="text-[10px] text-zinc-400 font-medium">
                Personalized recommendations matching your recent watch habits
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {personalizedRecs.map((item, idx) => {
            const poster = item.poster_path
              ? item.poster_path.startsWith("http")
                ? item.poster_path
                : `${IMAGE_BASE}/w342${item.poster_path}`
              : null;
            const itemType = item.media_type || "movie";

            return (
              <Link
                key={`rec-${item.id}-${idx}`}
                href={`/details/${item.id}?type=${itemType}`}
                onClick={() => soundFx.playCinematicPop()}
                className="flex-none w-28 sm:w-32 group relative"
              >
                <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 group-hover:border-white/30 transition shadow-md group-hover:scale-[1.02]">
                  {poster ? (
                    <Image
                      src={poster}
                      alt={item.title || item.name || "Recommendation"}
                      fill
                      unoptimized
                      className="object-cover transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
                      Poster
                    </div>
                  )}

                  <div className="absolute top-1.5 left-1.5 z-10">
                    <span className="px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider bg-red-600/30 backdrop-blur-md border border-red-500/40 text-red-200 shadow-[0_0_8px_rgba(239,68,68,0.45)]">
                      MULTI
                    </span>
                  </div>

                  {item.vote_average ? (
                    <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] text-white font-bold border border-white/15">
                      <Star className="w-2 h-2 fill-white text-white" />
                      {item.vote_average.toFixed(1)}
                    </div>
                  ) : null}
                </div>

                <h4 className="text-[11px] font-bold text-white truncate mt-1.5 group-hover:text-red-300 transition">
                  {item.title || item.name}
                </h4>
                <p className="text-[9px] text-zinc-400 font-mono truncate">
                  {(item.release_date || item.first_air_date || "2024").slice(0, 4)}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Top 10 In India Today */}
      <section className="space-y-3">
        <OttShelf
          title="Top 10 In India Today"
          icon={Trophy}
          subtitle="Ranked by active streams & viewership"
          items={BACKUP_HINDI_MOVIES}
          badgePrefix="TOP"
          showRank={true}
        />
      </section>

      {/* 5. Trending Web Series */}
      <section className="space-y-3">
        <OttShelf
          title="Binge-Worthy Series"
          icon={Tv}
          subtitle="Top rated multi-season television"
          items={BACKUP_HINDI_SERIES}
          defaultType="tv"
        />
      </section>
    </div>
  );
}
