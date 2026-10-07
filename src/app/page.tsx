"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Flame,
  Film,
  Sparkles,
  Clapperboard,
  Tv,
  Globe2,
  ChevronRight,
  Play,
} from "lucide-react";
import {
  MediaItem,
  BACKUP_HINDI_MOVIES,
  BACKUP_HINDI_SERIES,
  BOLLYWOOD_CATALOG,
  SOUTH_INDIAN_CATALOG,
  HOLLYWOOD_CATALOG,
  getRealtimeTrending,
  getRealtimeComingSoon,
} from "@/lib/tmdb";
import { HINDI_DUBBED_ANIME_CATALOG } from "@/lib/animeService";
import { playbackHistory, WatchProgressItem } from "@/lib/playbackHistory";
import { watchlistManager } from "@/lib/watchlistManager";
import { HeroCarousel } from "@/components/HeroCarousel";
import { FilterableRankedShelf } from "@/components/FilterableRankedShelf";
import { MediaPosterCard } from "@/components/MediaPosterCard";
import {
  CuratedCollectionsShelf,
  CategorizedPillShelf,
  ComingSoonShelf,
  StarsSpotlightShelf,
  ContextualPersonalizedShelves,
  MultiRowGridDiscover,
} from "@/components/HomeModules";
import { soundFx } from "@/lib/soundFx";

