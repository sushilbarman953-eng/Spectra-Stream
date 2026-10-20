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
  const [hasError, setHasError] = useState(false);

  // If completely missing or failed, show styled cinematic placeholder with title
  if (!src || hasError) {
    return (
      <div className="w-full h-full min-h-[160px] flex flex-col items-center justify-center p-2 text-center bg-zinc-900/90 border border-white/10 select-none">
        <Film className="w-6 h-6 text-zinc-600 mb-1.5" />
        <span className="text-[10px] font-bold text-zinc-300 line-clamp-2 px-1">
          {alt || "Media"}
        </span>
      </div>
    );
  }

  let finalUrl = src.trim();

  // If it's a relative TMDB path, make it full
  if (finalUrl.startsWith("/")) {
    finalUrl = `https://image.tmdb.org/t/p/w342${finalUrl}`;
  }

  return (
    <img
      {...props}
      src={finalUrl}
      alt={alt || "Poster"}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => setHasError(true)}
      className={`w-full h-full object-cover block select-none ${className || ""}`}
    />
  );
};
