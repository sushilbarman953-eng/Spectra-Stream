"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Check,
  Star,
  Flame,
  Sparkles,
  ChevronRight,
  Bookmark,
} from "lucide-react";
import { MediaItem } from "@/lib/tmdb";
import { soundFx } from "@/lib/soundFx";
import { SafeImage } from "@/components/SafeImage";

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
            <div className="absolute inset-0 flex opacity-40 group-hover:opacity-55 transition-opacity duration-300">
              {col.posters.map((src, idx) => (
                <div key={idx} className="relative flex-1 h-full border-r border-black/40 overflow-hidden">
                  <SafeImage src={src} alt="" fill />
                </div>
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
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
            <div className="absolute inset-0">
              <SafeImage src={cat.bgUrl} alt={cat.name} fill />
            </div>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
            <span className="relative z-10 text-xs font-black text-white tracking-wide uppercase drop-shadow">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

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
            <div
              className={`relative w-24 h-28 sm:w-28 sm:h-32 rounded-3xl overflow-hidden p-0.5 border border-white/20 shadow-xl group-hover:scale-105 group-hover:border-white/40 transition duration-300 ${star.gradient}`}
            >
              <div className="relative w-full h-full rounded-[22px] overflow-hidden bg-zinc-950">
                <SafeImage src={star.imageUrl} alt={star.name} fill />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-1.5 inset-x-1 text-center z-10">
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

export const ContextualPersonalizedShelves: React.FC<{
  favorites: MediaItem[];
  becauseWatchedTitle: string | null;
  becauseWatchedItems: MediaItem[];
}> = ({ favorites, becauseWatchedTitle, becauseWatchedItems }) => {
  return (
    <div className="space-y-7 select-none">
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
              const type = item.media_type || "movie";

              return (
                <Link
                  key={`fav-${item.id}-${idx}`}
                  href={`/details/${item.id}?type=${type}`}
                  onClick={() => soundFx.playCinematicPop()}
                  className="flex-none w-28 sm:w-32 group relative"
                >
                  <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 group-hover:border-white/30 transition shadow-md group-hover:scale-[1.02]">
                    <SafeImage src={item.poster_path} alt={item.title || item.name || ""} fill />

                    {item.vote_average ? (
                      <div className="absolute top-1.5 left-1.5 z-10 flex items-center gap-0.5 bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded-lg border border-white/15 text-[8px] font-black text-white">
                        <Star className="w-2.5 h-2.5 fill-white text-white" />
                        <span>{item.vote_average.toFixed(1)}</span>
                      </div>
                    ) : null}

                    <div className="absolute top-1.5 right-1.5 z-10">
                      <span className="px-1.5 py-0.5 rounded-md text-[7px] font-black uppercase bg-red-600/30 backdrop-blur-md border border-red-500/40 text-red-200">
                        MULTI
                      </span>
                    </div>
                  </div>

                  <h4 className="text-[11px] font-bold text-white truncate mt-1.5 group-hover:text-red-300 transition">
                    {item.title || item.name}
                  </h4>
                </Link>
              );
            })}
          </div>
        </div>
      )}

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
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {becauseWatchedItems.map((item, idx) => {
              const type = item.media_type || "movie";

              return (
                <Link
                  key={`rec-${item.id}-${idx}`}
                  href={`/details/${item.id}?type=${type}`}
                  onClick={() => soundFx.playCinematicPop()}
                  className="flex-none w-28 sm:w-32 group relative"
                >
                  <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 group-hover:border-white/30 transition shadow-md group-hover:scale-[1.02]">
                    <SafeImage src={item.poster_path} alt={item.title || item.name || ""} fill />

                    {item.vote_average ? (
                      <div className="absolute top-1.5 left-1.5 z-10 flex items-center gap-0.5 bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded-lg border border-white/15 text-[8px] font-black text-white">
                        <Star className="w-2.5 h-2.5 fill-white text-white" />
                        <span>{item.vote_average.toFixed(1)}</span>
                      </div>
                    ) : null}

                    <div className="absolute top-1.5 right-1.5 z-10">
                      <span className="px-1.5 py-0.5 rounded-md text-[7px] font-black uppercase bg-red-600/30 backdrop-blur-md border border-red-500/40 text-red-200">
                        MULTI
                      </span>
                    </div>
                  </div>

                  <h4 className="text-[11px] font-bold text-white truncate mt-1.5 group-hover:text-red-300 transition">
                    {item.title || item.name}
                  </h4>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

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

      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        {items.map((item, idx) => {
          const type = item.media_type || "movie";
          const displayLang =
            item.audioLanguages && item.audioLanguages.length > 1
              ? "MULTI"
              : item.audioLanguages?.[0] || "HIN";

          const rating = item.vote_average ? Number(item.vote_average).toFixed(1) : "8.5";

          return (
            <Link
              key={`grid-discover-${item.id}-${idx}`}
              href={`/details/${item.id}?type=${type}`}
              onClick={() => soundFx.playCinematicPop()}
              className="group relative flex flex-col"
            >
              <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 group-hover:border-white/30 transition shadow-lg group-hover:scale-[1.02]">
                <SafeImage
                  src={item.poster_path}
                  alt={item.title || item.name || "Media"}
                  fill
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

                {/* Floating Top Header Badges */}
                <div className="absolute top-1.5 inset-x-1.5 z-20 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-0.5 h-4.5 px-1.5 rounded-md bg-black/80 backdrop-blur-md border border-white/15 text-[8px] font-black text-white shadow-md leading-none">
                    <Star className="w-2.5 h-2.5 fill-white text-white shrink-0" />
                    <span>{rating}</span>
                  </div>

                  <div className="flex items-center h-4.5 px-1.5 rounded-md bg-red-600/35 backdrop-blur-md border border-red-500/40 text-[7px] font-black uppercase tracking-wider text-red-100 shadow-[0_0_8px_rgba(239,68,68,0.4)] leading-none">
                    <span>{displayLang}</span>
                  </div>
                </div>
              </div>

              <h4 className="text-[10px] sm:text-xs font-bold text-white truncate mt-1 group-hover:text-red-300 transition">
                {item.title || item.name}
              </h4>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
