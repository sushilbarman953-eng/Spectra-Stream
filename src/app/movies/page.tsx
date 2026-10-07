"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Film,
  Flame,
  Globe2,
  Clapperboard,
  Sparkles,
  ChevronRight,
  Compass,
} from "lucide-react";
import {
  MediaItem,
  BACKUP_HINDI_MOVIES,
  BOLLYWOOD_CATALOG,
  SOUTH_INDIAN_CATALOG,
  HOLLYWOOD_CATALOG,
  getRealtimeTrending,
} from "@/lib/tmdb";
import { HeroCarousel } from "@/components/HeroCarousel";
import { FilterableRankedShelf } from "@/components/FilterableRankedShelf";
import { MediaPosterCard } from "@/components/MediaPosterCard";
import { StudioFranchiseHubs } from "@/components/StudioFranchiseHubs";
import {
  StarSpotlightCapsules,
  INDIAN_MOVIE_STARS,
  HOLLYWOOD_MOVIE_STARS,
} from "@/components/StarSpotlightCapsules";
import { soundFx } from "@/lib/soundFx";

const MOVIE_GENRE_PILLS = [
  { id: "all", label: "All" },
  { id: "action", label: "Action" },
  { id: "comedy", label: "Comedy" },
  { id: "romance", label: "Romance" },
  { id: "scifi", label: "Sci-Fi" },
  { id: "thriller", label: "Thriller" },
  { id: "horror", label: "Horror" },
  { id: "drama", label: "Drama" },
];

const FRANCHISE_SPOTLIGHTS: MediaItem[] = [
  {
    id: 1380439,
    title: "Fast X",
    poster_path: "https://image.tmdb.org/t/p/w342/fiVW06jE7z9YnO4trhaMEdclSiC.jpg",
    vote_average: 7.2,
    media_type: "movie",
    audioLanguages: ["MULTI", "HIN", "ENG"],
  },
  {
    id: 671,
    title: "Harry Potter and the Sorcerer's Stone",
    poster_path: "https://image.tmdb.org/t/p/w342/wuMc08IPKEatv9rnMNXvIDxqP4W.jpg",
    vote_average: 7.9,
    media_type: "movie",
    audioLanguages: ["MULTI", "HIN"],
  },
  {
    id: 940721,
    title: "Godzilla x Kong: The New Empire",
    poster_path: "https://image.tmdb.org/t/p/w342/bQ2ywkchIiaKLSEaMrcT6e29f91.jpg",
    vote_average: 7.2,
    media_type: "movie",
    audioLanguages: ["MULTI", "HIN"],
  },
  {
    id: 299536,
    title: "Avengers: Infinity War",
    poster_path: "https://image.tmdb.org/t/p/w342/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
    vote_average: 8.3,
    media_type: "movie",
    audioLanguages: ["MULTI", "HIN", "ENG"],
  },
];

const REGIONAL_HINDI_HITS: MediaItem[] = [
  {
    id: 853036,
    title: "Carry On Jatta 3",
    poster_path: "https://image.tmdb.org/t/p/w342/7I6VUdPj6tQECNHdviJkUHD2f89.jpg",
    vote_average: 8.0,
    media_type: "movie",
    audioLanguages: ["PUN", "HIN"],
  },
  {
    id: 1111101,
    title: "Baap Manus",
    poster_path: "https://image.tmdb.org/t/p/w342/yDHYTfA3R0jFYba16jBB12R8GNT.jpg",
    vote_average: 8.4,
    media_type: "movie",
    audioLanguages: ["MAR", "HIN"],
  },
  {
    id: 1111102,
    title: "Bhooter Bhabishyat",
    poster_path: "https://image.tmdb.org/t/p/w342/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    vote_average: 8.2,
    media_type: "movie",
    audioLanguages: ["BEN", "HIN"],
  },
  {
    id: 1111103,
    title: "Jatt & Juliet 3",
    poster_path: "https://image.tmdb.org/t/p/w342/wWba3TaojhK7NjnI0427v5ZZxZz.jpg",
    vote_average: 7.8,
    media_type: "movie",
    audioLanguages: ["PUN", "HIN"],
  },
];

