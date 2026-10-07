"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MediaItem } from "@/lib/tmdb";
import { soundFx } from "@/lib/soundFx";
import { MediaPosterCard } from "@/components/MediaPosterCard";

interface OttShelfProps {
  title: string;
  subtitle?: string;
  icon?: any;
  items: (MediaItem & { audioLanguages?: string[]; rank?: number })[];
  isRanked?: boolean;
  type?: "movie" | "tv";
  badgeLabel?: string;
}

export const OttShelf: React.FC<OttShelfProps> = ({
  title,
  subtitle,
  icon: Icon,
  items,
  isRanked = false,
  type = "movie",
  badgeLabel,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!rowRef.current) return;
    const scrollAmount = direction === "left" ? -340 : 340;
    rowRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    soundFx.playMechanicalTick();
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-2 relative group/shelf select-none">
      <div className="flex items-center justify-between px-1">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            {Icon && <Icon className="w-3.5 h-3.5 text-red-500 flex-none" />}
            <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
              {title}
            </h3>
          </div>
          {subtitle && (
            <p className="text-[10px] text-zinc-400 font-medium pl-5">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[10px] text-zinc-500 font-mono pr-1 hidden sm:inline">
            {items.length} Titles
          </span>
          <button
            onClick={() => scroll("left")}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition hidden md:flex items-center justify-center border border-white/10"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition hidden md:flex items-center justify-center border border-white/10"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div
        ref={rowRef}
        className="flex gap-2.5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-1 px-1"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {items.map((item, idx) => (
          <MediaPosterCard
            key={`shelf-${item.id}-${idx}`}
            item={item}
            rank={isRanked ? idx + 1 : undefined}
            defaultType={type}
            badgeLabel={badgeLabel}
            widthClass={isRanked ? "w-36 sm:w-40" : "w-28 sm:w-32"}
          />
        ))}
      </div>
    </div>
  );
};
