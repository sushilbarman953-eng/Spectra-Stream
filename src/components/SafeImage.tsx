"use client";

import React, { useState, useRef, useEffect } from "react";
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
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Check if image is already cached/complete on initial mount
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      if (imgRef.current.naturalWidth > 0) {
        setLoaded(true);
      } else {
        setFailed(true);
      }
    }
  }, [src]);

  if (!src || failed) {
    return (
      <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-2.5 text-center bg-gradient-to-b from-[#181824] to-[#0c0c14] border border-white/10 select-none">
        <Film className="w-5 h-5 text-zinc-500 mb-1" />
        <span className="text-[10px] font-bold text-zinc-300 line-clamp-2 px-1">
          {alt || "Media"}
        </span>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#0d0d14]">
      {/* Dynamic Pulse Shimmer Skeleton: unmounted as soon as loaded is true */}
      {!loaded && (
        <div className="absolute inset-0 z-0 overflow-hidden bg-zinc-900 pointer-events-none">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </div>
      )}

      {/* Primary Image: elevated z-index ensures it sits above the shimmer canvas */}
      <img
        {...props}
        ref={imgRef}
        src={src}
        alt={alt || "Media artwork"}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setFailed(true);
          setLoaded(true);
        }}
        className={`relative z-10 w-full h-full object-cover select-none transition-opacity duration-200 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${className || ""}`}
      />
    </div>
  );
};
