"use client";

import React from "react";
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
  const isExternal = src && (src.includes("unsplash.com") || src.includes("myanimelist.net"));

  if (isExternal) {
    return (
      <img
        {...props}
        src={src}
        alt={alt || "Media"}
        loading={priority ? "eager" : "lazy"}
        className={`w-full h-full object-cover block ${className || ""}`}
        onError={(e) => {
          (e.target as HTMLElement).style.display = "none";
        }}
      />
    );
  }

  return (
    <div className="w-full h-full min-h-[160px] flex flex-col items-center justify-between p-3 text-center bg-gradient-to-br from-[#1c1d2d] via-[#12131c] to-[#090a0f] border border-white/10 select-none">
      <div className="w-full flex justify-between items-center text-zinc-500">
        <Film className="w-3.5 h-3.5 text-red-500/80" />
        <span className="text-[8px] font-mono tracking-widest uppercase text-zinc-500">SPECTRA</span>
      </div>
      
      <div className="my-auto py-2 px-1">
        <div className="w-9 h-9 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-2 shadow-inner">
          <Film className="w-4 h-4 text-white/70" />
        </div>
        <h4 className="text-xs font-black text-white leading-tight line-clamp-2 drop-shadow">
          {alt || "Cinema Title"}
        </h4>
      </div>

      <div className="w-full pt-1 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-zinc-500">
        <span>4K ULTRA</span>
        <span>MULTI</span>
      </div>
    </div>
  );
};
