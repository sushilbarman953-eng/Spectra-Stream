"use client";

import React, { useState } from "react";
import { Film } from "lucide-react";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fill?: boolean;
  fallbackSrc?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className,
  fill,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center p-2.5 text-center bg-gradient-to-b from-[#181824] to-[#0c0c14] border border-white/10 select-none">
        <Film className="w-5 h-5 text-zinc-500 mb-1" />
        <span className="text-[10px] font-bold text-zinc-300 line-clamp-2 px-1">
          {alt || "Media Poster"}
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0d0d14]">
      {/* Skeleton Shimmer */}
      {loading && (
        <div className="absolute inset-0 z-10 overflow-hidden bg-zinc-900/90">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </div>
      )}

      {/* Native img tag with fill omitted from DOM attributes */}
      <img
        {...props}
        src={src}
        alt={alt || "Artwork"}
        loading="lazy"
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
