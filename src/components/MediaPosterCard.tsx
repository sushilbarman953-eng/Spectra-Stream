"use client";

import React from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { IMAGE_BASE, MediaItem } from "@/lib/tmdb";
import { soundFx } from "@/lib/soundFx";
import { SafeImage } from "@/components/SafeImage";

interface MediaPosterCardProps {
  item: MediaItem & { rank?: number; audioLanguages?: string[] };
  href?: string;
  rank?: number;
  badgeLabel?: string;
  defaultType?: "movie" | "tv";
  widthClass?: string;
}

export const MediaPosterCard: React.FC<MediaPosterCardProps> = ({
  item,
  href,
  rank,
  badgeLabel,
  defaultType = "movie",
  widthClass = "w-28 sm:w-32",
}) => {
  const resolvePoster = (src?: string | null) => {
    if (!src) return "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=342&q=80";
    if (src.startsWith("http")) return src;
    return `${IMAGE_BASE}/w342${src}`;
  };

  const title = item.title || item.name || "Untitled";
  const targetType = item.media_type || defaultType;
  const targetHref = href || `/details/${item.id}?type=${targetType}`;

  const langTag =
    badgeLabel ||
    (item.audioLanguages && item.audioLanguages.length > 1
      ? "MULTI"
      : item.audioLanguages?.[0] || "Hindi");

  const rating = item.vote_average ? Number(item.vote_average).toFixed(1) : "8.5";

  return (
    <Link
      href={targetHref}
      onClick={() => soundFx.playCinematicPop()}
      className={`flex-none ${widthClass} group relative flex flex-col select-none`}
    >
      <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 group-hover:border-white/35 transition-all shadow-md group-hover:scale-[1.02]">
        {/* SAFE IMAGE WITH SHIMMER LOADER */}
        <SafeImage
          src={resolvePoster(item.poster_path)}
          alt={title}
          fill
        />

        {/* Ambient Top & Bottom Contrast Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

        {/* PERFECTLY LEVEL FLOATING HEADER ROW */}
        <div className="absolute top-2 inset-x-2 z-20 flex items-center justify-between pointer-events-none">
          {/* Floating Left: Star Rating */}
          <div className="flex items-center gap-1 h-5 px-1.5 rounded-md bg-black/80 backdrop-blur-md border border-white/15 text-[9px] font-bold text-white shadow-md leading-none">
            <Star className="w-2.5 h-2.5 fill-white text-white shrink-0" />
            <span>{rating}</span>
          </div>

          {/* Floating Right: Language Pill */}
          <div className="flex items-center h-5 px-1.5 rounded-md bg-red-600/35 backdrop-blur-md border border-red-500/40 text-[8px] font-black uppercase tracking-wider text-red-100 shadow-[0_0_8px_rgba(239,68,68,0.4)] leading-none">
            <span>{langTag}</span>
          </div>
        </div>

        {/* Giant Translucent Watermark Rank Number */}
        {typeof rank === "number" && (
          <span className="absolute -bottom-2 right-1 text-5xl sm:text-6xl font-black italic tracking-tighter text-white/35 pointer-events-none select-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] font-sans">
            {rank}
          </span>
        )}
      </div>

      {/* Title only beneath poster */}
      <h4 className="text-[11px] font-bold text-white truncate mt-1.5 group-hover:text-red-300 transition-colors">
        {title}
      </h4>
    </Link>
  );
};
