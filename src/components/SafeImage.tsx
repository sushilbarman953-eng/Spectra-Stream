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
  priority,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-between p-2 text-center bg-gradient-to-br from-[#1b1d2a] via-[#10121a] to-[#07080c] border border-white/10 select-none">
        <div className="w-full flex justify-between items-center text-zinc-500">
          <Film className="w-3.5 h-3.5 text-red-500" />
          <span className="text-[7px] font-mono tracking-widest text-zinc-400">4K ULTRA</span>
        </div>
        <div className="my-auto py-1">
          <Film className="w-5 h-5 text-zinc-400 mx-auto mb-1 opacity-70" />
          <span className="text-[10px] font-bold text-white leading-tight line-clamp-2 px-1 block">
            {alt || "Cinema"}
          </span>
        </div>
        <span className="text-[7px] font-mono tracking-widest text-zinc-400 uppercase">
          SPECTRA
        </span>
      </div>
    );
  }

  return (
    <img
      {...props}
      src={src}
      alt={alt || "Media Poster"}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => setHasError(true)}
      className={`absolute inset-0 w-full h-full object-cover block select-none ${className || ""}`}
    />
  );
};
