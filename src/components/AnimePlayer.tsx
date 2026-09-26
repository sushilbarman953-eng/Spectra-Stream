"use client";

import React, { useState, useEffect } from "react";
import { Play, RotateCw, Server, FastForward } from "lucide-react";
import { GlassVideoPlayer } from "@/components/GlassVideoPlayer";
import { GlassButton } from "@/components/ui/GlassButton";

interface AnimePlayerProps {
  tmdbId: string;
  animeTitle: string;
  season?: number;
  episode: number;
  totalEpisodes?: number;
  poster?: string;
  onNextEpisode?: () => void;
}

export const AnimePlayer = ({
  tmdbId,
  animeTitle,
  season = 1,
  episode,
  totalEpisodes,
  poster,
  onNextEpisode,
}: AnimePlayerProps) => {
  const [audioMode, setAudioMode] = useState<"sub" | "dub">("sub");
  const [currentServer, setCurrentServer] = useState(0);
  const [showNextOverlay, setShowNextOverlay] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [embedFallback, setEmbedFallback] = useState(false);

  // Multi-server pool
  const SERVERS = [
    {
      id: "vidlink",
      name: "VidLink (Fast)",
      getStream: () => `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}?subOrDub=${audioMode}`,
    },
    {
      id: "vidsrc",
      name: "VidSrc",
      getStream: () => `https://vidsrc.in/embed/tv/${tmdbId}/${season}/${episode}`,
    },
    {
      id: "2embed",
      name: "2Embed",
      getStream: () => `https://www.2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}`,
    },
    {
      id: "autoembed",
      name: "AutoEmbed",
      getStream: () => `https://player.autoembed.cc/embed/tv/${tmdbId}/${season}/${episode}`,
    },
  ];

  const activeServer = SERVERS[currentServer];

  // Auto-next countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showNextOverlay && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (showNextOverlay && countdown === 0) {
      setShowNextOverlay(false);
      setCountdown(10);
      onNextEpisode?.();
    }
    return () => clearTimeout(timer);
  }, [showNextOverlay, countdown, onNextEpisode]);

  const handleVideoEnded = () => {
    if (onNextEpisode) {
      setShowNextOverlay(true);
      setCountdown(10);
    }
  };

  return (
    <div className="w-full flex flex-col gap-3 select-none">
      {/* Primary Video Container */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden glass-panel border border-white/15 bg-black shadow-2xl">
        {!embedFallback ? (
          <GlassVideoPlayer
            id={tmdbId}
            type="tv"
            season={season}
            episode={episode}
            src={activeServer.getStream()}
            poster={poster}
            isLive={false}
            onEnded={handleVideoEnded}
          />
        ) : (
          <iframe
            key={`${activeServer.id}-${season}-${episode}-${audioMode}`}
            src={activeServer.getStream()}
            title={`Season ${season} Episode ${episode}`}
            className="w-full h-full border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        )}

        {/* Next Episode Countdown Overlay */}
        {showNextOverlay && (
          <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center gap-3 animate-in fade-in duration-300">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
              Up Next
            </span>
            <h4 className="text-lg font-bold text-white">
              Episode {episode + 1}
            </h4>
            <p className="text-xs text-zinc-400">
              Playing automatically in{" "}
              <span className="text-white font-bold text-sm">{countdown}s</span>
            </p>

            <div className="flex items-center gap-2.5 pt-2">
              <GlassButton
                variant="primary"
                onClick={() => {
                  setShowNextOverlay(false);
                  onNextEpisode?.();
                }}
                className="text-xs py-1.5 px-4"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                Play Now
              </GlassButton>
              <button
                onClick={() => setShowNextOverlay(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-zinc-400 hover:text-white border border-white/10 hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Unified Bottom Console: Sub/Dub Switcher + Server Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl glass-panel border border-white/10">
        <div className="flex items-center gap-2">
          {/* Sub / Dub Mode Switcher */}
          <div className="flex items-center p-0.5 rounded-xl bg-white/5 border border-white/15">
            <button
              onClick={() => setAudioMode("sub")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                audioMode === "sub"
                  ? "bg-white text-black shadow-glow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              SUB
            </button>
            <button
              onClick={() => setAudioMode("dub")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                audioMode === "dub"
                  ? "bg-white text-black shadow-glow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              DUB
            </button>
          </div>

          <span className="text-xs text-zinc-300 font-semibold px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
            S{season} : Ep {episode} {totalEpisodes ? `/ ${totalEpisodes}` : ""}
          </span>
        </div>

        {/* Server & Engine Toggle */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setEmbedFallback(!embedFallback)}
            className={`px-2.5 py-1 text-xs rounded-lg font-semibold border transition ${
              !embedFallback
                ? "bg-white text-black border-white shadow-glow"
                : "bg-white/5 text-zinc-400 border-white/15"
            }`}
          >
            Frosted Glass
          </button>

          {SERVERS.map((server, idx) => (
            <button
              key={server.id}
              onClick={() => setCurrentServer(idx)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                currentServer === idx
                  ? "bg-white/20 text-white font-bold border border-white/30"
                  : "bg-white/5 text-zinc-400 hover:text-white"
              }`}
            >
              {server.name.split(" ")[0]}
            </button>
          ))}

          <button
            onClick={() => setCurrentServer((prev) => (prev + 1) % SERVERS.length)}
            title="Next Server"
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
