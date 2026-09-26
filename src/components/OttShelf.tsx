"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Film, ChevronLeft, ChevronRight } from "lucide-react";
import { MediaItem } from "@/lib/tmdb";
import { soundFx } from "@/lib/soundFx";

interface OttShelfProps {
  title: string;
  subtitle?: string;
  icon?: any;
  items: (MediaItem & { audioLanguages?: string[]; rank?: number })[];
  isRanked?: boolean;
  type?: "movie" | "tv";
}

export const OttShelf: React.FC<OttShelfProps> = ({
  title,
  subtitle,
  icon: Icon,
  items,
  isRanked = false,
  type = "movie",
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!rowRef.current) return;
    const scrollAmount = direction === "left" ? -340 : 340;
    rowRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    soundFx.playMechanicalTick();
  };

  const getAudioBadgeText = (langs?: string[]): string => {
    if (!langs || langs.length === 0) return "HINDI";
    const hasHindi = langs.some((l) => ["hi", "hin", "hindi"].includes(l.toLowerCase()));
    if (hasHindi) return "HINDI";
    if (langs.length > 2) return "MULTI";
    return langs[0].toUpperCase();
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-2 relative group/shelf">
      <div className="flex items-center justify-between px-1">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            {Icon && <Icon className="w-3.5 h-3.5 text-emerald-400 flex-none" />}
            <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
              {title}
            </h3>
          </div>
          {subtitle && (
            <p className="text-[10px] text-zinc-400 font-medium pl-5">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-1">
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
        data-no-swipe="true"
        className="flex gap-2.5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-1 px-1"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {items.map((item, idx) => {
          const mediaType = item.media_type || type;
          const badgeText = getAudioBadgeText(item.audioLanguages);
          const rank = idx + 1;

          return (
            <Link
              key={`shelf-${item.id}-${idx}`}
              href={`/details/${item.id}?type=${mediaType}`}
              onClick={() => soundFx.playCinematicPop()}
              className={`flex-none snap-start group relative ${
                isRanked ? "w-36 sm:w-40 pl-6" : "w-28 sm:w-32"
              }`}
            >
              {isRanked && (
                <span className="absolute -left-1 bottom-6 text-5xl sm:text-6xl font-black italic tracking-tighter text-zinc-600/60 select-none group-hover:text-emerald-400/80 transition-colors z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {rank}
                </span>
              )}

              <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-zinc-950 border border-white/10 group-hover:border-white/35 transition-all shadow-md group-hover:scale-[1.02]">
                {item.poster_path ? (
                  <Image
                    src={item.poster_path}
                    alt={item.title || item.name || "Media"}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-600">
                    <Film className="w-5 h-5" />
                  </div>
                )}

                {/* Top-Left: Star Rating */}
                {item.vote_average ? (
                  <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] text-white font-bold border border-white/15 shadow-sm">
                    <Star className="w-2 h-2 fill-white text-white" />
                    {item.vote_average.toFixed(1)}
                  </div>
                ) : null}

                {/* Top-Right: Language Badge */}
                <div className="absolute top-1.5 right-1.5 flex items-center">
                  <span className="bg-emerald-400 text-black px-1.5 py-0.5 rounded text-[7.5px] font-black uppercase shadow-glow tracking-tight">
                    {badgeText}
                  </span>
                </div>
              </div>

              <h4 className="text-[11px] font-bold text-white truncate mt-1 group-hover:text-emerald-300 transition-colors">
                {item.title || item.name}
              </h4>
              <p className="text-[9px] text-zinc-400 font-mono truncate">
                {(item.audioLanguages || ["HIN", "ENG"]).join(" • ")}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
