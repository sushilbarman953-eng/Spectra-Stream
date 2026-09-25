"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Star } from "lucide-react";
import { MediaItem, IMAGE_BASE } from "@/lib/tmdb";
import { GlassCard } from "@/components/ui/GlassCard";

interface VerticalSectionRowProps {
  title: string;
  items: MediaItem[];
  type: "movie" | "tv";
  seeAllHref: string;
}

export const VerticalSectionRow = ({
  title,
  items,
  type,
  seeAllHref,
}: VerticalSectionRowProps) => {
  const top20 = items.slice(0, 20);
  if (!top20.length) return null;

  return (
    <section className="space-y-3 py-2">
      {/* Row Header with "See Full List" */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-2">
          {title}
        </h3>
        <Link
          href={seeAllHref}
          className="flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-white transition group"
        >
          <span>See Full List</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Horizontal Smooth Scrollable Strip (20 items) */}
      <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2 pt-1">
        {top20.map((item, idx) => {
          const itemTitle = item.title || item.name || "Untitled";
          const posterUrl = item.poster_path
            ? `${IMAGE_BASE}/w342${item.poster_path}`
            : null;
          const releaseYear = (item.release_date || item.first_air_date || "").slice(0, 4);

          return (
            <Link
              key={item.id}
              href={`/details/${item.id}?type=${type}`}
              className="flex-none w-32 sm:w-40 md:w-44 group"
            >
              <GlassCard
                hoverEffect
                className="overflow-hidden border border-white/10 rounded-2xl flex flex-col justify-between h-full bg-[#0c0c10]"
              >
                <div className="relative aspect-[2/3] w-full bg-zinc-950">
                  {posterUrl ? (
                    <Image
                      src={posterUrl}
                      alt={itemTitle}
                      fill
                      sizes="(max-width: 640px) 130px, 175px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-zinc-600 text-xs">
                      No Poster
                    </div>
                  )}

                  {/* Top-Right Rating Badge */}
                  <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-white/15 text-[9px] text-zinc-200 font-medium">
                    <Star className="w-2.5 h-2.5 text-white fill-white" />
                    {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
                  </div>

                  {/* Ranking Number */}
                  <div className="absolute bottom-1 left-2 text-2xl font-black text-white/40 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    {idx + 1}
                  </div>
                </div>

                <div className="p-2 bg-black/60">
                  <h4 className="text-[11px] sm:text-xs font-semibold text-white truncate group-hover:text-zinc-200">
                    {itemTitle}
                  </h4>
                  <p className="text-[9px] text-zinc-400 mt-0.5 uppercase tracking-wider">
                    {releaseYear || type}
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
