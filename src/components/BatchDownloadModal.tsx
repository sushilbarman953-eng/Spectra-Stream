"use client";

import React, { useState } from "react";
import { Download, X, Check, Film, Layers, Globe, Subtitles } from "lucide-react";
import { downloadManager } from "@/lib/downloadManager";
import { EpisodeItem } from "@/lib/tmdb";
import { GlassButton } from "@/components/ui/GlassButton";

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
  const [selectedQuality, setSelectedQuality] = useState("1080p");
  const [selectedAudio, setSelectedAudio] = useState("English");
  const [selectedCaption, setSelectedCaption] = useState("English [CC]");
  const [selectedEpisodes, setSelectedEpisodes] = useState<number[]>(
    type === "tv" && episodes.length > 0 ? [episodes[0].episode_number] : [1]
  );

  if (!isOpen) return null;

  const toggleEpisode = (epNum: number) => {
    if (selectedEpisodes.includes(epNum)) {
      setSelectedEpisodes(selectedEpisodes.filter((e) => e !== epNum));
    } else {
      setSelectedEpisodes([...selectedEpisodes, epNum]);
    }
  };

  const selectAllEpisodes = () => {
    if (selectedEpisodes.length === episodes.length) {
      setSelectedEpisodes([]);
    } else {
      setSelectedEpisodes(episodes.map((e) => e.episode_number));
    }
  };

  const handleStartDownload = () => {
    const isTV = type === "tv" && episodes.length > 0;
    const downloadQueue = isTV
      ? selectedEpisodes.map((epNum) => ({
          id: `${tmdbId}-tv-s${season}-e${epNum}`,
          tmdbId,
          title: `${title} - S${season}:E${epNum}`,
          type: "tv" as const,
          season,
          episode: epNum,
          posterPath,
          fileSizeMb: selectedQuality === "1080p" ? 540 : selectedQuality === "720p" ? 320 : 180,
          quality: selectedQuality,
          audioLanguage: selectedAudio,
          captionLanguage: selectedCaption,
          streamUrl: `/watch/${tmdbId}?type=tv&season=${season}&episode=${epNum}`,
        }))
      : [
          {
            id: `${tmdbId}-movie`,
            tmdbId,
            title,
            type: "movie" as const,
            posterPath,
            fileSizeMb: selectedQuality === "1080p" ? 1450 : selectedQuality === "720p" ? 850 : 450,
            quality: selectedQuality,
            audioLanguage: selectedAudio,
            captionLanguage: selectedCaption,
            streamUrl: `/watch/${tmdbId}?type=movie`,
          },
        ];

    downloadManager.startBatchDownload(downloadQueue);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-3xl border border-white/20 p-5 space-y-4 max-h-[88vh] overflow-y-auto no-scrollbar shadow-2xl"
        style={{ background: "rgba(12, 12, 16, 0.95)", backdropFilter: "blur(24px)" }}
      >
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-white" />
              Download Preferences
            </h3>
            <p className="text-xs text-zinc-400 truncate max-w-xs">{title}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quality & Audio Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
              <Film className="w-3 h-3 text-white" /> Quality
            </label>
            <select
              value={selectedQuality}
              onChange={(e) => setSelectedQuality(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl p-2 text-xs text-white focus:outline-none"
            >
              <option value="1080p" className="bg-[#0f0f13]">1080p (FHD)</option>
              <option value="720p" className="bg-[#0f0f13]">720p (HD)</option>
              <option value="480p" className="bg-[#0f0f13]">480p (Data Saver)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
              <Globe className="w-3 h-3 text-white" /> Audio
            </label>
            <select
              value={selectedAudio}
              onChange={(e) => setSelectedAudio(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl p-2 text-xs text-white focus:outline-none"
            >
              <option value="English" className="bg-[#0f0f13]">English (Original)</option>
              <option value="Japanese" className="bg-[#0f0f13]">Japanese (Audio)</option>
              <option value="Hindi" className="bg-[#0f0f13]">Hindi (Dub)</option>
              <option value="Spanish" className="bg-[#0f0f13]">Spanish</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
              <Subtitles className="w-3 h-3 text-white" /> Subtitles
            </label>
            <select
              value={selectedCaption}
              onChange={(e) => setSelectedCaption(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl p-2 text-xs text-white focus:outline-none"
            >
              <option value="English [CC]" className="bg-[#0f0f13]">English [CC]</option>
              <option value="Japanese" className="bg-[#0f0f13]">Japanese</option>
              <option value="None" className="bg-[#0f0f13]">None</option>
            </select>
          </div>
        </div>

        {/* Episode Checkbox Grid for Series & Anime */}
        {type === "tv" && episodes.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Select Episodes ({selectedEpisodes.length}/{episodes.length})
              </span>
              <button
                onClick={selectAllEpisodes}
                className="text-xs text-zinc-400 hover:text-white underline underline-offset-2"
              >
                {selectedEpisodes.length === episodes.length ? "Deselect All" : "Select All"}
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto no-scrollbar p-1">
              {episodes.map((ep) => {
                const isSelected = selectedEpisodes.includes(ep.episode_number);
                return (
                  <button
                    key={ep.id || ep.episode_number}
                    onClick={() => toggleEpisode(ep.episode_number)}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold border transition ${
                      isSelected
                        ? "bg-white text-black border-white shadow-glow"
                        : "bg-white/5 text-zinc-300 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <span>Ep {ep.episode_number}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="pt-2">
          <GlassButton
            variant="primary"
            onClick={handleStartDownload}
            disabled={type === "tv" && selectedEpisodes.length === 0}
            className="w-full text-xs py-2.5 font-bold shadow-glow"
          >
            <Download className="w-4 h-4" />
            <span>Download Now ({type === "tv" ? `${selectedEpisodes.length} Episodes` : "Movie"})</span>
          </GlassButton>
        </div>
      </div>
    </div>
  );
};
