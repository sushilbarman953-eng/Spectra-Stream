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
    <section id={id} className="relative py-6 px-6 group">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-medium tracking-wide text-white/90">
          {title}
        </h2>
        <div className="hidden group-hover:flex items-center gap-2">
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
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-4"
      >
        {items.map((item) => {
          const mediaType = item.media_type || type;
          const displayTitle = item.title || item.name || "Untitled";
          const posterUrl = item.poster_path
            ? `${IMAGE_BASE}/w342${item.poster_path}`
            : "/placeholder-poster.png";

          return (
            <Link
              key={item.id}
              href={`/details/${item.id}?type=${mediaType}`}
              className="flex-none w-36 sm:w-44 md:w-52"
            >
              <GlassCard
                hoverEffect
                className="overflow-hidden border border-white/10 transition-all duration-300 hover:scale-[1.03]"
              >
                <div className="relative aspect-[2/3] w-full bg-zinc-900">
                  {item.poster_path ? (
                    <Image
                      src={posterUrl}
                      alt={displayTitle}
                      fill
                      sizes="(max-width: 640px) 144px, (max-width: 768px) 176px, 208px"
                      className="object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-zinc-600 text-xs">
                      No Poster
                    </div>
                  )}

                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/15 text-[10px] text-zinc-300 font-medium">
                    <Star className="w-3 h-3 text-white fill-white" />
                    {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
                  </div>
                </div>

                <div className="p-3 bg-black/40">
                  <h3 className="text-xs md:text-sm font-medium text-white truncate">
                    {displayTitle}
                  </h3>
                  <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">
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
