"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";

interface SafeImageProps extends Omit<ImageProps, "onError" | "onLoad"> {
  fallbackSrc?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackSrc = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
  className,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const finalSrc = error ? fallbackSrc : src;

  return (
    <div className="relative w-full h-full overflow-hidden bg-zinc-950">
      {/* SHIMMER SKELETON EFFECT */}
      {loading && (
        <div className="absolute inset-0 z-10 overflow-hidden bg-zinc-900/80">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      )}

      {/* RENDERED IMAGE */}
      <Image
        {...props}
        src={finalSrc}
        alt={alt || "Media artwork"}
        unoptimized
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loading ? "opacity-0" : "opacity-100"
        } ${className || ""}`}
      />
    </div>
  );
};
