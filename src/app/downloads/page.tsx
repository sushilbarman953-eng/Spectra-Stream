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
  ArrowDownCircle,
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

  // Group shows to display "X left to download"
  const groupedSeries: Record<string, DownloadItem[]> = {};
  downloads.forEach((item) => {
    if (item.type === "tv") {
      if (!groupedSeries[item.tmdbId]) groupedSeries[item.tmdbId] = [];
      groupedSeries[item.tmdbId].push(item);
    }
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 pb-28 space-y-6">
      {/* Title & Storage Usage */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/10">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-white" />
            Downloads & Offline Hub
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage your saved media, quality profiles, and queue
          </p>
        </div>

        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs text-zinc-300">
          <HardDrive className="w-4 h-4 text-white" />
          <span>
            <strong className="text-white">{totalStorageGb} GB</strong> device usage
          </span>
        </div>
      </div>

      {/* Series Batch Counters: "X left to download" */}
      {Object.entries(groupedSeries).map(([tmdbId, eps]) => {
        const completedCount = eps.filter((e) => e.status === "completed").length;
        const leftCount = eps.length - completedCount;
        if (leftCount === 0) return null;

        const seriesTitle = eps[0].title.split(" - ")[0];

        return (
          <div
            key={tmdbId}
            className="flex items-center justify-between p-3 rounded-2xl border border-white/20 bg-white/5"
          >
            <div>
              <h4 className="text-xs font-bold text-white">{seriesTitle}</h4>
              <p className="text-[11px] text-zinc-400">
                {completedCount} downloaded • <strong className="text-white">{leftCount} left to download</strong>
              </p>
            </div>

            <button
              onClick={() => downloadManager.resumeRemaining(tmdbId)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-black shadow-glow"
            >
              <ArrowDownCircle className="w-3.5 h-3.5" />
              <span>Download Left ({leftCount})</span>
            </button>
          </div>
        );
      })}

      {/* All Downloaded Media Items */}
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
                        {item.quality} • {item.audioLanguage}
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
                    <p className="text-[11px] text-zinc-400">{item.fileSizeMb} MB</p>

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

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {isDone && (
                    <Link href={item.streamUrl}>
                      <GlassButton variant="primary" className="text-xs py-1.5 px-3.5 shadow-glow">
                        <Play className="w-3 h-3 fill-black" />
                        Play
                      </GlassButton>
                    </Link>
                  )}

                  <button
                    onClick={() => downloadManager.deleteDownload(item.id)}
                    className="p-2 rounded-xl border border-white/10 text-zinc-400 hover:text-red-400 hover:bg-white/5 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Download className="w-7 h-7 text-zinc-400" />
          </div>
          <h3 className="text-base font-bold text-white">No Downloads</h3>
          <p className="text-xs text-zinc-400 max-w-sm">
            Save titles with customized audio and quality to enjoy offline anytime.
          </p>
        </div>
      )}
    </div>
  );
}
