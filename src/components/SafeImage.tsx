"use client";

import React, { useState, useEffect, useRef } from "react";
import { Film } from "lucide-react";

export const getCdnPosterUrl = (rawUrl?: string | null): string | null => {
  if (!rawUrl || typeof rawUrl !== "string") return null;
  const trimmed = rawUrl.trim();
  if (!trimmed || trimmed === "null" || trimmed === "undefined") return null;

  // MAL, Unsplash, or Wikimedia can load directly
  if (
    trimmed.includes("myanimelist.net") ||
    trimmed.includes("images.unsplash.com") ||
    trimmed.includes("upload.wikimedia.org")
  ) {
    return trimmed;
  }

  // Extract relative TMDB hash or URL
  let targetTmdbUrl = trimmed;
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    targetTmdbUrl = `https://image.tmdb.org/t/p/w342${cleanPath}`;
  } else if (trimmed.includes("image.tmdb.org/t/p/")) {
    targetTmdbUrl = trimmed.replace(/\/p\/(original|w1280|w500)\//, "/p/w342/");
  }

  // Route TMDB through the wsrv.nl Cloudflare edge cache (bypasses all Indian ISP DNS blocks)
  return `https://wsrv.nl/?url=${encodeURIComponent(targetTmdbUrl)}&w=342&output=webp&q=80`;
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
  priority = false,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const finalSrc = getCdnPosterUrl(src);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);

    if (imgRef.current && imgRef.current.complete) {
      if (imgRef.current.naturalWidth > 0) {
        setLoaded(true);
      } else {
        setFailed(true);
      }
    }
  }, [finalSrc]);

  if (!finalSrc || failed) {
    return (
      <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-2 text-center bg-[#0d0d14] border border-white/10 select-none">
        <Film className="w-5 h-5 text-zinc-600 mb-1" />
        <span className="text-[10px] font-bold text-zinc-400 line-clamp-2 px-1">
          {alt || "Media"}
        </span>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#0a0a10]">
      {!loaded && (
        <div className="absolute inset-0 z-0 bg-zinc-900 animate-pulse pointer-events-none" />
      )}

      <img
        {...props}
        ref={imgRef}
        src={finalSrc}
        alt={alt || "Media Poster"}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        crossOrigin="anonymous"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setFailed(true);
          setLoaded(true);
        }}
        className={`relative z-10 w-full h-full object-cover select-none transition-opacity duration-150 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${className || ""}`}
      />
    </div>
  );
};
