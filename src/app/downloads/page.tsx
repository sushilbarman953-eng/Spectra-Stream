"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Download,
  Trash2,
  Play,
  HardDrive,
  Film,
  Sparkles,
  WifiOff,
  ArrowLeft,
} from "lucide-react";
import { downloadManager, OfflineMediaItem } from "@/lib/downloadManager";
import { IMAGE_BASE } from "@/lib/tmdb";
import { GlassCard } from "@/components/ui/GlassCard";

export default function DownloadsPage() {
  const [items, setItems] = useState<OfflineMediaItem[]>([]);
  const [storage, setStorage] = useState<{ used: number; quota: number }>({ used: 0, quota: 0 });

  useEffect(() => {
    const load = async () => {
      setItems(downloadManager.getAll());
      const est = await downloadManager.getStorageEstimate();
      setStorage(est);
    };
    load();
    window.addEventListener("spectra_downloads_updated", load);
    return () => window.removeEventListener("spectra_downloads_updated", load);
  }, []);

  const formatSize = (bytes: number) => {
    if (!bytes) return "0 MB";
    const mb = bytes / (1024 * 1024);
    if (mb > 1024) return `${(mb / 1024).toFixed(2)} GB`;
    return `${mb.toFixed(1)} MB`;
  };

  const usedPercentage =
    storage.quota > 0 ? Math.min(100, Math.round((storage.used / storage.quota) * 100)) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 pb-28 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-white" />
            Offline Downloads
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Instant local playback without Wi-Fi or cellular connectivity
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-zinc-300 text-xs font-bold">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Offline Ready</span>
        </div>
      </div>

      {/* Storage Visualizer Meter */}
      <GlassCard className="p-4 rounded-3xl border border-white/15 bg-[#0e0e14]/80 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2 text-white">
            <HardDrive className="w-4 h-4 text-zinc-300" />
            <span>Device Storage</span>
          </div>
          <span className="text-zinc-400 font-mono">
            {formatSize(storage.used)} used of {formatSize(storage.quota)}
          </span>
        </div>

        <div className="w-full h-2 bg-white/15 rounded-full overflow-hidden">
          <div
            className="h-full bg-white shadow-glow transition-all duration-500"
            style={{ width: `${Math.max(2, usedPercentage)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-zinc-400">
          <span>{items.length} titles saved locally</span>
          <span>{usedPercentage}% capacity</span>
        </div>
      </GlassCard>

      {/* Media List */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-zinc-500">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">No Offline Titles Yet</h4>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                Open any movie or anime and tap &ldquo;Download&rdquo; to save full episodes for offline viewing.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {items.map((item) => {
              const poster = item.posterPath ? `${IMAGE_BASE}/w342${item.posterPath}` : null;
              const playUrl =
                item.type === "tv"
                  ? `/watch/${item.tmdbId}?type=tv&season=${item.season || 1}&episode=${item.episode || 1}&offline=${item.id}`
                  : `/watch/${item.tmdbId}?type=movie&offline=${item.id}`;

              return (
                <div key={item.id} className="group relative">
                  <GlassCard
                    hoverEffect
                    className="p-3 rounded-2xl flex items-center gap-3 border border-white/10 bg-[#0c0c12]/90 hover:border-white/20 transition"
                  >
                    <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-zinc-950 border border-white/15 flex-none">
                      {poster ? (
                        <Image src={poster} alt={item.title} fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-zinc-600 text-xs">
                          <Film className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                      <p className="text-[10px] text-zinc-400">
                        {item.type === "tv" ? `S${item.season} : Ep ${item.episode}` : "Feature Film"} • {formatSize(item.sizeBytes)}
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        <Link
                          href={playUrl}
                          className="flex items-center gap-1 px-3 py-1 rounded-xl bg-white text-black font-extrabold text-[10px] shadow-glow active:scale-95 transition"
                        >
                          <Play className="w-3 h-3 fill-black text-black" />
                          <span>Play Offline</span>
                        </Link>

                        <button
                          onClick={() => downloadManager.removeMedia(item.id)}
                          className="p-1 rounded-lg text-zinc-500 hover:text-red-400 transition"
                          title="Delete from device"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
