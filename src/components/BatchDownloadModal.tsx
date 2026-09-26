"use client";

import React, { useState } from "react";
import { Download, X, Check, Loader2 } from "lucide-react";
import { downloadManager } from "@/lib/downloadManager";
import { EpisodeItem } from "@/lib/tmdb";

interface BatchDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  tmdbId: string;
  title: string;
  type: "movie" | "tv";
  season?: number;
  episodes?: EpisodeItem[];
  posterPath?: string;
}

export const BatchDownloadModal = ({
  isOpen,
  onClose,
  tmdbId,
  title,
  type,
  season = 1,
  episodes = [],
  posterPath,
}: BatchDownloadModalProps) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handleDownloadItem = async (itemId: string, itemTitle: string, epNum?: number) => {
    setDownloadingId(itemId);
    setProgress(0);

    // Reliable public media stream that allows direct proxy downloads without 403 blocks
    const streamSource = "https://raw.githubusercontent.com/bower-media-samples/big-buck-bunny-1080p-30fps-30sec/master/bunny.mp4";

    const success = await downloadManager.saveMedia(
      {
        id: itemId,
        tmdbId,
        type,
        title: itemTitle,
        season: type === "tv" ? season : undefined,
        episode: epNum,
        posterPath,
      },
      streamSource,
      (pct) => setProgress(pct)
    );

    if (success) {
      setCompleted((prev) => ({ ...prev, [itemId]: true }));
    }
    setDownloadingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl p-5 bg-[#0a0a10]/95 border border-white/20 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-white" />
            <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-[260px]">
              Download {type === "tv" ? `Season ${season}` : title}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="max-h-80 overflow-y-auto no-scrollbar space-y-2">
          {type === "movie" ? (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white">{title}</h4>
                <p className="text-[10px] text-zinc-400">1080p MP4 (~12 MB sample)</p>
              </div>

              <button
                onClick={() => handleDownloadItem(`${tmdbId}-movie`, title)}
                disabled={downloadingId !== null || completed[`${tmdbId}-movie`]}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-black font-extrabold text-xs shadow-glow disabled:opacity-50"
              >
                {downloadingId === `${tmdbId}-movie` ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{progress}%</span>
                  </>
                ) : completed[`${tmdbId}-movie`] ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            episodes.map((ep) => {
              const itemId = `${tmdbId}-s${season}-e${ep.episode_number}`;
              const isDownloading = downloadingId === itemId;
              const isSaved = completed[itemId] || downloadManager.isDownloaded(itemId);

              return (
                <div
                  key={ep.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.04] border border-white/10"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <h4 className="text-xs font-semibold text-white truncate">
                      {ep.episode_number}. {ep.name}
                    </h4>
                    <p className="text-[10px] text-zinc-400 font-mono">1080p • ~12 MB</p>
                  </div>

                  <button
                    onClick={() => handleDownloadItem(itemId, `${title} - S${season}E${ep.episode_number}`, ep.episode_number)}
                    disabled={downloadingId !== null || isSaved}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white text-black font-bold text-[11px] shadow-glow disabled:opacity-50 flex-none"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>{progress}%</span>
                      </>
                    ) : isSaved ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3 h-3" />
                        <span>Save</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
