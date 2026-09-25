"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, SlidersHorizontal, Loader2 } from "lucide-react";
import { MediaItem, Genre, IMAGE_BASE } from "@/lib/tmdb";
import { GlassCard } from "@/components/ui/GlassCard";

interface MediaCatalogProps {
  type: "movie" | "tv";
  title: string;
  genres: Genre[];
  initialItems: MediaItem[];
}

export const MediaCatalog = ({
  type,
  title,
  genres,
  initialItems,
}: MediaCatalogProps) => {
  const [items, setItems] = useState<MediaItem[]>(initialItems);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>("popularity.desc");
  const [page, setPage] = useState<number>(1);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef<HTMLDivElement | null>(null);

  // Helper to deduplicate array by item ID
  const appendUniqueItems = (prev: MediaItem[], incoming: MediaItem[]) => {
    const existingIds = new Set(prev.map((i) => i.id));
    const unique = incoming.filter((i) => !existingIds.has(i.id));
    return [...prev, ...unique];
  };

  // Reset & load page 1 on genre or sort change
  useEffect(() => {
    if (selectedGenre === null && sortBy === "popularity.desc" && page === 1) {
      return;
    }

    let isMounted = true;
    const fetchFreshCatalog = async () => {
      setIsInitialLoading(true);
      setHasMore(true);
      setPage(1);

      try {
        const queryParams = new URLSearchParams({
          type,
          sort_by: sortBy,
          page: "1",
          ...(selectedGenre ? { genre: selectedGenre.toString() } : {}),
        });

        const res = await fetch(`/api/discover?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setItems(data.results || []);
            if (!data.results || data.results.length === 0) {
              setHasMore(false);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load initial catalog page:", err);
      } finally {
        if (isMounted) setIsInitialLoading(false);
      }
    };

    fetchFreshCatalog();

    return () => {
      isMounted = false;
    };
  }, [selectedGenre, sortBy, type]);

  // Load next page
  const loadNextPage = useCallback(async () => {
    if (isLoadingMore || !hasMore || isInitialLoading) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;

    try {
      const queryParams = new URLSearchParams({
        type,
        sort_by: sortBy,
        page: nextPage.toString(),
        ...(selectedGenre ? { genre: selectedGenre.toString() } : {}),
      });

      const res = await fetch(`/api/discover?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const incomingResults = data.results || [];

        if (incomingResults.length === 0) {
          setHasMore(false);
        } else {
          setItems((prev) => appendUniqueItems(prev, incomingResults));
          setPage(nextPage);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load next catalog page:", err);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, isInitialLoading, page, type, sortBy, selectedGenre]);

  // Attach IntersectionObserver to sentinel element
  useEffect(() => {
    const target = observerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isInitialLoading) {
          loadNextPage();
        }
      },
      { rootMargin: "300px" } // Pre-fetch before user reaches absolute bottom
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [loadNextPage, hasMore, isLoadingMore, isInitialLoading]);

  return (
    <div className="space-y-6">
      {/* Header and Sorting Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {title}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Discover and filter titles by genre and rating with continuous browsing
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel text-xs text-zinc-300 border border-white/10">
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-white text-xs focus:outline-none cursor-pointer"
            >
              <option value="popularity.desc" className="bg-[#0f0f13] text-white">
                Most Popular
              </option>
              <option value="vote_average.desc" className="bg-[#0f0f13] text-white">
                Highest Rated
              </option>
              <option value="primary_release_date.desc" className="bg-[#0f0f13] text-white">
                Latest Releases
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Genre Filter Horizontal Scroll */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setSelectedGenre(null)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
            selectedGenre === null
              ? "bg-white text-black border-white shadow-glow font-bold"
              : "bg-white/5 text-zinc-400 border-white/10 hover:text-white hover:bg-white/10"
          }`}
        >
          All Genres
        </button>

        {genres.map((genre) => {
          const isSelected = selectedGenre === genre.id;
          return (
            <button
              key={genre.id}
              onClick={() => setSelectedGenre(genre.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                isSelected
                  ? "bg-white text-black border-white shadow-glow font-bold"
                  : "bg-white/5 text-zinc-400 border-white/10 hover:text-white hover:bg-white/10"
              }`}
            >
              {genre.name}
            </button>
          );
        })}
      </div>

      {/* Initial Filter Loading Spinner */}
      {isInitialLoading && (
        <div className="flex items-center justify-center py-16 gap-2 text-zinc-400 text-xs">
          <Loader2 className="w-5 h-5 animate-spin text-white" />
          <span>Refreshing library...</span>
        </div>
      )}

      {/* Media Grid */}
      {!isInitialLoading && items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {items.map((item) => {
            const itemTitle = item.title || item.name || "Untitled";
            const posterUrl = item.poster_path
              ? `${IMAGE_BASE}/w342${item.poster_path}`
              : null;
            const releaseYear = (item.release_date || item.first_air_date || "").slice(0, 4);

            return (
              <Link
                key={item.id}
                href={`/details/${item.id}?type=${type}`}
                className="group"
              >
                <GlassCard
                  hoverEffect
                  className="overflow-hidden border border-white/10 h-full flex flex-col justify-between"
                >
                  <div className="relative aspect-[2/3] w-full bg-zinc-950">
                    {posterUrl ? (
                      <Image
                        src={posterUrl}
                        alt={itemTitle}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-zinc-600 text-xs">
                        No Poster
                      </div>
                    )}

                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-white/15 text-[10px] text-zinc-200 font-medium">
                      <Star className="w-2.5 h-2.5 text-white fill-white" />
                      {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
                    </div>
                  </div>

                  <div className="p-2.5 bg-black/50">
                    <h3 className="text-xs font-semibold text-white truncate group-hover:text-zinc-200">
                      {itemTitle}
                    </h3>
                    <p className="text-[10px] text-zinc-400 mt-0.5 uppercase tracking-wider">
                      {releaseYear || type}
                    </p>
                  </div>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      )}

      {/* Infinite Scroll Bottom Sentinel */}
      <div ref={observerRef} className="py-6 flex items-center justify-center">
        {isLoadingMore && (
          <div className="flex items-center gap-2 text-zinc-400 text-xs">
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Loading more titles...</span>
          </div>
        )}
        {!hasMore && items.length > 0 && (
          <p className="text-xs text-zinc-500">You have reached the end of the catalog.</p>
        )}
      </div>

      {/* Empty State */}
      {!isInitialLoading && items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-400 gap-2">
          <p className="text-sm">No titles found for this filter combination.</p>
          <button
            onClick={() => {
              setSelectedGenre(null);
              setSortBy("popularity.desc");
            }}
            className="text-xs text-white underline underline-offset-4 hover:text-zinc-300"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
