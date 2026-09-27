"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  Check,
  Star,
  Flame,
  Sparkles,
  ChevronRight,
  Heart,
  Bookmark,
} from "lucide-react";
import { MediaItem, IMAGE_BASE } from "@/lib/tmdb";
import { soundFx } from "@/lib/soundFx";

/* =========================================================================
   4. CURATED COLLECTION BANNERS ("MUST-WATCH")
   ========================================================================= */
export interface CuratedCollection {
  id: string;
  title: string;
  posters: string[];
  link: string;
}

export const CuratedCollectionsShelf: React.FC<{ collections: CuratedCollection[] }> = ({
  collections,
}) => {
  return (
    <div className="space-y-3 select-none">
      <div className="flex items-center gap-2">
        <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
        <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
          2026 Must-Watch Collections
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {collections.map((col) => (
          <Link
            key={col.id}
            href={col.link}
            onClick={() => soundFx.playCinematicSwell()}
            className="group relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden border border-white/15 bg-zinc-950 shadow-xl flex flex-col justify-end p-2.5 sm:p-3 hover:border-white/35 transition active:scale-[0.98]"
          >
            {/* Multi-Poster Vertical Slices Background */}
            <div className="absolute inset-0 flex opacity-40 group-hover:opacity-55 transition-opacity duration-300">
              {col.posters.map((src, idx) => (
                <div key={idx} className="relative flex-1 h-full border-r border-black/40 overflow-hidden">
                  <Image src={src} alt="" fill unoptimized className="object-cover" />
                </div>
              ))}
            </div>

            {/* Dark Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

            {/* Laurel Wreath Framing & Typography */}
            <div className="relative z-10 text-center flex flex-col items-center">
              <span className="text-[8px] sm:text-[10px] uppercase font-mono tracking-widest text-zinc-300">
                CURATED PICKS
              </span>
              <div className="flex items-center justify-center gap-1.5 mt-0.5">
                <span className="text-zinc-400 text-xs sm:text-sm font-serif">❧</span>
                <h3 className="text-xs sm:text-base font-black text-white uppercase tracking-tight line-clamp-1">
                  {col.title}
                </h3>
                <span className="text-zinc-400 text-xs sm:text-sm font-serif scale-x-[-1]">❧</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   5. CATEGORIZED PILL SHELF
   ========================================================================= */
export interface CategoryPill {
  id: string;
  name: string;
  href: string;
  bgUrl: string;
}

export const CategorizedPillShelf: React.FC<{ categories: CategoryPill[] }> = ({
  categories,
}) => {
  return (
    <div className="space-y-2.5 select-none">
      <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
        Categories
      </h2>

      <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-0.5">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            onClick={() => soundFx.playCinematicPop()}
            className="flex-none relative h-11 px-5 rounded-2xl overflow-hidden border border-white/15 bg-zinc-900 flex items-center justify-center shadow-md hover:border-white/35 active:scale-95 transition group"
          >
            {/* Translucent Backdrop Photo Texture */}
            <Image
              src={cat.bgUrl}
              alt=""
              fill
              unoptimized
              className="object-cover opacity-25 group-hover:opacity-40 group-hover:scale-105 transition-all duration-300"
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

            <span className="relative z-10 text-xs font-black text-white tracking-wide uppercase drop-shadow">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   6. "COMING SOON" ALERT SHELF
   ========================================================================= */
export interface ComingSoonItem {
  id: string;
  title: string;
  releaseDateText: string;
  bookedCount: number;
  posterUrl: string;
  type?: "movie" | "tv";
}

export const ComingSoonShelf: React.FC<{ items: ComingSoonItem[] }> = ({ items }) => {
  const [notifiedMap, setNotifiedMap] = useState<Record<string, boolean>>({});

  const toggleNotify = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    soundFx.playCinematicPop();
    setNotifiedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-3 select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
          Coming Soon
        </h2>
        <span className="text-[10px] font-mono font-bold text-zinc-400">
          PRE-BOOKINGS OPEN
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {items.map((item) => {
          const isNotified = notifiedMap[item.id];
          return (
            <Link
              key={item.id}
              href={`/details/${item.id}?type=${item.type || "movie"}`}
              onClick={() => soundFx.playCinematicPop()}
              className="flex-none w-32 sm:w-36 group relative flex flex-col"
            >
              <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 group-hover:border-white/30 transition shadow-lg group-hover:scale-[1.02]">
                <Image
                  src={item.posterUrl}
                  alt={item.title}
                  fill
                  unoptimized
                  className="object-cover"
                />

                {/* Ambient Top & Bottom Vignettes */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/60 pointer-events-none" />

                {/* Top-Left: Release Date Badge */}
                <div className="absolute top-1.5 left-1.5 z-10">
                  <span className="px-2 py-0.5 rounded-lg text-[8px] font-mono font-black uppercase tracking-wider bg-black/80 backdrop-blur-md border border-white/20 text-white shadow-md">
                    {item.releaseDateText}
                  </span>
                </div>

                {/* Top-Right: Glass Notification Bell Button */}
                <button
                  onClick={(e) => toggleNotify(item.id, e)}
                  className={`absolute top-1.5 right-1.5 z-20 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-xl border transition active:scale-90 shadow-md ${
                    isNotified
                      ? "bg-emerald-500 text-black border-emerald-400 font-bold"
                      : "bg-black/60 hover:bg-black/80 text-white border-white/20"
                  }`}
                  aria-label="Notify Me"
                >
                  {isNotified ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <Bell className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Bottom Overlay: Pre-Booking Counter */}
                <div className="absolute bottom-1.5 left-1.5 right-1.5 z-10 text-center">
                  <span className="inline-block w-full py-0.5 rounded-md bg-white/15 backdrop-blur-md border border-white/20 text-[8px] font-mono font-bold text-zinc-100">
                    {item.bookedCount} booked
                  </span>
                </div>
              </div>

              <h4 className="text-[11px] font-bold text-white truncate mt-1.5 group-hover:text-red-300 transition">
                {item.title}
              </h4>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

/* =========================================================================
   7. ACTOR SPOTLIGHT ROW ("INDIAN STARS")
   ========================================================================= */
export interface StarSpotlight {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  gradient: string;
}

export const StarsSpotlightShelf: React.FC<{ stars: StarSpotlight[] }> = ({ stars }) => {
  return (
    <div className="space-y-3 select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
          Indian Stars
        </h2>
        <span className="text-xs font-bold text-zinc-400">Popular Spotlight</span>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
        {stars.map((star) => (
          <div
            key={star.id}
            className="flex-none w-24 sm:w-28 flex flex-col items-center group cursor-pointer"
            onClick={() => soundFx.playCinematicPop()}
          >
            {/* Squircle Avatar with Dual-Tone Vibrant Neon Gradient */}
            <div
              className={`relative w-24 h-28 sm:w-28 sm:h-32 rounded-3xl overflow-hidden p-0.5 border border-white/20 shadow-xl group-hover:scale-105 group-hover:border-white/40 transition duration-300 ${star.gradient}`}
            >
              <div className="relative w-full h-full rounded-[22px] overflow-hidden bg-zinc-950">
                <Image
                  src={star.imageUrl}
                  alt={star.name}
                  fill
                  unoptimized
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />

                {/* Name Centered at Base in Condensed Uppercase Typography */}
                <div className="absolute bottom-1.5 inset-x-1 text-center">
                  <h4 className="text-[9px] sm:text-[10px] font-black text-white tracking-tight uppercase line-clamp-1 drop-shadow leading-tight">
                    {star.name}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   8. CONTEXTUAL PERSONALIZED SHELVES:
      - "Back to Your Favorites"
      - "Because U Watched [Title]"
   ========================================================================= */
export const ContextualPersonalizedShelves: React.FC<{
  favorites: MediaItem[];
  becauseWatchedTitle: string | null;
  becauseWatchedItems: MediaItem[];
}> = ({ favorites, becauseWatchedTitle, becauseWatchedItems }) => {
  return (
    <div className="space-y-7 select-none">
      {/* 8A. Back to Your Favorites */}
      {favorites.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-red-500 fill-red-500" />
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                Back to Your Favorites
              </h2>
            </div>
            <Link
              href="/me"
              onClick={() => soundFx.playCinematicPop()}
              className="text-xs font-bold text-zinc-400 hover:text-white transition flex items-center gap-0.5"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {favorites.map((item, idx) => {
              const poster = item.poster_path
                ? item.poster_path.startsWith("http")
                  ? item.poster_path
                  : `${IMAGE_BASE}/w342${item.poster_path}`
                : null;
              const type = item.media_type || "movie";

              return (
                <Link
                  key={`fav-${item.id}-${idx}`}
                  href={`/details/${item.id}?type=${type}`}
                  onClick={() => soundFx.playCinematicPop()}
                  className="flex-none w-28 sm:w-32 group relative"
                >
                  <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 group-hover:border-white/30 transition shadow-md group-hover:scale-[1.02]">
                    {poster ? (
                      <Image src={poster} alt="" fill unoptimized className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
                        Poster
                      </div>
                    )}
                    <div className="absolute top-1.5 right-1.5">
                      <span className="px-1.5 py-0.5 rounded-md text-[7px] font-black uppercase bg-red-600/30 backdrop-blur-md border border-red-500/40 text-red-200">
                        MULTI
                      </span>
                    </div>
                  </div>
                  <h4 className="text-[11px] font-bold text-white truncate mt-1.5">
                    {item.title || item.name}
                  </h4>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* 8B. Because U Watched [Title] */}
      {becauseWatchedItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                {becauseWatchedTitle ? (
                  <>
                    Because U Watched{" "}
                    <span className="text-red-400">&ldquo;{becauseWatchedTitle}&rdquo;</span>
                  </>
                ) : (
                  "Recommended For You"
                )}
              </h2>
              <p className="text-[10px] text-zinc-400 font-medium">
                Similar cinematic storylines & genres
              </p>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {becauseWatchedItems.map((item, idx) => {
              const poster = item.poster_path
                ? item.poster_path.startsWith("http")
                  ? item.poster_path
                  : `${IMAGE_BASE}/w342${item.poster_path}`
                : null;
              const type = item.media_type || "movie";

              return (
                <Link
                  key={`rec-${item.id}-${idx}`}
                  href={`/details/${item.id}?type=${type}`}
                  onClick={() => soundFx.playCinematicPop()}
                  className="flex-none w-28 sm:w-32 group relative"
                >
                  <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 group-hover:border-white/30 transition shadow-md group-hover:scale-[1.02]">
                    {poster ? (
                      <Image src={poster} alt="" fill unoptimized className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
                        Poster
                      </div>
                    )}
                    {item.vote_average ? (
                      <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded-lg border border-white/15 text-[8px] font-black text-white">
                        <Star className="w-2.5 h-2.5 fill-white text-white" />
                        <span>{item.vote_average.toFixed(1)}</span>
                      </div>
                    ) : null}
                    <div className="absolute top-1.5 right-1.5">
                      <span className="px-1.5 py-0.5 rounded-md text-[7px] font-black uppercase bg-red-600/30 backdrop-blur-md border border-red-500/40 text-red-200">
                        MULTI
                      </span>
                    </div>
                  </div>
                  <h4 className="text-[11px] font-bold text-white truncate mt-1.5 group-hover:text-red-300 transition">
                    {item.title || item.name}
                  </h4>
                  <p className="text-[9px] text-zinc-400 font-mono truncate">
                    [Hindi] • {(item.release_date || item.first_air_date || "2024").slice(0, 4)}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   9. MULTI-ROW GRID DISCOVER ("MOST TRENDING") — 3-COLUMN DISCOVERY GRID
   ========================================================================= */
export const MultiRowGridDiscover: React.FC<{ items: MediaItem[] }> = ({ items }) => {
  return (
    <div className="space-y-3.5 select-none pt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-red-500 fill-red-500" />
          <h2 className="text-base sm:text-lg font-black text-white tracking-tight uppercase">
            Most Trending
          </h2>
        </div>
        <span className="text-[10px] font-mono text-zinc-400">DISCOVERY FEED</span>
      </div>

      {/* 3-Column Portrait Grid */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        {items.map((item, idx) => {
          const poster = item.poster_path
            ? item.poster_path.startsWith("http")
              ? item.poster_path
              : `${IMAGE_BASE}/w342${item.poster_path}`
            : null;
          const type = item.media_type || "movie";

          const displayLang =
            item.audioLanguages && item.audioLanguages.length > 1
              ? "MULTI"
              : item.audioLanguages?.[0] || "Hindi";

          return (
            <Link
              key={`grid-discover-${item.id}-${idx}`}
              href={`/details/${item.id}?type=${type}`}
              onClick={() => soundFx.playCinematicPop()}
              className="group relative flex flex-col"
            >
              <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 group-hover:border-white/30 transition shadow-lg group-hover:scale-[1.02]">
                {poster ? (
                  <Image
                    src={poster}
                    alt={item.title || item.name || "Media"}
                    fill
                    unoptimized
                    className="object-cover transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
                    Poster
                  </div>
                )}

                {/* Top-Right Frosted Language Tag */}
                <div className="absolute top-1.5 right-1.5 z-10">
                  <span className="px-1.5 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md border border-white/20 text-zinc-200">
                    {displayLang}
                  </span>
                </div>

                {item.vote_average ? (
                  <div className="absolute bottom-1.5 left-1.5 z-10 flex items-center gap-0.5 bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-black text-white border border-white/15">
                    <Star className="w-2 h-2 fill-white text-white" />
                    <span>{item.vote_average.toFixed(1)}</span>
                  </div>
                ) : null}
              </div>

              <div className="mt-1 space-y-0.5">
                <h4 className="text-[10px] sm:text-xs font-bold text-white truncate group-hover:text-red-300 transition">
                  {item.title || item.name}
                </h4>
                <p className="text-[8px] sm:text-[9px] text-zinc-400 font-mono truncate">
                  [{displayLang}]
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
