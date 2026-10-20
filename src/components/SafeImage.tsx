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

  if (!src || hasError) {
    return (
      <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-2 text-center bg-zinc-900 border border-white/10 select-none">
        <Film className="w-6 h-6 text-zinc-500 mb-1" />
        <span className="text-[10px] font-bold text-zinc-300 line-clamp-2 px-1">
          {alt || "Spectra Media"}
        </span>
      </div>
    );
  }

  // Ensure path is canonical
  let resolvedUrl = src.trim();
  if (resolvedUrl.startsWith("/")) {
    resolvedUrl = `https://image.tmdb.org/t/p/w342${resolvedUrl}`;
  }

  // Use Statically CDN edge mirror which is fully accessible in India without DNS blocking
  if (resolvedUrl.includes("image.tmdb.org")) {
    resolvedUrl = resolvedUrl.replace("https://image.tmdb.org", "https://cdn.statically.io/img/image.tmdb.org");
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-zinc-950">
      <img
        {...props}
        src={resolvedUrl}
        alt={alt || "Poster"}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover select-none ${className || ""}`}
      />
    </div>
  );
};
