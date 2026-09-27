"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Play, ArrowRight } from "lucide-react";
import {
  MediaItem,
  BACKUP_HINDI_MOVIES,
  BACKUP_HINDI_SERIES,
  EXTENDED_MOVIES_CATALOG,
  EXTENDED_SERIES_CATALOG,
} from "@/lib/tmdb";
import { playbackHistory, PlaybackProgressItem } from "@/lib/playbackHistory";
import { watchlistManager } from "@/lib/watchlistManager";
import { HeroCarousel } from "@/components/HeroCarousel";
import { FilterableRankedShelf } from "@/components/FilterableRankedShelf";
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
  const [heroItems, setHeroItems] = useState<MediaItem[]>([]);
  const [continueWatching, setContinueWatching] = useState<PlaybackProgressItem[]>([]);
  const [lastWatchedTitle, setLastWatchedTitle] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<MediaItem[]>([]);
  const [becauseWatchedItems, setBecauseWatchedItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    // 1. Hero items
    setHeroItems(BACKUP_HINDI_MOVIES.slice(0, 8));

    // 2. Continue Watching history
    const history = playbackHistory.getAll();
    setContinueWatching(history.slice(0, 4));

    if (history.length > 0 && history[0].title) {
      setLastWatchedTitle(history[0].title);
      setBecauseWatchedItems(
        BACKUP_HINDI_MOVIES.filter(
          (m) => (m.title || m.name)?.toLowerCase() !== history[0].title?.toLowerCase()
        )
      );
    } else {
      setBecauseWatchedItems(BACKUP_HINDI_MOVIES.slice(1, 7));
    }

    // 3. User Favorites from watchlist
    const watchlist = watchlistManager.getAll();
    const mappedFavs: MediaItem[] = watchlist.map((w) => ({
      id: Number(w.id),
      title: w.title,
      overview: "",
      poster_path: w.posterPath || null,
      backdrop_path: null,
      media_type: w.type as "movie" | "tv",
      vote_average: w.voteAverage || 8.5,
    }));
    setFavorites(mappedFavs.length > 0 ? mappedFavs : BACKUP_HINDI_MOVIES.slice(0, 5));
  }, []);

  // Filter dataset for "Trending Movies"
  const movieTabs = [
    { id: "top", label: "TOP Movies" },
    { id: "cinema", label: "Cinema" },
    { id: "bollywood", label: "Bollywood" },
    { id: "south", label: "South Indian" },
    { id: "hollywood", label: "Hollywood" },
  ];

  const movieItemsByTab: Record<string, MediaItem[]> = {
    top: EXTENDED_MOVIES_CATALOG.slice(0, 10),
    cinema: [...EXTENDED_MOVIES_CATALOG].reverse().slice(0, 10),
    bollywood: EXTENDED_MOVIES_CATALOG.filter((m) => m.audioLanguages?.includes("HIN")),
    south: EXTENDED_MOVIES_CATALOG.filter((m) => m.audioLanguages?.some((l) => ["TAM", "TEL"].includes(l))),
    hollywood: EXTENDED_MOVIES_CATALOG.filter((m) => m.audioLanguages?.includes("ENG")),
  };

  // Filter dataset for "Trending TV Series"
  const seriesTabs = [
    { id: "top_series", label: "Top Series" },
    { id: "indian_drama", label: "Indian Drama" },
    { id: "reality_tv", label: "Reality-TV" },
    { id: "international", label: "Asian Drama" },
  ];

  const seriesItemsByTab: Record<string, MediaItem[]> = {
    top_series: EXTENDED_SERIES_CATALOG.slice(0, 10),
    indian_drama: EXTENDED_SERIES_CATALOG.filter((s) => s.audioLanguages?.includes("HIN")),
    reality_tv: [...EXTENDED_SERIES_CATALOG].reverse().slice(0, 6),
    international: EXTENDED_SERIES_CATALOG.filter((s) => s.audioLanguages?.includes("ENG")),
  };

  // Data for 4. Curated Collections
  const curatedCollections = [
    {
      id: "south-asia-20",
      title: "TOP 20 South Asia On Screen",
      posters: [
        "https://image.tmdb.org/t/p/w185/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
        "https://image.tmdb.org/t/p/w185/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
        "https://image.tmdb.org/t/p/w185/nEufeZlyAOLqO2brrs0yeMu1QXO.jpg",
      ],
      link: "/movies",
    },
    {
      id: "foreign-20",
      title: "TOP 20 Foreign Movies",
      posters: [
        "https://image.tmdb.org/t/p/w185/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
        "https://image.tmdb.org/t/p/w185/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        "https://image.tmdb.org/t/p/w185/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
      ],
      link: "/movies",
    },
  ];

  // Data for 5. Categorized Pills
  const categoryPills = [
    { id: "all", name: "All", href: "/", bgUrl: "https://image.tmdb.org/t/p/w300/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg" },
    { id: "movies", name: "All Movies", href: "/movies", bgUrl: "https://image.tmdb.org/t/p/w300/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg" },
    { id: "dramas", name: "All Dramas", href: "/series", bgUrl: "https://image.tmdb.org/t/p/w300/9PFonQ95165agq9uWjWn4U3X3v7.jpg" },
    { id: "punjabi", name: "Punjabi Hits", href: "/movies", bgUrl: "https://image.tmdb.org/t/p/w300/nEufeZlyAOLqO2brrs0yeMu1QXO.jpg" },
    { id: "anime", name: "Anime Vault", href: "/anime", bgUrl: "https://image.tmdb.org/t/p/w300/2zmTngn1tYC1AvfnNDBpQI4vlxD.jpg" },
  ];

  // Data for 6. Coming Soon
  const comingSoonItems = [
    {
      id: "cs-1",
      title: "Toxic: A Fairy Tale",
      releaseDateText: "Sep 28",
      bookedCount: 629,
      posterUrl: "https://image.tmdb.org/t/p/w342/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
      type: "movie" as const,
    },
    {
      id: "cs-2",
      title: "Lego One Piece [Hindi]",
      releaseDateText: "Sep 29",
      bookedCount: 338,
      posterUrl: "https://image.tmdb.org/t/p/w342/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
      type: "movie" as const,
    },
    {
      id: "cs-3",
      title: "Mononoke the Movie",
      releaseDateText: "Sep 30",
      bookedCount: 152,
      posterUrl: "https://image.tmdb.org/t/p/w342/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
      type: "movie" as const,
    },
    {
      id: "cs-4",
      title: "Avengers: Secret Wars",
      releaseDateText: "Oct 12",
      bookedCount: 1840,
      posterUrl: "https://image.tmdb.org/t/p/w342/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
      type: "movie" as const,
    },
  ];

  // Data for 7. Indian Stars Spotlight
  const indianStars = [
    {
      id: "star-1",
      name: "AJITH KUMAR",
      role: "Actor",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Ajith_Kumar_at_the_Tamil_Nadu_State_Film_Awards.jpg/360px-Ajith_Kumar_at_the_Tamil_Nadu_State_Film_Awards.jpg",
      gradient: "bg-gradient-to-br from-cyan-400 via-teal-600 to-blue-900",
    },
    {
      id: "star-2",
      name: "RAM CHARAN",
      role: "Actor",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Ram_Charan_at_the_launch_of_his_production_house.jpg/360px-Ram_Charan_at_the_launch_of_his_production_house.jpg",
      gradient: "bg-gradient-to-br from-amber-400 via-orange-600 to-red-900",
    },
    {
      id: "star-3",
      name: "KIARA ADVANI",
      role: "Actress",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Kiara_Advani_at_an_event_for_Govinda_Naam_Mera.jpg/360px-Kiara_Advani_at_an_event_for_Govinda_Naam_Mera.jpg",
      gradient: "bg-gradient-to-br from-fuchsia-400 via-pink-600 to-rose-900",
    },
    {
      id: "star-4",
      name: "SONU SOOD",
      role: "Actor",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Sonu_Sood_at_an_event.jpg/360px-Sonu_Sood_at_an_event.jpg",
      gradient: "bg-gradient-to-br from-blue-400 via-indigo-600 to-slate-900",
    },
  ];

  // 9. Discover Feed (combines movies and series)
  const discoverGridItems = [
    ...EXTENDED_MOVIES_CATALOG,
    ...EXTENDED_SERIES_CATALOG,
  ].slice(0, 15);

  return (
    <div className="min-h-screen bg-[#08080c] text-white pt-11 pb-28 px-3 sm:px-6 flex flex-col gap-8 max-w-7xl mx-auto">
      {/* 1. Hero Carousel */}
      <section className="w-full m-0 p-0">
        <HeroCarousel items={heroItems} />
      </section>

      {/* 2. Continue Watching (if items exist in local history) */}
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

      {/* 3A. Filterable Ranked Shelf: Trending Movies */}
      <section>
        <FilterableRankedShelf
          title="Trending Movies"
          tabs={movieTabs}
          itemsByTab={movieItemsByTab}
          allLinkHref="/movies"
          defaultType="movie"
        />
      </section>

      {/* 3B. Filterable Ranked Shelf: Trending TV Series */}
      <section>
        <FilterableRankedShelf
          title="Trending TV Series"
          tabs={seriesTabs}
          itemsByTab={seriesItemsByTab}
          allLinkHref="/series"
          defaultType="tv"
        />
      </section>

      {/* 4. Curated Collection Banners ("Must-Watch") */}
      <section>
        <CuratedCollectionsShelf collections={curatedCollections} />
      </section>

      {/* 5. Categorized Pill Shelf */}
      <section>
        <CategorizedPillShelf categories={categoryPills} />
      </section>

      {/* 6. "Coming Soon" Alert Shelf */}
      <section>
        <ComingSoonShelf items={comingSoonItems} />
      </section>

      {/* 7. Actor & Creator Spotlight Row ("Indian Stars") */}
      <section>
        <StarsSpotlightShelf stars={indianStars} />
      </section>

      {/* 8. Contextual Personalized Shelves ("Back to Favorites" & "Because U Watched") */}
      <section>
        <ContextualPersonalizedShelves
          favorites={favorites}
          becauseWatchedTitle={lastWatchedTitle}
          becauseWatchedItems={becauseWatchedItems}
        />
      </section>

      {/* 9. Multi-Row Grid Discover ("Most Trending") */}
      <section>
        <MultiRowGridDiscover items={discoverGridItems} />
      </section>
    </div>
  );
}
