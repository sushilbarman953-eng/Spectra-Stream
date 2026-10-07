"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronRight } from "lucide-react";
import { MediaItem, IMAGE_BASE } from "@/lib/tmdb";
import { soundFx } from "@/lib/soundFx";

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

  const resolvePoster = (item: MediaItem) => {
    if (!item?.poster_path) {
      return "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=342&q=80";
    }
    if (item.poster_path.startsWith("http")) {
      return item.poster_path;
    }
    return `${IMAGE_BASE}/w342${item.poster_path}`;
  };

  return (
    <div className="space-y-3 pt-2 select-none">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-base font-bold text-white tracking-wide">{title}</h3>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            onClick={() => soundFx.playCinematicPop()}
            className="flex items-center gap-0.5 text-xs text-zinc-400 hover:text-white transition"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      <div className="flex gap-2.5 overflow-x-auto no-scrollbar scroll-smooth pb-1 px-0.5">
        {items.map((item) => {
          const itemTitle = item.title || item.name || "Untitled";
          const poster = resolvePoster(item);

          return (
            <Link
              key={item.id}
              href={`/details/${item.id}?type=${type}`}
              onClick={() => soundFx.playCinematicPop()}
              className="flex-none w-28 sm:w-32 group flex flex-col"
            >
              <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 group-hover:border-white/30 transition shadow-md group-hover:scale-[1.02]">
                <Image
                  src={poster}
                  alt={itemTitle}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Floating Top-Left: Rating */}
                {item.vote_average ? (
                  <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded-lg text-[8px] text-white font-bold border border-white/15 z-10 shadow-md">
                    <Star className="w-2.5 h-2.5 fill-white text-white" />
                    <span>{Number(item.vote_average).toFixed(1)}</span>
                  </div>
                ) : null}

                {/* Floating Top-Right: Language Pill */}
                <div className="absolute top-1.5 right-1.5 z-10">
                  <span className="px-1.5 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-wider bg-red-600/30 backdrop-blur-md border border-red-500/40 text-red-200 shadow-[0_0_8px_rgba(239,68,68,0.45)]">
                    MULTI
                  </span>
                </div>
              </div>

              {/* Only Title Beneath */}
              <h4 className="text-[11px] font-bold text-white truncate mt-1.5 group-hover:text-red-300 transition">
                {itemTitle}
              </h4>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
