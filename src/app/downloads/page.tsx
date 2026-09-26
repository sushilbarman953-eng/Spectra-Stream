"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Download,
  Play,
  Trash2,
  HardDrive,
  CheckCircle2,
  Loader2,
  Film,
  Sparkles,
} from "lucide-react";
import { downloadManager, DownloadItem } from "@/lib/downloadManager";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { IMAGE_BASE } from "@/lib/tmdb";

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);

  useEffect(() => {
    const load = () => setDownloads(downloadManager.getAll());
    load();
    window.addEventListener("spectra_downloads_updated", load);
    return () => window.removeEventListener("spectra_downloads_updated", load);
  }, []);

  const totalStorageMb = downloads.reduce((acc, item) => acc + (item.fileSizeMb || 450), 0);
  const totalStorageGb = (totalStorageMb / 1024).toFixed(2);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 pb-28 space-y-6">
      {/* Title & Storage Gauge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/10">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-white" />
            Downloads & Offline
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Watch your saved movies and episodes without internet
          </p>
        </div>

        {/* Storage Pill */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs text-zinc-300">
          <HardDrive className="w-4 h-4 text-white" />
          <span>
            <strong className="text-white">{totalStorageGb} GB</strong> used on device
          </span>
        </div>
      </div>

      {/* Downloads List */}
      {downloads.length > 0 ? (
        <div className="space-y-3">
          {downloads.map((item) => {
            const isDone = item.status === "completed";
            const poster = item.posterPath ? `${IMAGE_BASE}/w185${item.posterPath}` : null;

            return (
              <GlassCard
                key={item.id}
                className="p-3 sm:p-4 rounded-2xl border border-white/10 bg-[#0c0c10]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Poster Thumbnail */}
                  <div className="relative w-14 h-20 sm:w-16 sm:h-24 rounded-xl overflow-hidden bg-zinc-950 flex-none border border-white/10">
                    {poster ? (
                      <Image src={poster} alt={item.title} fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-zinc-600">
                        <Film className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-white/10 text-zinc-300">
                        {item.type === "tv" ? `S${item.season} : E${item.episode}` : "Movie"}
                      </span>
                      {isDone ? (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          Ready Offline
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] text-zinc-300 font-semibold">
                          <Loader2 className="w-3 h-3 animate-spin text-white" />
                          Downloading {item.progress}%
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-white truncate">{item.title}</h3>
                    <p className="text-[11px] text-zinc-400">{item.fileSizeMb || 450} MB</p>

                    {/* Progress Bar for In-Progress Downloads */}
                    {!isDone && (
                      <div className="w-36 sm:w-48 h-1 bg-white/10 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-white transition-all duration-300 shadow-glow"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {isDone && (
                    <Link
                      href={`/watch/${item.tmdbId}?type=${item.type}&season=${item.season || 1}&episode=${item.episode || 1}`}
                    >
                      <GlassButton variant="primary" className="text-xs py-1.5 px-3.5 shadow-glow">
                        <Play className="w-3 h-3 fill-black" />
                        Play
                      </GlassButton>
                    </Link>
                  )}

                  <button
                    onClick={() => downloadManager.deleteDownload(item.id)}
                    className="p-2 rounded-xl border border-white/10 text-zinc-400 hover:text-red-400 hover:bg-white/5 transition"
                    title="Delete download"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Download className="w-7 h-7 text-zinc-400" />
          </div>
          <h3 className="text-base font-bold text-white">No Downloads Yet</h3>
          <p className="text-xs text-zinc-400 max-w-sm">
            Save movies, anime, or episodes to watch offline anytime. Tap the download icon on any video.
          </p>
          <Link href="/">
            <GlassButton variant="secondary" className="text-xs py-1.5 px-4 mt-2">
              <Sparkles className="w-3.5 h-3.5" />
              Explore Catalog
            </GlassButton>
          </Link>
        </div>
      )}
    </div>
  );
}
