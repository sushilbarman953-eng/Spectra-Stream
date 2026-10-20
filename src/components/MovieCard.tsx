"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Film } from "lucide-react";
import { soundFx } from "@/lib/soundFx";

interface MovieCardProps {
  id?: number | string;
  title: string;
  posterPath: string;
  isPriority?: boolean;
  rating?: number | string;
  langBadge?: string;
  mediaType?: "movie" | "tv";
}

function resolvePosterUrl(path: string): string {
  if (!path) return "";
  const t = path.trim();
  if (t.startsWith("http://") || t.startsWith("https://")) {
    if (t.includes("image.tmdb.org")) {
      return "https://wsrv.nl/?url=" + encodeURIComponent(t) + "&w=342&output=webp&q=80";
    }
    return t;
  }
  const clean = t.startsWith("/") ? t : "/" + t;
  return "https://wsrv.nl/?url=" + encodeURIComponent("https://image.tmdb.org/t/p/w342" + clean) + "&w=342&output=webp&q=80";
}

export function MovieCard({
  id,
  title,
  posterPath,
  isPriority = false,
  rating = "8.5",
  langBadge = "MULTI",
  mediaType = "movie",
}: MovieCardProps) {
  const [hasError, setHasError] = useState(false);
  const resolvedSrc = resolvePosterUrl(posterPath);

  const cardContent = (
    <div className="group relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-zinc-950 border border-white/10 hover:border-white/30 transition-all duration-300 shadow-md hover:scale-[1.02]">
      {resolvedSrc && !hasError ? (
        <Image
          src={resolvedSrc}
          alt={title}
          fill
          unoptimized
          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 15vw"
          priority={isPriority}
          loading={isPriority ? "eager" : "lazy"}
          onError={() => setHasError(true)}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-between p-2.5 text-center bg-gradient-to-br from-[#1a1c2e] via-[#10121a] to-[#07080c] select-none">
          <div className="w-full flex justify-between items-center text-zinc-500">
            <Film className="w-3.5 h-3.5 text-red-500" />
            <span className="text-[7px] font-mono tracking-widest text-zinc-400">SPECTRA</span>
          </div>
          <div className="my-auto py-1">
            <Film className="w-5 h-5 text-zinc-400 mx-auto mb-1 opacity-70" />
            <span className="text-[10px] font-bold text-white leading-tight line-clamp-2 px-0.5">{title}</span>
          </div>
          <span className="text-[7px] font-mono tracking-widest text-zinc-500 uppercase">4K ULTRA</span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

      <div className="absolute top-2 inset-x-2 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1 h-5 px-1.5 rounded-md bg-black/80 backdrop-blur-md border border-white/15 text-[9px] font-bold text-white shadow-md leading-none">
          <Star className="w-2.5 h-2.5 fill-white text-white shrink-0" />
          <span>{typeof rating === "number" ? rating.toFixed(1) : rating}</span>
        </div>
        <div className="flex items-center h-5 px-1.5 rounded-md bg-red-600/35 backdrop-blur-md border border-red-500/40 text-[8px] font-black uppercase tracking-wider text-red-100 shadow-[0_0_8px_rgba(239,68,68,0.4)] leading-none">
          <span>{langBadge}</span>
        </div>
      </div>
    </div>
  );

  if (id) {
    return (
      <Link href={"/details/" + id + "?type=" + mediaType} onClick={() => soundFx.playCinematicPop()} className="block select-none">
        {cardContent}
        <h4 className="text-[11px] font-bold text-white truncate mt-1.5 group-hover:text-red-300 transition-colors">{title}</h4>
      </Link>
    );
  }

  return (
    <div className="select-none">
      {cardContent}
      <h4 className="text-[11px] font-bold text-white truncate mt-1.5">{title}</h4>
    </div>
  );
}
