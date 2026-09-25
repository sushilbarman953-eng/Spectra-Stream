"use client";

import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Server } from "lucide-react";

interface PlayerProps {
  id: string;
  type: "movie" | "tv";
  season?: number;
  episode?: number;
  m3u8Url?: string;
}

export const Player = ({ id, type, season = 1, episode = 1, m3u8Url }: PlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedServer, setSelectedServer] = useState<"m3u8" | "vidsrc" | "autoembed" | "superembed">(
    m3u8Url ? "m3u8" : "vidsrc"
  );

  // Direct HLS .m3u8 player handler
  useEffect(() => {
    if (selectedServer !== "m3u8" || !m3u8Url || !videoRef.current) return;

    let hls: Hls | null = null;
    const video = videoRef.current;

    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true });
      hls.loadSource(m3u8Url);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = m3u8Url;
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [selectedServer, m3u8Url]);

  // Working video providers
  const getStreamUrl = (server: "vidsrc" | "autoembed" | "superembed") => {
    if (type === "movie") {
      switch (server) {
        case "vidsrc":
          return `https://vidsrc.xyz/embed/movie/${id}`;
        case "autoembed":
          return `https://player.autoembed.cc/embed/movie/${id}`;
        case "superembed":
          return `https://multiembed.mov/?video_id=${id}&tmdb=1`;
      }
    } else {
      switch (server) {
        case "vidsrc":
          return `https://vidsrc.xyz/embed/tv/${id}/${season}/${episode}`;
        case "autoembed":
          return `https://player.autoembed.cc/embed/tv/${id}/${season}/${episode}`;
        case "superembed":
          return `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${season}&e=${episode}`;
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Video Viewport Container */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden glass-panel border-white/15 bg-black shadow-2xl">
        {selectedServer === "m3u8" && m3u8Url ? (
          <video
            ref={videoRef}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />
        ) : (
          <iframe
            src={getStreamUrl(selectedServer as "vidsrc" | "autoembed" | "superembed")}
            title="Video Player"
            className="w-full h-full border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          />
        )}
      </div>

      {/* Server Switcher Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl glass-panel border-white/10">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Server className="w-4 h-4 text-zinc-300" />
          <span>Select Stream Server:</span>
        </div>

        <div className="flex items-center gap-2">
          {m3u8Url && (
            <button
              onClick={() => setSelectedServer("m3u8")}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${
                selectedServer === "m3u8"
                  ? "bg-white text-black shadow-glow font-bold"
                  : "bg-white/5 text-zinc-400 hover:text-white"
              }`}
            >
              Direct HLS
            </button>
          )}

          <button
            onClick={() => setSelectedServer("vidsrc")}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${
              selectedServer === "vidsrc"
                ? "bg-white text-black shadow-glow font-bold"
                : "bg-white/5 text-zinc-400 hover:text-white"
            }`}
          >
            Server 1 (VidSrc)
          </button>

          <button
            onClick={() => setSelectedServer("autoembed")}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${
              selectedServer === "autoembed"
                ? "bg-white text-black shadow-glow font-bold"
                : "bg-white/5 text-zinc-400 hover:text-white"
            }`}
          >
            Server 2 (AutoEmbed)
          </button>

          <button
            onClick={() => setSelectedServer("superembed")}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${
              selectedServer === "superembed"
                ? "bg-white text-black shadow-glow font-bold"
                : "bg-white/5 text-zinc-400 hover:text-white"
            }`}
          >
            Server 3 (Multi)
          </button>
        </div>
      </div>
    </div>
  );
};
