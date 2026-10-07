"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { soundFx } from "@/lib/soundFx";

export interface StudioItem {
  id: string;
  name: string;
  logo: React.ReactNode;
  bgUrl: string;
  filterQuery: string;
}

const STUDIOS: StudioItem[] = [
  {
    id: "marvel",
    name: "Marvel Studios",
    bgUrl: "https://image.tmdb.org/t/p/w780/yF1xTrentcIS5o99ZpHrP3Xeo2.jpg",
    filterQuery: "marvel",
    logo: (
      <div className="bg-[#E23636] px-2.5 py-0.5 rounded tracking-tighter text-white font-black text-xs sm:text-sm font-sans shadow-md border border-red-400/40">
        MARVEL
      </div>
    ),
  },
  {
    id: "dc",
    name: "DC Universe",
    bgUrl: "https://image.tmdb.org/t/p/w780/o72R2eGuhYfV1a8x9x7F0L9W0X.jpg",
    filterQuery: "dc",
    logo: (
      <div className="w-8 h-8 rounded-full border-2 border-white/90 bg-blue-700/80 backdrop-blur-md flex items-center justify-center font-black text-xs text-white shadow-[0_0_12px_rgba(59,130,246,0.6)]">
        DC
      </div>
    ),
  },
  {
    id: "sony",
    name: "Sony Pictures",
    bgUrl: "https://image.tmdb.org/t/p/w780/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
    filterQuery: "sony",
    logo: (
      <div className="px-3 py-1 rounded bg-black/75 border border-white/30 text-white font-black tracking-widest text-[11px] font-mono shadow-md">
        SONY
      </div>
    ),
  },
  {
    id: "warner",
    name: "Warner Bros.",
    bgUrl: "https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    filterQuery: "warner",
    logo: (
      <div className="w-8 h-8 rounded-full border-2 border-amber-300/80 bg-blue-900/80 backdrop-blur-md flex items-center justify-center font-black text-[10px] text-amber-200 shadow-md">
        WB
      </div>
    ),
  },
];

export const StudioFranchiseHubs: React.FC = () => {
  return (
    <div className="space-y-3 select-none">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-red-500" />
        <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
          Studio Franchises & Brand Hubs
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STUDIOS.map((studio) => (
          <Link
            key={studio.id}
            href={`/explore?studio=${studio.filterQuery}`}
            onClick={() => soundFx.playCinematicSwell()}
            className="group relative aspect-[16/9] rounded-2xl overflow-hidden border border-white/15 bg-zinc-950 shadow-xl flex flex-col items-center justify-center p-3 hover:border-white/40 active:scale-[0.98] transition-all"
          >
            {/* Background Backdrop */}
            <Image
              src={studio.bgUrl}
              alt={studio.name}
              fill
              unoptimized
              className="object-cover opacity-25 group-hover:opacity-45 group-hover:scale-105 transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            {/* Centered Brand Vector Logo */}
            <div className="relative z-10 flex flex-col items-center gap-1.5 transform group-hover:scale-110 transition-transform duration-300">
              {studio.logo}
              <span className="text-[10px] font-bold text-zinc-300 tracking-wider uppercase drop-shadow">
                {studio.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
