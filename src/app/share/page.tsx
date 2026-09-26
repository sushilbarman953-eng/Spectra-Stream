"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Bookmark,
  Sparkles,
  Download,
  Film,
  Star,
  Check,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { watchlistManager, WatchlistItem } from "@/lib/watchlistManager";
import { IMAGE_BASE } from "@/lib/tmdb";
import { GlassCard } from "@/components/ui/GlassCard";
import { soundFx } from "@/lib/soundFx";

function ShareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [imported, setImported] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const dataParam = searchParams.get("list");
      if (dataParam) {
        // Decode base64 UTF-8
        const decoded = JSON.parse(decodeURIComponent(escape(atob(dataParam))));
        if (Array.isArray(decoded)) {
          setItems(decoded);
        }
      }
    } catch (e) {
      console.error("Failed to parse shared watchlist:", e);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  const handleImportAll = () => {
    soundFx.playCinematicPop();
    items.forEach((item) => {
      if (!watchlistManager.isInList(item.id)) {
        watchlistManager.toggle(item);
      }
    });
    setImported(true);
    setTimeout(() => router.push("/me"), 1200);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] gap-2 text-zinc-400 text-xs">
        <Sparkles className="w-5 h-5 animate-spin text-white" />
        <span>Loading shared watchlist...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 pb-28 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            soundFx.playCinematicWhoosh();
            router.push("/");
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-zinc-300 hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <button
          onClick={handleImportAll}
          disabled={imported || items.length === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black font-extrabold text-xs shadow-glow active:scale-95 disabled:opacity-50 transition"
        >
          {imported ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Imported to My List!</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Import All ({items.length})</span>
            </>
          )}
        </button>
      </div>

      {/* Banner */}
      <GlassCard className="p-4 sm:p-5 rounded-3xl border border-white/15 bg-[#0e0e14]/75 space-y-1">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-white" />
          <h1 className="text-base sm:text-lg font-black text-white">
            Shared Spectra Collection
          </h1>
        </div>
        <p className="text-xs text-zinc-400">
          A curated selection of {items.length} titles shared with you. Tap any title to view details or import the entire collection.
        </p>
      </GlassCard>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="py-20 text-center space-y-2">
          <Bookmark className="w-8 h-8 text-zinc-600 mx-auto" />
          <h4 className="text-sm font-bold text-white">Invalid or empty shared link</h4>
          <p className="text-xs text-zinc-400">This watchlist link contains no media items.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map((item) => {
            const poster = item.posterPath ? `${IMAGE_BASE}/w342${item.posterPath}` : null;

            return (
              <Link key={item.id} href={`/details/${item.id}?type=${item.type}`}>
                <GlassCard
                  hoverEffect
                  className="overflow-hidden border border-white/10 rounded-2xl h-full flex flex-col justify-between bg-[#0b0b10]"
                >
                  <div className="relative aspect-[2/3] w-full bg-zinc-950">
                    {poster ? (
                      <Image
                        src={poster}
                        alt={item.title}
                        fill
                        sizes="180px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-zinc-600">
                        <Film className="w-6 h-6" />
                      </div>
                    )}
                    {item.voteAverage && (
                      <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] text-white font-bold border border-white/15">
                        <Star className="w-2.5 h-2.5 fill-white text-white" />
                        {item.voteAverage.toFixed(1)}
                      </div>
                    )}
                  </div>
                  <div className="p-2.5 bg-black/60">
                    <h4 className="text-xs font-semibold text-white truncate">{item.title}</h4>
                    <span className="text-[9px] text-zinc-400 uppercase font-mono">{item.type}</span>
                  </div>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh] text-zinc-400 text-xs">
          Loading...
        </div>
      }
    >
      <ShareContent />
    </Suspense>
  );
}
