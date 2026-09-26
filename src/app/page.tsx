"use client";

import React, { useState, useEffect } from "react";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ContinueWatchingShelf } from "@/components/ContinueWatchingShelf";
import { MediaShelf } from "@/components/MediaShelf";
import { tmdb, MediaItem } from "@/lib/tmdb";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [popularMovies, setPopularMovies] = useState<MediaItem[]>([]);
  const [topSeries, setTopSeries] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingData, moviesData, seriesData] = await Promise.all([
          tmdb.getTrending("all"),
          tmdb.getMovies("popular"),
          tmdb.getTVShows("top_rated"),
        ]);
        setTrending(trendingData || []);
        setPopularMovies(moviesData || []);
        setTopSeries(seriesData || []);
      } catch (err) {
        console.error("Home feed fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-2 text-zinc-400 text-xs">
        <Loader2 className="w-5 h-5 animate-spin text-white" />
        <span>Loading Spectra Cinema...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2 pb-28 space-y-6">
      {/* 1. Hero Carousel */}
      {trending.length > 0 && <HeroCarousel items={trending} type="movie" />}

      {/* 2. Playback Persistence Shelf */}
      <ContinueWatchingShelf />

      {/* 3. Catalog Media Shelves */}
      {trending.length > 0 && (
        <MediaShelf title="Trending Right Now" items={trending} type="movie" />
      )}
      {popularMovies.length > 0 && (
        <MediaShelf title="Blockbuster Movies" items={popularMovies} type="movie" />
      )}
      {topSeries.length > 0 && (
        <MediaShelf title="Top Rated Series" items={topSeries} type="tv" />
      )}
    </div>
  );
}
