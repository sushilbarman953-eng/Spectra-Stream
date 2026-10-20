"use client";

import React, { useState, useEffect } from "react";
import { Film } from "lucide-react";

// Backup CDN poster mapping for popular titles when TMDB is unavailable
const BACKUP_POSTERS: Record<string, string> = {
  "jawan": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
  "animal": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80",
  "dunki": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80",
  "pathaan": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&q=80",
  "12th fail": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80",
  "rrr": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&q=80",
  "kalki 2898 ad": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80",
  "salaar": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&q=80",
  "leo": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
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
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
    if (!src) {
      setCurrentSrc(null);
      return;
    }

    let url = src.trim();
    if (url.startsWith("/")) {
      url = `https://image.tmdb.org/t/p/w342${url}`;
    }
    setCurrentSrc(url);
  }, [src]);

  const handleError = () => {
    // Check if we have a backup image for this title
    const titleKey = (alt || "").toLowerCase();
    const matchedKey = Object.keys(BACKUP_POSTERS).find((k) => titleKey.includes(k));

    if (matchedKey && currentSrc !== BACKUP_POSTERS[matchedKey]) {
      setCurrentSrc(BACKUP_POSTERS[matchedKey]);
    } else if (currentSrc && currentSrc.includes("image.tmdb.org")) {
      // Try unproxied or proxy fallback
      if (!currentSrc.includes("/api/poster-proxy")) {
        setCurrentSrc(`/api/poster-proxy?path=${encodeURIComponent(currentSrc)}`);
      } else {
        setFailed(true);
      }
    } else {
      setFailed(true);
    }
  };

  if (!currentSrc || failed) {
    return (
      <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-2 text-center bg-zinc-900 border border-white/10 select-none">
        <Film className="w-6 h-6 text-zinc-500 mb-1" />
        <span className="text-[10px] font-bold text-zinc-300 line-clamp-2 px-1">
          {alt || "Movie Poster"}
        </span>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-zinc-950">
      <img
        {...props}
        src={currentSrc}
        alt={alt || "Poster"}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-200 ${className || ""}`}
      />
    </div>
  );
};
