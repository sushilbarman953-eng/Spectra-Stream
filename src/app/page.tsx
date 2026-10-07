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
import { MediaItem } from "@/lib/tmdb";
import { catalogManager, CustomCatalogState } from "@/lib/catalogManager";
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
  const [catalog, setCatalog] = useState<CustomCatalogState | null>(null);

  useEffect(() => {
    const load = () => {
      setCatalog(catalogManager.get());
      setContinueWatching(playbackHistory.getAll().slice(0, 6));

      const savedWatchlist = watchlistManager.getAll().map((item) => ({
        id: Number(item.id) || 0,
        title: item.title,
        poster_path: item.posterPath,
        vote_average: item.voteAverage || 8.5,
        media_type: item.type,
      }));
      setFavorites(savedWatchlist.slice(0, 8));
    };

    load();
    window.addEventListener("spectra_catalog_updated", load);
    return () => window.removeEventListener("spectra_catalog_updated", load);
  }, []);

  if (!catalog) return null;

  const movieTabs = [
    { id: "top", label: "TOP Movies" },
    { id: "cinema", label: "Cinema" },
    { id: "bollywood", label: "Bollywood" },
    { id: "south", label: "South Indian" },
    { id: "hollywood", label: "Hollywood" },
  ];

  const moviesByTab: Record<string, MediaItem[]> = {
    top: catalog.trendingMovies,
    cinema: catalog.bollywood,
    bollywood: catalog.bollywood,
    south: catalog.south,
    hollywood: catalog.hollywood,
  };

  const seriesTabs = [
    { id: "top_series", label: "Top Series" },
    { id: "indian_drama", label: "Indian Drama" },
    { id: "crime", label: "Crime Thrillers" },
  ];

  const seriesByTab: Record<string, MediaItem[]> = {
    top_series: catalog.trendingSeries,
    indian_drama: catalog.indianWeb,
    crime: catalog.crimeThrillers,
  };

  const categoriesData = [
    { id: "all", name: "All", href: "/explore", bgUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&q=80" },
    { id: "all_movies", name: "All Movies", href: "/movies", bgUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&q=80" },
    { id: "all_dramas", name: "All Dramas", href: "/series", bgUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=300&q=80" },
  ];

  const curatedCollectionsData = [
    {
      id: "cur1",
      title: "Epic Indian Blockbusters",
      posters: [
        "https://image.tmdb.org/t/p/w500/jYW3g8Q9qY76xV4cO645bJ9UoQ9.jpg",
        "https://image.tmdb.org/t/p/w500/wE0noMt2q9ELvlCGQMSvW4gu0vL.jpg",
      ],
      link: "/movies",
    },
    {
      id: "cur2",
      title: "Global Crime & Drama",
      posters: [
        "https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
        "https://image.tmdb.org/t/p/w500/2zmTngn1tYC1AvfnNDBpQIavBk8.jpg",
      ],
      link: "/series",
    },
  ];

  const renderCleanShelf = (title: string, items: MediaItem[], icon: any, viewAllHref: string) => {
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
              key={`${title}-${item.id}-${idx}`}
              item={item}
              defaultType={item.media_type || "movie"}
            />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-[#08080c] text-white pt-2 pb-28 px-3 sm:px-6 flex flex-col gap-7 max-w-7xl mx-auto">
      {/* 00. Hero Carousel */}
      <section className="w-full">
        <HeroCarousel items={catalog.homeHero} />
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
                href={`/watch/${item.tmdbId}?type=${item.type}`}
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

      {/* 02. Trending Movies */}
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
      {renderCleanShelf("Trending Anime", catalog.trendingAnime, Sparkles, "/anime")}

      {/* 05. Categories */}
      <CategorizedPillShelf categories={categoriesData} />

      {/* 06. Back to Your Favorites & 09. Because You Watched */}
      <ContextualPersonalizedShelves
        favorites={favorites}
        becauseWatchedTitle={continueWatching[0]?.title || null}
        becauseWatchedItems={catalog.bollywood.slice(0, 8)}
      />

      {/* 08. Indian Stars */}
      <StarsSpotlightShelf stars={catalog.indianStars} />

      {/* 10. Regional Cinema Shelves */}
      <div className="space-y-6">
        {renderCleanShelf("Bollywood", catalog.bollywood, Film, "/movies")}
        {renderCleanShelf("South Indian", catalog.south, Clapperboard, "/movies")}
        {renderCleanShelf("Hollywood", catalog.hollywood, Globe2, "/movies")}
      </div>

      {/* 11. Curated Collections & Discovery Grid */}
      <div className="space-y-8">
        <CuratedCollectionsShelf collections={curatedCollectionsData} />
        <MultiRowGridDiscover items={catalog.trendingMovies.slice(0, 9)} />
      </div>
    </div>
  );
}
