"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { Film } from "lucide-react";

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

  // If no source is provided or image genuinely failed
  if (!src || failed) {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-b from-[#141420] to-[#0a0a10] border border-white/10 select-none">
        <Film className="w-6 h-6 text-zinc-500 mb-1.5" />
        <span className="text-[10px] font-bold text-zinc-300 line-clamp-2 px-1">
          {alt || "Media Poster"}
        </span>
      </div>
    );
  }

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
        src={src}
        alt={alt || "Media"}
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
