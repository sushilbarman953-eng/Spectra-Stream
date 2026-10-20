"use client";

import React, { useState } from "react";
import { Film } from "lucide-react";

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
  const [error, setError] = useState(false);

  // If there's an error or no src, render a stylish fallback card directly (no broken img icon possible)
  if (!src || error) {
    return (
      <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-between p-3 text-center bg-gradient-to-b from-[#1a1a2e] to-[#0c0c14] border border-white/10 select-none">
        <div className="w-full flex justify-end">
          <Film className="w-4 h-4 text-white/30" />
        </div>
        <div className="space-y-1">
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-zinc-400">
            <Film className="w-4 h-4 text-red-500" />
          </div>
          <span className="text-[11px] font-black text-white leading-tight line-clamp-2 px-1 block drop-shadow">
            {alt || "SPECTRA"}
          </span>
        </div>
        <span className="text-[8px] font-mono tracking-widest text-zinc-400 uppercase">
          Cinema
        </span>
      </div>
    );
  }

  // Sanitize path: if it's a bare path like "/abc.jpg", convert to TMDB
  let cleanSrc = src.trim();
  if (cleanSrc.startsWith("/")) {
    cleanSrc = `https://image.tmdb.org/t/p/w342${cleanSrc}`;
  }

  return (
    <div className="absolute inset-0 w-full h-full bg-[#0a0a10] overflow-hidden">
      <img
        {...props}
        src={cleanSrc}
        alt={alt || "Media artwork"}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onError={() => setError(true)}
        className={`w-full h-full object-cover select-none transition-opacity duration-200 ${className || ""}`}
      />
    </div>
  );
};