export default function MoviesPage() {
  const [activeGenre, setActiveGenre] = useState<string>("all");
  const [heroCollection, setHeroCollection] = useState<MediaItem[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<MediaItem[]>(BACKUP_HINDI_MOVIES);

  useEffect(() => {
    const mergedHero = [
      ...HOLLYWOOD_CATALOG.slice(0, 4),
      ...BOLLYWOOD_CATALOG.slice(0, 3),
      ...SOUTH_INDIAN_CATALOG.slice(0, 3),
    ];
    setHeroCollection(mergedHero);

    getRealtimeTrending("movie").then((items) => {
      if (items && items.length > 0) setTrendingMovies(items);
    });
  }, []);

  const trendingTabs = [
    { id: "top_hits", label: "Top Hits" },
    { id: "cinema", label: "Cinema" },
    { id: "bollywood", label: "Bollywood" },
    { id: "south", label: "South" },
    { id: "hollywood", label: "Hollywood" },
  ];

  const trendingByTab: Record<string, MediaItem[]> = {
    top_hits: trendingMovies.slice(0, 10),
    cinema: BACKUP_HINDI_MOVIES,
    bollywood: BOLLYWOOD_CATALOG,
    south: SOUTH_INDIAN_CATALOG,
    hollywood: HOLLYWOOD_CATALOG,
  };

  // Distinct deduplicated list for Random Movies
  const randomMoviesPool: MediaItem[] = [
    ...BACKUP_HINDI_MOVIES.slice(0, 3),
    ...HOLLYWOOD_CATALOG.slice(0, 3),
    ...SOUTH_INDIAN_CATALOG.slice(0, 3),
  ].filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));

  const renderSectionShelf = (
    title: string,
    items: MediaItem[],
    icon: any,
    viewAllHref: string = "/explore"
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
              key={`${title}-${item.id}-${idx}`}
              item={item}
              defaultType="movie"
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
        <HeroCarousel items={heroCollection.length > 0 ? heroCollection : BACKUP_HINDI_MOVIES} />
      </section>

      {/* 01. Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
        {MOVIE_GENRE_PILLS.map((pill) => {
          const isSelected = activeGenre === pill.id;
          return (
            <button
              key={pill.id}
              onClick={() => {
                soundFx.playMechanicalTick();
                setActiveGenre(pill.id);
              }}
              className={`flex items-center px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                isSelected
                  ? "bg-white text-black border-white shadow-glow font-black scale-100"
                  : "bg-white/[0.05] hover:bg-white/10 text-zinc-300 border-white/10 scale-95"
              }`}
            >
              <span>{pill.label}</span>
            </button>
          );
        })}
      </div>

      {/* 02. Trending Movies */}
      <FilterableRankedShelf
        title="Trending Movies"
        tabs={trendingTabs}
        itemsByTab={trendingByTab}
        allLinkHref="/explore"
        defaultType="movie"
      />

      {/* 03. Franchise Spotlights */}
      {renderSectionShelf("Franchise Spotlights", FRANCHISE_SPOTLIGHTS, Sparkles)}

      {/* 04. Studio Franchises & Brand Hubs */}
      <StudioFranchiseHubs />

      {/* 05. Hollywood */}
      {renderSectionShelf("Hollywood", HOLLYWOOD_CATALOG, Globe2)}

      {/* 06. Bollywood */}
      {renderSectionShelf("Bollywood", BOLLYWOOD_CATALOG, Film)}

      {/* 07. South Indian */}
      {renderSectionShelf("South Indian", SOUTH_INDIAN_CATALOG, Clapperboard)}

      {/* 08. Regional Hits */}
      {renderSectionShelf("Regional Hits", REGIONAL_HINDI_HITS, Flame)}

      {/* 09. Indian Stars */}
      <StarSpotlightCapsules
        title="Indian Stars"
        subtitle="Movie Headliners"
        stars={INDIAN_MOVIE_STARS}
      />

      {/* 10. Hollywood Stars Showcase */}
      <StarSpotlightCapsules
        title="Hollywood Stars Showcase"
        subtitle="Global Spotlight"
        stars={HOLLYWOOD_MOVIE_STARS}
      />

      {/* 11. Random Movies */}
      {renderSectionShelf("Random Movies", randomMoviesPool, Compass)}
    </div>
  );
}
