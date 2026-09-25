"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { MediaItem, IMAGE_BASE } from "@/lib/tmdb";
import { GlassCard } from "@/components/ui/GlassCard";

interface MediaRowProps {
  title: string;
  items: MediaItem[];
  type?: "movie" | "tv";
  id?: string;
}

export const MediaRow = ({ title, items, type = "movie", id }: MediaRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section id={id} className="relative py-1 px-4 md:px-8 group">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-base md:text-lg font-semibold tracking-wide text-white/95">
          {title}
        </h2>
        <div className="hidden group-hover:flex items-center gap-1.5">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="p-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-zinc-300 hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="p-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-zinc-300 hover:text-white transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-2"
      >
        {items.map((item) => {
          const mediaType = item.media_type || type;
          const displayTitle = item.title || item.name || "Untitled";
          const posterUrl = item.poster_path
            ? `${IMAGE_BASE}/w342${item.poster_path}`
            : null;

          return (
            <Link
              key={item.id}
              href={`/details/${item.id}?type=${mediaType}`}
              className="flex-none w-32 sm:w-40 md:w-48"
            >
              <GlassCard
                hoverEffect
                className="overflow-hidden border border-white/10 transition-all duration-300"
              >
                <div className="relative aspect-[2/3] w-full bg-zinc-950">
                  {posterUrl ? (
                    <Image
                      src={posterUrl}
                      alt={displayTitle}
                      fill
                      sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 192px"
                      className="object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-zinc-600 text-xs">
                      No Poster
                    </div>
                  )}

                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-white/15 text-[10px] text-zinc-200 font-medium">
                    <Star className="w-2.5 h-2.5 text-white fill-white" />
                    {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
                  </div>
                </div>

                <div className="p-2.5 bg-black/40">
                  <h3 className="text-xs font-medium text-white truncate">
                    {displayTitle}
                  </h3>
                  <p className="text-[10px] text-zinc-500 mt-0.5 uppercase tracking-wider">
                    {item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4) || "Media"}
                  </p>
                </div>
              </GlassCard>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
