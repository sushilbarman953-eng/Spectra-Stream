"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import { Server, RotateCw, ExternalLink, Play, Film } from "lucide-react";

interface PlayerProps {
  id: string;
  type: "movie" | "tv";
  season?: number;
  episode?: number;
  m3u8Url?: string;
}

interface ServerSource {
  id: string;
  name: string;
  getUrl: (id: string, type: "movie" | "tv", s: number, e: number) => string;
}

const SERVER_POOL: ServerSource[] = [
  {
    id: "vidsrc_pro",
    name: "VidSrc Pro",
    getUrl: (id, type, s, e) =>
      type === "movie"
        ? `https://vidsrc.pro/embed/movie/${id}`
        : `https://vidsrc.pro/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "vidsrc_cc",
    name: "VidSrc CC",
    getUrl: (id, type, s, e) =>
      type === "movie"
        ? `https://vidsrc.cc/v2/embed/movie/${id}`
        : `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "autoembed",
    name: "AutoEmbed",
    getUrl: (id, type, s, e) =>
      type === "movie"
        ? `https://player.autoembed.cc/embed/movie/${id}`
        : `https://player.autoembed.cc/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "superembed",
    name: "SuperEmbed",
    getUrl: (id, type, s, e) =>
      type === "movie"
        ? `https://multiembed.mov/?video_id=${id}&tmdb=1`
        : `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`,
  },
  {
    id: "moviesapi",
    name: "MoviesAPI",
    getUrl: (id, type, s, e) =>
      type === "movie"
        ? `https://moviesapi.club/movie/${id}`
        : `https://moviesapi.club/tv/${id}-${s}-${e}`,
  },
];

// Reliable open-source test stream
const DEMO_HLS_URL = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

export const Player = ({ id, type, season = 1, episode = 1, m3u8Url }: PlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentServerIndex, setCurrentServerIndex] = useState(0);
  const [useHls, setUseHls] = useState(Boolean(m3u8Url));
  const [activeM3u8, setActiveM3u8] = useState<string | null>(m3u8Url || null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const activeServer = SERVER_POOL[currentServerIndex];
  const streamUrl = activeServer.getUrl(id, type, season, episode);

  // Switch to next server
  const rotateToNextServer = useCallback(() => {
    setHasLoaded(false);
    setCurrentServerIndex((prev) => (prev + 1) % SERVER_POOL.length);
  }, []);

  // HLS Engine for direct m3u8 streams
  useEffect(() => {
    if (!useHls || !activeM3u8 || !videoRef.current) return;

    let hls: Hls | null = null;
    const video = videoRef.current;

    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true });
      hls.loadSource(activeM3u8);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = activeM3u8;
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [useHls, activeM3u8]);

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Player Screen Frame */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden glass-panel border border-white/15 bg-black shadow-2xl">
        {useHls && activeM3u8 ? (
          <video
            ref={videoRef}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />
        ) : (
          <iframe
            key={`${activeServer.id}-${id}-${season}-${episode}`}
            src={streamUrl}
            title={activeServer.name}
            className="w-full h-full border-0"
            referrerPolicy="origin"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            onLoad={() => setHasLoaded(true)}
          />
        )}
      </div>

      {/* Control Console */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3.5 rounded-xl glass-panel border border-white/10">
        <div className="flex items-center gap-2 text-xs text-zinc-300 w-full md:w-auto justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-zinc-400" />
            <span className="font-medium text-white">Active Source:</span>
            <span className="text-zinc-400">{useHls ? "Direct HLS Stream" : activeServer.name}</span>
          </div>

          {/* Direct Pop-out bypass */}
          {!useHls && (
            <a
              href={streamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] text-zinc-200 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-md transition"
            >
              <ExternalLink className="w-3 h-3" />
              Open Clean Tab
            </a>
          )}
        </div>

        {/* Server Selectors */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
          {/* Test Stream Button */}
          <button
            onClick={() => {
              setActiveM3u8(DEMO_HLS_URL);
              setUseHls(true);
            }}
            className={`px-2.5 py-1.5 text-xs rounded-lg font-medium transition ${
              useHls
                ? "bg-white text-black shadow-glow font-bold"
                : "bg-white/5 text-zinc-400 hover:text-white"
            }`}
          >
            Direct HLS Test
          </button>

          {SERVER_POOL.map((server, index) => (
            <button
              key={server.id}
              onClick={() => {
                setUseHls(false);
                setCurrentServerIndex(index);
                setHasLoaded(false);
              }}
              className={`px-2.5 py-1.5 text-xs rounded-lg font-medium transition ${
                !useHls && currentServerIndex === index
                  ? "bg-white text-black shadow-glow font-bold"
                  : "bg-white/5 text-zinc-400 hover:text-white"
              }`}
            >
              {server.name}
            </button>
          ))}

          <button
            onClick={rotateToNextServer}
            title="Next Server"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-medium bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
          >
            <RotateCw className="w-3.5 h-3.5" />
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
