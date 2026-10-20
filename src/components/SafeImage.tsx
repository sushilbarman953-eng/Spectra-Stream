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

  // If the image errors, missing, or blocked, render this rich SVG cinematic poster card directly
  if (!src || hasError) {
    const title = alt || "Spectra Feature";
    return (
      <div className="absolute inset-0 w-full h-full flex flex-col justify-between p-3 select-none overflow-hidden bg-gradient-to-b from-[#1b1d2a] via-[#10121a] to-[#07080c] border border-white/10">
        <div className="flex items-center justify-between opacity-50">
          <Film className="w-3.5 h-3.5 text-red-500" />
          <span className="text-[7px] font-mono tracking-widest text-zinc-400">4K ULTRA</span>
        </div>

        <div className="my-auto text-center py-2">
          <div className="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center mx-auto mb-2 shadow-inner">
            <Film className="w-5 h-5 text-white/80" />
          </div>
          <h4 className="text-[11px] font-black text-white leading-tight uppercase tracking-tight line-clamp-3 px-1 drop-shadow-md">
            {title}
          </h4>
        </div>

        <div className="flex items-center justify-between text-[7px] font-mono border-t border-white/10 pt-1.5 opacity-60">
          <span className="text-zinc-400">SPECTRA</span>
          <span className="text-amber-400 font-bold">CINEMA</span>
        </div>
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
