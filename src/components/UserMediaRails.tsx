"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, BookmarkCheck } from "lucide-react";
import { storage, SavedMedia } from "@/lib/storage";
import { GlassCard } from "@/components/ui/GlassCard";

export const UserMediaRails = () => {
  const [progress, setProgress] = useState<SavedMedia[]>([]);
  const [watchlist, setWatchlist] = useState<SavedMedia[]>([]);

  useEffect(() => {
    setProgress(storage.getProgress());
    setWatchlist(storage.getWatchlist());
  }, []);

  return (
    <>
      {/* Continue Watching Section */}
      {progress.length > 0 && (
        <section className="py-1 px-4 md:px-8">
          <div className="flex items-center gap-2 mb-2.5">
            <Play className="w-4 h-4 fill-white text-white" />
            <h2 className="text-base md:text-lg font-semibold tracking-wide text-white/95">
              Continue Watching
            </h2>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-2">
            {progress.map((item) => (
              <Link
                key={item.id}
                href={`/watch/${item.id}?type=${item.type}${item.season ? `&s=${item.season}&e=${item.episode}` : ""}`}
                className="flex-none w-44 sm:w-52"
              >
                <GlassCard hoverEffect className="overflow-hidden border border-white/10">
                  <div className="relative aspect-video w-full bg-zinc-950">
                    {item.poster ? (
                      <Image
                        src={item.poster}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-zinc-600 text-xs">
                        No Preview
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                        <Play className="w-4 h-4 fill-white text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-black/40">
                    <h3 className="text-xs font-medium text-white truncate">{item.title}</h3>
                    <p className="text-[10px] text-zinc-400 mt-0.5">
                      {item.type === "tv"
                        ? `Season ${item.season} • Episode ${item.episode}`
                        : "Resume Movie"}
                    </p>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Watchlist Section */}
      {watchlist.length > 0 && (
        <section className="py-1 px-4 md:px-8">
          <div className="flex items-center gap-2 mb-2.5">
            <BookmarkCheck className="w-4 h-4 text-white" />
            <h2 className="text-base md:text-lg font-semibold tracking-wide text-white/95">
              My Watchlist
            </h2>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-2">
            {watchlist.map((item) => (
              <Link
                key={item.id}
                href={`/details/${item.id}?type=${item.type}`}
                className="flex-none w-32 sm:w-40 md:w-48"
              >
                <GlassCard hoverEffect className="overflow-hidden border border-white/10">
                  <div className="relative aspect-[2/3] w-full bg-zinc-950">
                    {item.poster ? (
                      <Image
                        src={item.poster}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-zinc-600 text-xs">
                        No Poster
                      </div>
                    )}
                  </div>
                  <div className="p-2.5 bg-black/40">
                    <h3 className="text-xs font-medium text-white truncate">{item.title}</h3>
                    <p className="text-[10px] text-zinc-500 mt-0.5 uppercase tracking-wider">
                      {item.type}
                    </p>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
};
