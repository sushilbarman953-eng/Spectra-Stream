"use client";

import React, { useState, useEffect } from "react";
import { Server, RefreshCw, ShieldCheck } from "lucide-react";
import { GlassVideoPlayer } from "@/components/GlassVideoPlayer";

interface AnimePlayerProps {
  tmdbId: string;
  animeTitle: string;
  season?: number;
  episode?: number;
  totalEpisodes?: number;
  poster?: string;
  backdrop?: string;
  onNextEpisode?: () => void;
}

export const AnimePlayer = ({
  tmdbId,
  animeTitle,
  season = 1,
  episode = 1,
  poster,
  backdrop,
  onNextEpisode,
}: AnimePlayerProps) => {
  const [activeServer, setActiveServer] = useState<string>("vidlink");
  const [subOrDub, setSubOrDub] = useState<"sub" | "dub">("sub");
  const [streamSrc, setStreamSrc] = useState<string>("");

  const SERVERS = [
    { id: "vidlink", name: "VidLink", badge: "Multi-Audio" },
    { id: "vidsrc", name: "VidSrc", badge: "HD" },
    { id: "2embed", name: "2Embed", badge: "Fast" },
    { id: "autoembed", name: "AutoEmbed", badge: "Direct" },
  ];

  useEffect(() => {
    let isMounted = true;

    const resolveStream = async () => {
      try {
        const res = await fetch(
          `/api/stream?id=${tmdbId}&type=tv&season=${season}&episode=${episode}&server=${activeServer}&audio=${subOrDub}`
        );
        const data = await res.json();
        if (isMounted && data.streamUrl) {
          setStreamSrc(data.streamUrl);
        }
      } catch (err) {
        console.error("Anime stream resolution error:", err);
      }
    };

    resolveStream();
    return () => {
      isMounted = false;
    };
  }, [tmdbId, season, episode, activeServer, subOrDub]);

  return (
    <div className="space-y-3">
      {/* 1. Universal Spectra Frosted Glass Player Shell */}
      <GlassVideoPlayer
        key={`${activeServer}-${subOrDub}-${tmdbId}-${season}-${episode}`}
        src={streamSrc}
        title={`${animeTitle} • S${season} Ep ${episode} (${subOrDub.toUpperCase()})`}
        tmdbId={tmdbId}
        type="tv"
        season={season}
        episode={episode}
        poster={poster}
        backdrop={backdrop}
        onNextEpisode={onNextEpisode}
      />

      {/* 2. Server & SUB/DUB Bar */}
      <div className="p-3 rounded-2xl border border-white/10 bg-[#0e0e14]/80 backdrop-blur-xl space-y-2">
        <div className="flex items-center justify-between text-xs">
          {/* Sub / Dub Mode */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => setSubOrDub("sub")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                subOrDub === "sub"
                  ? "bg-white text-black shadow-glow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              SUB
            </button>
            <button
              onClick={() => setSubOrDub("dub")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                subOrDub === "dub"
                  ? "bg-white text-black shadow-glow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              DUB
            </button>
          </div>

          <button
            onClick={() => setStreamSrc((prev) => `${prev}?t=${Date.now()}`)}
            className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition px-2 py-0.5 rounded-lg bg-white/5 border border-white/10"
            title="Reload Stream"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reload Stream</span>
          </button>
        </div>

        {/* Server Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {SERVERS.map((server) => {
            const isSelected = server.id === activeServer;

            return (
              <button
                key={server.id}
                onClick={() => setActiveServer(server.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                  isSelected
                    ? "bg-white text-black border-white shadow-glow font-bold"
                    : "bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Server className="w-3 h-3" />
                <span>{server.name}</span>
                <span
                  className={`text-[9px] px-1 py-0.2 rounded ${
                    isSelected ? "bg-black/20 text-black font-extrabold" : "bg-white/10 text-zinc-400"
                  }`}
                >
                  {server.badge}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 pt-0.5">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Frosted Glass Engine active. Servers feed raw streams directly.</span>
        </div>
      </div>
    </div>
  );
};
