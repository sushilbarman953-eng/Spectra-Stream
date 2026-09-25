"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, SlidersHorizontal, Loader2, Sparkles, X, Check } from "lucide-react";
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
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

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

  const activeGenreName = genres.find((g) => g.id === selectedGenre)?.name || "All Titles";

  return (
    <div className="space-y-4">
      {/* Top Header & Sort Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h1 className="text-xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            {title}
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-zinc-300">
              {activeGenreName}
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">Explore by vertical genre curation</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Filter Sheet Trigger Button */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/20 text-xs font-semibold text-white shadow-glow"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(16px)",
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Genres</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel text-xs text-zinc-300 border border-white/10">
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-white text-xs focus:outline-none cursor-pointer"
            >
              <option value="popularity.desc" className="bg-[#0f0f13] text-white">Popular</option>
              <option value="vote_average.desc" className="bg-[#0f0f13] text-white">Top Rated</option>
              <option value="primary_release_date.desc" className="bg-[#0f0f13] text-white">Latest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Vertical Categories (Left) + Media Grid (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 items-start">
        
        {/* Desktop Vertical Genre Sidebar */}
        <aside className="hidden md:flex flex-col gap-1 sticky top-24 p-3 rounded-2xl border border-white/15 bg-[#0c0c10]/80 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-2 px-2 pb-2 text-xs font-bold tracking-wider text-zinc-400 uppercase border-b border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            Categories
          </div>

          <div className="flex flex-col gap-1 max-h-[70vh] overflow-y-auto no-scrollbar pt-2">
            <button
              onClick={() => setSelectedGenre(null)}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                selectedGenre === null
                  ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  : "text-zinc-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>All Categories</span>
              {selectedGenre === null && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>

            {genres.map((g) => {
              const isSelected = selectedGenre === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setSelectedGenre(g.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                    isSelected
                      ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                      : "text-zinc-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span>{g.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Media Grid Section */}
        <main className="md:col-span-3 lg:col-span-4 space-y-4">
          {isInitialLoading && (
            <div className="flex items-center justify-center py-20 gap-2 text-zinc-400 text-xs">
              <Loader2 className="w-5 h-5 animate-spin text-white" />
              <span>Fetching {activeGenreName}...</span>
            </div>
          )}

          {!isInitialLoading && items.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
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
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
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
        </main>
      </div>

      {/* Mobile Slide-Up Bottom Drawer for Categories */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-md md:hidden animate-in fade-in duration-200">
          <div
            className="w-full max-h-[75vh] flex flex-col p-4 rounded-t-3xl border-t border-white/20 bg-[#0d0d12]/95 shadow-[0_-10px_40px_rgba(0,0,0,0.9)] animate-in slide-in-from-bottom-5 duration-300"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Select Category
              </span>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 overflow-y-auto py-3 no-scrollbar">
              <button
                onClick={() => {
                  setSelectedGenre(null);
                  setMobileDrawerOpen(false);
                }}
                className={`p-2.5 rounded-xl text-xs font-semibold border text-left transition ${
                  selectedGenre === null
                    ? "bg-white text-black border-white shadow-glow"
                    : "bg-white/5 text-zinc-300 border-white/10"
                }`}
              >
                All Categories
              </button>

              {genres.map((g) => {
                const isSelected = selectedGenre === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => {
                      setSelectedGenre(g.id);
                      setMobileDrawerOpen(false);
                    }}
                    className={`p-2.5 rounded-xl text-xs font-semibold border text-left transition ${
                      isSelected
                        ? "bg-white text-black border-white shadow-glow"
                        : "bg-white/5 text-zinc-300 border-white/10"
                    }`}
                  >
                    {g.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
