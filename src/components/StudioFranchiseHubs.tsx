"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { soundFx } from "@/lib/soundFx";

export interface StudioItem {
  id: string;
  name: string;
  logoUrl: string;
  bgUrl: string;
  filterQuery: string;
}

const STUDIOS: StudioItem[] = [
  {
    id: "marvel",
    name: "Marvel Studios",
    logoUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&q=80",
    bgUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&q=80",
    filterQuery: "marvel",
  },
  {
    id: "dc",
    name: "DC Universe",
    logoUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&q=80",
    bgUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80",
    filterQuery: "dc",
  },
  {
    id: "sony",
    name: "Sony Pictures",
    logoUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80",
    bgUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&q=80",
    filterQuery: "sony",
  },
  {
    id: "warner",
    name: "Warner Bros.",
    logoUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80",
    bgUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=600&q=80",
    filterQuery: "warner",
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
            className="group relative aspect-[16/9] rounded-2xl overflow-hidden border border-white/15 bg-zinc-950 shadow-xl flex items-center justify-center p-3 hover:border-white/35 active:scale-[0.98] transition-all"
          >
            {/* Background Atmosphere */}
            <Image
              src={studio.bgUrl}
              alt={studio.name}
              fill
              unoptimized
              className="object-cover opacity-35 group-hover:opacity-50 group-hover:scale-105 transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

            {/* Studio Title Tile */}
            <span className="relative z-10 text-xs sm:text-sm font-black text-white tracking-widest uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] text-center px-1">
              {studio.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
