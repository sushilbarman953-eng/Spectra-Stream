"use client";

import React, { useState, useEffect } from "react";
import { Server, RefreshCw, ShieldCheck } from "lucide-react";
import { GlassVideoPlayer } from "@/components/GlassVideoPlayer";

interface PlayerProps {
  id: string;
  type: "movie" | "tv";
  season?: number;
  episode?: number;
  poster?: string;
  backdrop?: string;
  title?: string;
}

export const Player = ({
  id,
  type,
  season = 1,
  episode = 1,
  poster,
  backdrop,
  title = "Now Playing",
}: PlayerProps) => {
  const [activeServer, setActiveServer] = useState<string>("vidlink");
  const [streamSrc, setStreamSrc] = useState<string>("");
  const [loadingSource, setLoadingSource] = useState<boolean>(true);

  const SERVERS = [
    { id: "vidlink", name: "VidLink", badge: "Auto 1080p" },
    { id: "vidsrc", name: "VidSrc", badge: "Ultra Fast" },
    { id: "2embed", name: "2Embed", badge: "Multi-Sub" },
    { id: "autoembed", name: "AutoEmbed", badge: "Direct" },
  ];

  // Fetch direct video stream for the selected server
  useEffect(() => {
    let isMounted = true;
    setLoadingSource(true);

    const resolveStream = async () => {
      try {
        const res = await fetch(
          `/api/stream?id=${id}&type=${type}&season=${season}&episode=${episode}&server=${activeServer}`
        );
        const data = await res.json();
        if (isMounted && data.streamUrl) {
          setStreamSrc(data.streamUrl);
        }
      } catch (err) {
        console.error("Stream resolution error:", err);
      } finally {
        if (isMounted) setLoadingSource(false);
      }
    };

    resolveStream();
    return () => {
      isMounted = false;
    };
  }, [id, type, season, episode, activeServer]);

  return (
    <div className="space-y-3">
      {/* 1. Universal Spectra Frosted Glass Player Shell */}
      <GlassVideoPlayer
        key={`${activeServer}-${id}-${season}-${episode}`}
        src={streamSrc}
        title={title}
        tmdbId={id}
        type={type}
        season={season}
        episode={episode}
        poster={poster}
        backdrop={backdrop}
      />

      {/* 2. Frosted Glass Server Selection Bar */}
      <div className="p-3 rounded-2xl border border-white/10 bg-[#0e0e14]/80 backdrop-blur-xl space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
            <Server className="w-3.5 h-3.5 text-white" />
            <span>Active Server Stream</span>
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
          <span>
            Streaming via {activeServer.toUpperCase()} inside the Spectra native Frosted Glass UI.
          </span>
        </div>
      </div>
    </div>
  );
};
