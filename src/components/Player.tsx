"use client";

import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Server, AlertCircle } from "lucide-react";

interface PlayerProps {
  id: string;
  type: "movie" | "tv";
  season?: number;
  episode?: number;
  m3u8Url?: string;
}

export const Player = ({ id, type, season = 1, episode = 1, m3u8Url }: PlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedServer, setSelectedServer] = useState<"m3u8" | "server1" | "server2">(
    m3u8Url ? "m3u8" : "server1"
  );

  // HLS stream listener for direct .m3u8 links
  useEffect(() => {
    if (selectedServer !== "m3u8" || !m3u8Url || !videoRef.current) return;

    let hls: Hls | null = null;
    const video = videoRef.current;

    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true });
      hls.loadSource(m3u8Url);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native Safari support for HLS
      video.src = m3u8Url;
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [selectedServer, m3u8Url]);

  // Video embed endpoints
  const serverUrls = {
    server1:
      type === "movie"
        ? `https://vidsrc.to/embed/movie/${id}`
        : `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`,
    server2:
      type === "movie"
        ? `https://multiembed.mov/?video_id=${id}&tmdb=1`
        : `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${season}&e=${episode}`,
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
            src={serverUrls[selectedServer as "server1" | "server2"]}
            title="Video Player"
            className="w-full h-full border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        )}
      </div>

      {/* Floating Server Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl glass-panel border-white/10">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Server className="w-4 h-4 text-zinc-300" />
          <span>Stream Sources:</span>
        </div>

        <div className="flex items-center gap-2">
          {m3u8Url && (
            <button
              onClick={() => setSelectedServer("m3u8")}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
                selectedServer === "m3u8"
                  ? "bg-white text-black shadow-glow"
                  : "bg-white/5 text-zinc-400 hover:text-white"
              }`}
            >
              Direct HLS (.m3u8)
            </button>
          )}

          <button
            onClick={() => setSelectedServer("server1")}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
              selectedServer === "server1"
                ? "bg-white text-black shadow-glow"
                : "bg-white/5 text-zinc-400 hover:text-white"
            }`}
          >
            Server 1 (Fast)
          </button>

          <button
            onClick={() => setSelectedServer("server2")}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
              selectedServer === "server2"
                ? "bg-white text-black shadow-glow"
                : "bg-white/5 text-zinc-400 hover:text-white"
            }`}
          >
            Server 2 (Backup)
          </button>
        </div>
      </div>
    </div>
  );
};
