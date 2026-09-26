"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  Star,
  Film,
  Tv,
  Flame,
  Sparkles,
  TrendingUp,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";
import { tmdb, MediaItem, IMAGE_BASE } from "@/lib/tmdb";
import { GlassCard } from "@/components/ui/GlassCard";

const GENRES = [
  { id: "all", name: "All Genres" },
  { id: "28", name: "Action" },
  { id: "12", name: "Adventure" },
  { id: "16", name: "Animation" },
  { id: "35", name: "Comedy" },
  { id: "80", name: "Crime" },
  { id: "18", name: "Drama" },
  { id: "14", name: "Fantasy" },
  { id: "27", name: "Horror" },
  { id: "878", name: "Sci-Fi" },
  { id: "53", name: "Thriller" },
];

export default function ExplorePage() {
  const [mediaType, setMediaType] = useState<"movie" | "tv">("movie");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"trending" | "top_rated" | "popular">("trending");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadDiscovery = async () => {
      try {
        let results: MediaItem[] = [];

        if (sortBy === "trending") {
          results = await tmdb.getTrending(mediaType);
        } else if (sortBy === "top_rated") {
          results = await tmdb.getTopRated(mediaType);
        } else {
          results = await tmdb.getPopular(mediaType);
        }

        // Apply genre filter if selected
        if (selectedGenre !== "all") {
          const gId = parseInt(selectedGenre, 10);
          results = results.filter((item) => item.genre_ids?.includes(gId));
        }

        if (isMounted) setItems(results);
      } catch (err) {
        console.error("Explore fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDiscovery();
    return () => {
      isMounted = false;
    };
  }, [mediaType, selectedGenre, sortBy]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 pb-28 space-y-5">
      {/* Title & Type Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-white" />
            Explore Catalog
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Discover curated movies, series, and global releases
          </p>
        </div>

        {/* Media Type Toggle: Movies vs TV Shows */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/5 border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setMediaType("movie")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              mediaType === "movie"
                ? "bg-white text-black shadow-glow font-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Movies</span>
          </button>

          <button
            onClick={() => setMediaType("tv")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              mediaType === "tv"
                ? "bg-white text-black shadow-glow font-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Series</span>
          </button>
        </div>
      </div>

      {/* Sorting & Filter Strip */}
      <div className="space-y-2.5">
        {/* Sort Pill Row */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: "trending", label: "Trending", icon: TrendingUp },
            { id: "top_rated", label: "Highest Rated", icon: Star },
            { id: "popular", label: "Popular", icon: Flame },
          ].map((tab) => {
            const isSelected = sortBy === tab.id;
            const TabIcon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setSortBy(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition ${
                  isSelected
                    ? "bg-white text-black border-white shadow-glow"
                    : "bg-white/5 text-zinc-400 border-white/10 hover:text-white"
                }`}
              >
                <TabIcon className="w-3 h-3" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Genre Pill Horizontal Scroller */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {GENRES.map((g) => {
            const isSelected = selectedGenre === g.id;

            return (
              <button
                key={g.id}
                onClick={() => setSelectedGenre(g.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition border ${
                  isSelected
                    ? "bg-white/20 text-white border-white/40 shadow-glow"
                    : "bg-white/[0.04] text-zinc-400 border-white/10 hover:text-zinc-200"
                }`}
              >
                {g.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Media Discovery Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh] gap-2 text-zinc-400 text-xs">
          <Loader2 className="w-5 h-5 animate-spin text-white" />
          <span>Curating catalog...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center space-y-2">
          <SlidersHorizontal className="w-8 h-8 text-zinc-600 mx-auto" />
          <h4 className="text-sm font-bold text-white">No titles match this filter</h4>
          <p className="text-xs text-zinc-400">Try choosing a different genre or sort option.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map((item) => {
            const itemTitle = item.title || item.name || "Untitled";
            const year = (item.release_date || item.first_air_date || "").slice(0, 4);
            const poster = item.poster_path ? `${IMAGE_BASE}/w342${item.poster_path}` : null;

            return (
              <Link key={item.id} href={`/details/${item.id}?type=${mediaType}`} className="group">
                <GlassCard
                  hoverEffect
                  className="overflow-hidden border border-white/10 rounded-2xl h-full flex flex-col justify-between bg-[#0b0b10]"
                >
                  <div className="relative aspect-[2/3] w-full bg-zinc-950">
                    {poster ? (
                      <Image
                        src={poster}
                        alt={itemTitle}
                        fill
                        sizes="180px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-zinc-600 text-xs">
                        No Poster
                      </div>
                    )}

                    {item.vote_average > 0 && (
                      <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] text-white font-bold border border-white/15">
                        <Star className="w-2.5 h-2.5 fill-white text-white" />
                        {item.vote_average.toFixed(1)}
                      </div>
                    )}
                  </div>

                  <div className="p-2 bg-black/60 space-y-0.5">
                    <h4 className="text-xs font-bold text-white truncate">{itemTitle}</h4>
                    <div className="flex items-center justify-between text-[10px] text-zinc-400">
                      <span>{year || "N/A"}</span>
                      <span className="uppercase text-[9px] font-semibold text-zinc-300">
                        {mediaType === "tv" ? "Series" : "Movie"}
                      </span>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
