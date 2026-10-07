"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";

interface SafeImageProps extends Omit<ImageProps, "onError" | "onLoad"> {
  fallbackSrc?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  // High-contrast clean dark cinema fallback
  const fallbackArtwork = "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg";
  const imageSrc = !src || failed ? fallbackArtwork : src;

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0d0d14]">
      {/* Dynamic Pulse Shimmer Skeleton */}
      {loading && (
        <div className="absolute inset-0 z-10 overflow-hidden bg-zinc-900/90">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </div>
      )}

      <Image
        {...props}
        src={imageSrc}
        alt={alt || "Artwork"}
        unoptimized
        onLoad={() => setLoading(false)}
        onError={() => {
          setFailed(true);
          setLoading(false);
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loading ? "opacity-0" : "opacity-100"
        } ${className || ""}`}
      />
    </div>
  );
};
