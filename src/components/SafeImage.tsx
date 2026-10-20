"use client";

import React, { useState, useEffect } from "react";
import { Film, Sparkles } from "lucide-react";

export const toUniversalPosterUrl = (raw?: string | null): string | null => {
  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed === "null" || trimmed === "undefined") return null;

  // Unsplash, MyAnimeList, and Wikimedia can load directly
  if (
    trimmed.includes("myanimelist.net") ||
    trimmed.includes("images.unsplash.com") ||
    trimmed.includes("upload.wikimedia.org")
  ) {
    return trimmed;
  }

  // TMDB paths: whether relative or full URL, route via wsrv.nl edge mirror
  let tmdbUrl = trimmed;
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    const clean = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    tmdbUrl = `https://image.tmdb.org/t/p/w342${clean}`;
  } else if (trimmed.includes("image.tmdb.org/t/p/")) {
    tmdbUrl = trimmed.replace(/\/p\/(original|w1280|w500)\//, "/p/w342/");
  }

  return `https://wsrv.nl/?url=${encodeURIComponent(tmdbUrl)}&w=342&output=webp&q=80`;
};

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fill?: boolean;
  priority?: boolean;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className,
  fill,
  priority,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const resolvedSrc = toUniversalPosterUrl(src);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  // If there is no image or it failed to load, generate a clean cinematic card
  if (!resolvedSrc || hasError) {
    const isAnime = alt?.toLowerCase().includes("anime");
    return (
      <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-between p-2.5 text-center bg-gradient-to-br from-[#1a1c2e] via-[#10111a] to-[#07080c] border border-white/10 select-none">
        <div className="w-full flex justify-between items-center text-zinc-500">
          {isAnime ? (
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          ) : (
            <Film className="w-3.5 h-3.5 text-red-500" />
          )}
          <span className="text-[7px] font-mono tracking-widest text-zinc-400 uppercase">
            {isAnime ? "ANIME" : "SPECTRA"}
          </span>
        </div>

        <div className="my-auto py-1 px-0.5">
          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-1.5 shadow-inner">
            {isAnime ? (
              <Sparkles className="w-4 h-4 text-purple-300" />
            ) : (
              <Film className="w-4 h-4 text-zinc-400" />
            )}
          </div>
          <h4 className="text-[10px] font-bold text-white leading-tight line-clamp-2 drop-shadow">
            {alt || "Media Title"}
          </h4>
        </div>

        <div className="w-full pt-1 border-t border-white/5 flex items-center justify-between text-[7px] font-mono text-zinc-500">
          <span>HD</span>
          <span>MULTI</span>
        </div>
      </div>
    );
  }

  return (
    <img
      {...props}
      src={resolvedSrc}
      alt={alt || "Poster"}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      crossOrigin="anonymous"
      onError={() => setHasError(true)}
      className={`absolute inset-0 w-full h-full object-cover block select-none ${className || ""}`}
    />
  );
};
