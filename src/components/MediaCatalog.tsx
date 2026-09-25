"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, SlidersHorizontal, Loader2, Sparkles, Check } from "lucide-react";
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

  const appendUniqueItems = (prev: MediaItem[], incoming: MediaItem[]) => {
    const existingIds = new Set(prev.map((i) => i.id));
    const unique = incoming.filter((i) => !existingIds.has(i.id));
    return [...prev, ...unique];
  };

  useEffect(() => {
    if (selectedGenre === null && sortBy === "popularity.desc" && page === 1) return;

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
            if (!data.results || data.results.length === 0) setHasMore(false);
          }
        }
      } catch (err) {
        console.error("Failed to load catalog:", err);
      } finally {
        if (isMounted) setIsInitialLoading(false);
      }
    };

    fetchFreshCatalog();
    return () => {
      isMounted = false;
    };
  }, [selectedGenre, sortBy, type]);

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
        const incoming = data.results || [];
        if (incoming.length === 0) {
          setHasMore(false);
        } else {
          setItems((prev) => appendUniqueItems(prev, incoming));
          setPage(nextPage);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load more titles:", err);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, isInitialLoading, page, type, sortBy, selectedGenre]);

  useEffect(() => {
    const target = observerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isInitialLoading) {
          loadNextPage();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [loadNextPage, hasMore, isLoadingMore, isInitialLoading]);

  const activeGenreName = genres.find((g) => g.id === selectedGenre)?.name || "All";

  return (
    <div className="space-y-4">
      {/* Top Header & Sort Control */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/10">
        <div>
          <h1 className="text-lg md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-1.5">
            {title}
            <span className="text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-zinc-200">
              {activeGenreName}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl glass-panel text-[11px] text-zinc-300 border border-white/10">
          <SlidersHorizontal className="w-3 h-3 text-zinc-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-white text-[11px] focus:outline-none cursor-pointer"
          >
            <option value="popularity.desc" className="bg-[#0f0f13] text-white">Popular</option>
            <option value="vote_average.desc" className="bg-[#0f0f13] text-white">Top Rated</option>
            <option value="primary_release_date.desc" className="bg-[#0f0f13] text-white">Latest</option>
          </select>
        </div>
      </div>

      {/* Main 2-Column Split: True Vertical Sidebar (Left) + Poster Grid (Right) */}
      <div className="flex gap-3 items-start">
        
        {/* Left Sticky Vertical Category Rail */}
        <aside
          className="w-24 sm:w-36 md:w-48 flex-none sticky top-20 rounded-2xl border border-white/15 p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.7)] flex flex-col gap-1 max-h-[calc(100vh-140px)] overflow-y-auto no-scrollbar"
          style={{
            background: "rgba(12, 12, 16, 0.75)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
          }}
        >
          <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-white/10">
            <Sparkles className="w-3 h-3 text-white" />
            <span className="truncate">Genres</span>
          </div>

          <div className="flex flex-col gap-1 pt-1">
            <button
              onClick={() => setSelectedGenre(null)}
              className={`w-full text-left px-2 py-2 rounded-xl text-[11px] sm:text-xs transition flex items-center justify-between ${
                selectedGenre === null
                  ? "bg-white text-black font-bold shadow-[0_0_12px_rgba(255,255,255,0.45)]"
                  : "text-zinc-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="truncate">All</span>
              {selectedGenre === null && <Check className="w-3 h-3 stroke-[3] flex-none ml-1" />}
            </button>

            {genres.map((g) => {
              const isSelected = selectedGenre === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setSelectedGenre(g.id)}
                  className={`w-full text-left px-2 py-2 rounded-xl text-[11px] sm:text-xs transition flex items-center justify-between ${
                    isSelected
                      ? "bg-white text-black font-bold shadow-[0_0_12px_rgba(255,255,255,0.45)]"
                      : "text-zinc-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span className="truncate">{g.name}</span>
                  {isSelected && <Check className="w-3 h-3 stroke-[3] flex-none ml-1" />}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Media Grid Section */}
        <div className="flex-1 min-w-0 space-y-4">
          {isInitialLoading && (
            <div className="flex items-center justify-center py-20 gap-2 text-zinc-400 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Loading titles...</span>
            </div>
          )}

          {!isInitialLoading && items.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
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
                            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-zinc-600 text-xs">
                            No Poster
                          </div>
                        )}

                        <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-white/15 text-[9px] text-zinc-200 font-medium">
                          <Star className="w-2.5 h-2.5 text-white fill-white" />
                          {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
                        </div>
                      </div>

                      <div className="p-2 bg-black/50">
                        <h3 className="text-[11px] sm:text-xs font-semibold text-white truncate group-hover:text-zinc-200">
                          {itemTitle}
                        </h3>
                        <p className="text-[9px] text-zinc-400 mt-0.5 uppercase tracking-wider">
                          {releaseYear || type}
                        </p>
                      </div>
                    </GlassCard>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Infinite Scroll Sentinel */}
          <div ref={observerRef} className="py-6 flex items-center justify-center">
            {isLoadingMore && (
              <div className="flex items-center gap-2 text-zinc-400 text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Loading more...</span>
              </div>
            )}
            {!hasMore && items.length > 0 && (
              <p className="text-xs text-zinc-500">End of catalog reached.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
