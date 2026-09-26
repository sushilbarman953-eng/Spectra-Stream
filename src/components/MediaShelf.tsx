"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronRight } from "lucide-react";
import { MediaItem, IMAGE_BASE } from "@/lib/tmdb";
import { GlassCard } from "@/components/ui/GlassCard";

interface MediaShelfProps {
  title: string;
  items: MediaItem[];
  type: "movie" | "tv";
  viewAllHref?: string;
}

export const MediaShelf = ({
  title,
  items,
  type,
  viewAllHref,
}: MediaShelfProps) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-base font-bold text-white tracking-wide">{title}</h3>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex items-center gap-0.5 text-xs text-zinc-400 hover:text-white transition"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-2 pt-1">
        {items.map((item) => {
          const itemTitle = item.title || item.name || "Untitled";
          const poster = item.poster_path
            ? `${IMAGE_BASE}/w342${item.poster_path}`
            : null;

          return (
            <Link
              key={item.id}
              href={`/details/${item.id}?type=${type}`}
              className="flex-none w-32 sm:w-40 group"
            >
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
                      sizes="160px"
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
                <div className="p-2 bg-black/60">
                  <h4 className="text-xs font-semibold text-white truncate">
                    {itemTitle}
                  </h4>
                </div>
              </GlassCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
