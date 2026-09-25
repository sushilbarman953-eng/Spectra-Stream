"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import { Server, RotateCw, AlertTriangle, CheckCircle2 } from "lucide-react";

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
    id: "vidsrc_icu",
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
    id: "embedsu",
    name: "Embed.su",
    getUrl: (id, type, s, e) =>
      type === "movie"
        ? `https://embed.su/embed/movie/${id}`
        : `https://embed.su/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "smashy",
    name: "SmashyStream",
    getUrl: (id, type, s, e) =>
      type === "movie"
        ? `https://player.smashystream.com/movie/${id}`
        : `https://player.smashystream.com/tv/${id}?s=${s}&e=${e}`,
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
    id: "vidsrc_xyz",
    name: "VidSrc XYZ",
    getUrl: (id, type, s, e) =>
      type === "movie"
        ? `https://vidsrc.xyz/embed/movie/${id}`
        : `https://vidsrc.xyz/embed/tv/${id}/${s}/${e}`,
  },
];

export const Player = ({ id, type, season = 1, episode = 1, m3u8Url }: PlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentServerIndex, setCurrentServerIndex] = useState(0);
  const [isNativeHls, setIsNativeHls] = useState(Boolean(m3u8Url));
  const [isAutoSwitchEnabled, setIsAutoSwitchEnabled] = useState(true);
  const [countdown, setCountdown] = useState(8);
  const [hasLoaded, setHasLoaded] = useState(false);

  const activeServer = SERVER_POOL[currentServerIndex];

  // Rotate to next server in pool
  const rotateToNextServer = useCallback(() => {
    setHasLoaded(false);
    setCountdown(8);
    setCurrentServerIndex((prev) => (prev + 1) % SERVER_POOL.length);
  }, []);

  // Failover countdown watchdog
  useEffect(() => {
    if (isNativeHls || !isAutoSwitchEnabled || hasLoaded) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          console.warn(`Server ${activeServer.name} timed out. Failing over...`);
          rotateToNextServer();
          return 8;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isNativeHls, isAutoSwitchEnabled, hasLoaded, activeServer, rotateToNextServer]);

  // Direct HLS player engine (.m3u8)
  useEffect(() => {
    if (!isNativeHls || !m3u8Url || !videoRef.current) return;

    let hls: Hls | null = null;
    const video = videoRef.current;

    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true });
      hls.loadSource(m3u8Url);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, () => {
        console.warn("HLS stream failed. Falling back to multi-server pool.");
        setIsNativeHls(false);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = m3u8Url;
      video.onerror = () => setIsNativeHls(false);
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [isNativeHls, m3u8Url]);

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Player Screen Frame */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden glass-panel border border-white/15 bg-black shadow-2xl">
        {isNativeHls && m3u8Url ? (
          <video
            ref={videoRef}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />
        ) : (
          <iframe
            key={activeServer.id}
            src={activeServer.getUrl(id, type, season, episode)}
            title={activeServer.name}
            className="w-full h-full border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            onLoad={() => {
              // Mark ready once the frame loads initial payload
              setHasLoaded(true);
            }}
          />
        )}

        {/* Auto-Failover Monitor Badge */}
        {!isNativeHls && isAutoSwitchEnabled && !hasLoaded && (
          <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/80 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-[11px] text-zinc-300 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Connecting to {activeServer.name} ({countdown}s)...
          </div>
        )}
      </div>

      {/* Control & Server Selection Console */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3.5 rounded-xl glass-panel border border-white/10">
        <div className="flex items-center gap-2 text-xs text-zinc-300 w-full md:w-auto justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-zinc-400" />
            <span className="font-medium text-white">Active Server:</span>
            <span className="text-zinc-400">{isNativeHls ? "HLS (.m3u8)" : activeServer.name}</span>
          </div>

          {!isNativeHls && (
            <button
              onClick={() => setIsAutoSwitchEnabled((prev) => !prev)}
              className="text-[10px] text-zinc-400 hover:text-white underline decoration-zinc-600 ml-3"
            >
              Auto-Failover: {isAutoSwitchEnabled ? "ON" : "OFF"}
            </button>
          )}
        </div>

        {/* Manual Server Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
          {m3u8Url && (
            <button
              onClick={() => {
                setIsNativeHls(true);
                setHasLoaded(true);
              }}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${
                isNativeHls
                  ? "bg-white text-black shadow-glow font-bold"
                  : "bg-white/5 text-zinc-400 hover:text-white"
              }`}
            >
              Direct HLS
            </button>
          )}

          {SERVER_POOL.map((server, index) => (
            <button
              key={server.id}
              onClick={() => {
                setIsNativeHls(false);
                setCurrentServerIndex(index);
                setHasLoaded(false);
                setCountdown(8);
              }}
              className={`px-2.5 py-1.5 text-xs rounded-lg font-medium transition ${
                !isNativeHls && currentServerIndex === index
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
            Skip Server
          </button>
        </div>
      </div>
    </div>
  );
};