export default function HomePage() {
  const [continueWatching, setContinueWatching] = useState<WatchProgressItem[]>([]);
  const [favorites, setFavorites] = useState<MediaItem[]>([]);
  const [trendingRealtimeMovies, setTrendingRealtimeMovies] = useState<MediaItem[]>(BACKUP_HINDI_MOVIES);
  const [realtimeComingSoon, setRealtimeComingSoon] = useState<any[]>([]);

  useEffect(() => {
    setContinueWatching(playbackHistory.getAll().slice(0, 6));

    const savedWatchlist = watchlistManager.getAll().map((item) => ({
      id: Number(item.id) || 0,
      title: item.title,
      poster_path: item.posterPath,
      vote_average: item.voteAverage || 8.5,
      media_type: item.type,
    }));
    setFavorites(savedWatchlist.slice(0, 8));

    // Dynamic real-time date data fetch
    getRealtimeTrending("movie").then((items) => {
      if (items && items.length > 0) setTrendingRealtimeMovies(items);
    });

    getRealtimeComingSoon().then((items) => {
      if (items && items.length > 0) setRealtimeComingSoon(items);
    });
  }, []);

  const movieTabs = [
    { id: "top", label: "TOP Movies" },
    { id: "cinema", label: "Cinema" },
    { id: "bollywood", label: "Bollywood" },
    { id: "south", label: "South Indian" },
    { id: "hollywood", label: "Hollywood" },
    { id: "bengali", label: "Bengali" },
  ];

  const moviesByTab: Record<string, MediaItem[]> = {
    top: trendingRealtimeMovies.slice(0, 10),
    cinema: BACKUP_HINDI_MOVIES,
    bollywood: BOLLYWOOD_CATALOG,
    south: SOUTH_INDIAN_CATALOG,
    hollywood: HOLLYWOOD_CATALOG,
    bengali: BACKUP_HINDI_MOVIES.slice(2, 8),
  };

  const seriesTabs = [
    { id: "top_series", label: "Top Series" },
    { id: "indian_drama", label: "Indian Drama" },
    { id: "reality", label: "Reality-TV" },
    { id: "anime_tv", label: "Anime" },
    { id: "asian_drama", label: "Asian Drama" },
  ];

  const seriesByTab: Record<string, MediaItem[]> = {
    top_series: BACKUP_HINDI_SERIES.slice(0, 10),
    indian_drama: BACKUP_HINDI_SERIES,
    reality: BACKUP_HINDI_SERIES.slice(1, 6),
    anime_tv: HINDI_DUBBED_ANIME_CATALOG.slice(0, 8).map((a) => ({
      id: a.mal_id,
      title: a.title_english || a.title,
      poster_path: a.images.jpg.image_url,
      vote_average: a.score,
      media_type: "tv" as const,
    })),
    asian_drama: BACKUP_HINDI_SERIES.slice(0, 6),
  };

  const categoriesData = [
    { id: "all", name: "All", href: "/explore", bgUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&q=80" },
    { id: "all_movies", name: "All Movies", href: "/movies", bgUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&q=80" },
    { id: "all_dramas", name: "All Dramas", href: "/series", bgUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=300&q=80" },
    { id: "punjabi", name: "Punjabi", href: "/movies", bgUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=300&q=80" },
  ];

  const indianStarsData = [
    {
      id: "ajith",
      name: "Ajith Kumar",
      role: "Action Lead",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
      gradient: "bg-gradient-to-tr from-red-600 via-zinc-800 to-amber-500",
    },
    {
      id: "ram_charan",
      name: "Ram Charan",
      role: "Mega Power Star",
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80",
      gradient: "bg-gradient-to-tr from-orange-500 via-zinc-800 to-yellow-400",
    },
    {
      id: "kiara",
      name: "Kiara Advani",
      role: "Lead Actress",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80",
      gradient: "bg-gradient-to-tr from-pink-500 via-zinc-800 to-purple-500",
    },
  ];

  const curatedCollectionsData = [
    {
      id: "cur1",
      title: "Epic Indian Blockbusters",
      posters: [
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=342&q=80",
        "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=342&q=80",
      ],
      link: "/movies",
    },
    {
      id: "cur2",
      title: "Global Crime & Drama",
      posters: [
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=342&q=80",
        "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=342&q=80",
      ],
      link: "/series",
    },
  ];

  const renderCleanShelf = (
    title: string,
    items: any[],
    icon: any,
    viewAllHref: string,
    isAnime = false
  ) => {
    const IconComp = icon;
    return (
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <IconComp className="w-4 h-4 text-red-500" />
            <h2 className="text-sm font-bold text-white tracking-wide">{title}</h2>
          </div>
          <Link
            href={viewAllHref}
            onClick={() => soundFx.playCinematicPop()}
            className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-0.5 transition"
          >
            <span>All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 px-0.5">
          {items.map((item, idx) => (
            <MediaPosterCard
              key={`${item.id}-${idx}`}
              item={item}
              defaultType={isAnime ? "tv" : item.media_type || "movie"}
              href={isAnime ? `/details/${item.id}?type=tv&source=anime` : undefined}
            />
          ))}
        </div>
      </section>
    );
  };

  const animeShelfItems = HINDI_DUBBED_ANIME_CATALOG.slice(0, 10).map((a) => ({
    id: a.mal_id,
    title: a.title_english || a.title,
    poster_path: a.images?.jpg?.large_image_url || a.images?.jpg?.image_url,
    vote_average: a.score,
    media_type: "tv" as const,
  }));

  const lastWatchedTitle = continueWatching[0]?.title || null;

  return (
    <div className="min-h-screen bg-[#08080c] text-white pt-2 pb-28 px-3 sm:px-6 flex flex-col gap-7 max-w-7xl mx-auto">
      {/* 00. Hero Carousel */}
      <section className="w-full">
        <HeroCarousel items={trendingRealtimeMovies} />
      </section>

      {/* 01. Keep Watching */}
      {continueWatching.length > 0 && (
        <section className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
              Keep Watching
            </h2>
            <Link href="/me" className="text-xs text-zinc-400 hover:text-white">
              All &gt;
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
                className="flex-none w-48 sm:w-56 p-2 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1.5"
              >
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-zinc-950 flex items-center justify-center">
                  <Play className="w-5 h-5 fill-white text-white" />
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${item.progressPercent || 35}%` }}
                    />
                  </div>
                </div>
                <h4 className="text-xs font-bold text-white truncate px-0.5">{item.title}</h4>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 02. Trending Movies (Real-Time Dynamic for Current Date) */}
      <FilterableRankedShelf
        title="Trending Movies"
        tabs={movieTabs}
        itemsByTab={moviesByTab}
        allLinkHref="/movies"
        defaultType="movie"
      />

      {/* 03. Trending TV Series */}
      <FilterableRankedShelf
        title="Trending TV Series"
        tabs={seriesTabs}
        itemsByTab={seriesByTab}
        allLinkHref="/series"
        defaultType="tv"
      />

      {/* 04. Trending Anime */}
      {renderCleanShelf("Trending Anime", animeShelfItems, Sparkles, "/anime", true)}

      {/* 05. Categories */}
      <CategorizedPillShelf categories={categoriesData} />

      {/* 06. Back to Your Favorites & 09. Because You Watched */}
      <ContextualPersonalizedShelves
        favorites={favorites}
        becauseWatchedTitle={lastWatchedTitle}
        becauseWatchedItems={BOLLYWOOD_CATALOG.slice(0, 8)}
      />

      {/* 07. Coming Soon (Lookahead from Current Date) */}
      <ComingSoonShelf items={realtimeComingSoon.length > 0 ? realtimeComingSoon : []} />

      {/* 08. Indian Stars */}
      <StarsSpotlightShelf stars={indianStarsData} />

      {/* 10. Regional Cinema Shelves */}
      <div className="space-y-6">
        {renderCleanShelf("Cinema", BACKUP_HINDI_MOVIES, Flame, "/movies")}
        {renderCleanShelf("Bollywood", BOLLYWOOD_CATALOG, Film, "/movies")}
        {renderCleanShelf("South Indian", SOUTH_INDIAN_CATALOG, Clapperboard, "/movies")}
        {renderCleanShelf("Hollywood", HOLLYWOOD_CATALOG, Globe2, "/movies")}
        {renderCleanShelf("Indian Drama", BACKUP_HINDI_SERIES, Tv, "/series")}
      </div>

      {/* 11. Curated Collections & 3-Column Wall */}
      <div className="space-y-8">
        <CuratedCollectionsShelf collections={curatedCollectionsData} />
        <MultiRowGridDiscover items={trendingRealtimeMovies.slice(0, 9)} />
      </div>
    </div>
  );
}
