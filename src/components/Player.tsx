"use client";

import React, { useState } from "react";
import { Server, RotateCw, ExternalLink } from "lucide-react";
import { GlassVideoPlayer } from "@/components/GlassVideoPlayer";

interface PlayerProps {
  id: string;
  type: "movie" | "tv";
  season?: number;
  episode?: number;
  m3u8Url?: string;
  poster?: string;
  onEnded?: () => void;
}

interface ServerSource {
  id: string;
  name: string;
  getUrl: (id: string, type: "movie" | "tv", s: number, e: number) => string;
}

const SERVER_POOL: ServerSource[] = [
  {
    id: "vidlink",
    name: "VidLink (Fast)",
    getUrl: (id, type, s, e) =>
      type === "movie"
        ? `https://vidlink.pro/movie/${id}`
        : `https://vidlink.pro/tv/${id}/${s}/${e}`,
  },
  {
    id: "vidsrc_in",
    name: "VidSrc.in",
    getUrl: (id, type, s, e) =>
      type === "movie"
        ? `https://vidsrc.in/embed/movie/${id}`
        : `https://vidsrc.in/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "2embed",
    name: "2Embed",
    getUrl: (id, type, s, e) =>
      type === "movie"
        ? `https://www.2embed.cc/embed/${id}`
        : `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`,
  },
  {
    id: "autoembed",
    name: "AutoEmbed",
    getUrl: (id, type, s, e) =>
      type === "movie"
        ? `https://player.autoembed.cc/embed/movie/${id}`
        : `https://player.autoembed.cc/embed/tv/${id}/${s}/${e}`,
  },
];

export const Player = ({
  id,
  type,
  season = 1,
  episode = 1,
  m3u8Url,
  poster,
  onEnded,
}: PlayerProps) => {
  const [currentServerIndex, setCurrentServerIndex] = useState(0);
  const [forceIframe, setForceIframe] = useState(false);

  const activeServer = SERVER_POOL[currentServerIndex];
  const streamUrl = m3u8Url || activeServer.getUrl(id, type, season, episode);

  const nextServer = () => {
    setCurrentServerIndex((prev) => (prev + 1) % SERVER_POOL.length);
  };

  return (
    <div className="w-full flex flex-col gap-3 select-none">
      {/* Primary Video Container */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden glass-panel border border-white/15 bg-black shadow-2xl">
        {!forceIframe ? (
          <GlassVideoPlayer
            id={id}
            type={type}
            season={season}
            episode={episode}
            src={streamUrl}
            poster={poster}
            isLive={false}
            onEnded={onEnded}
          />
        ) : (
          <iframe
            key={`${activeServer.id}-${id}-${season}-${episode}`}
            src={streamUrl}
            title={activeServer.name}
            className="w-full h-full border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        )}
      </div>

      {/* Bottom Switcher Console */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 rounded-xl glass-panel border border-white/10">
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-2 text-xs">
            <Server className="w-4 h-4 text-zinc-400" />
            <span className="font-semibold text-white">
              {!forceIframe ? "Spectra Frosted Glass Player" : activeServer.name}
            </span>
          </div>

          <a
            href={streamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-zinc-300 hover:text-white bg-white/10 px-2.5 py-1 rounded-md"
          >
            <ExternalLink className="w-3 h-3" />
            Pop-out
          </a>
        </div>

        {/* Server Selection & Engine Toggle */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <button
            onClick={() => setForceIframe(!forceIframe)}
            className={`px-2.5 py-1 text-xs rounded-lg font-semibold border transition ${
              !forceIframe
                ? "bg-white text-black border-white shadow-glow"
                : "bg-white/5 text-zinc-400 border-white/15"
            }`}
          >
            Frosted Glass
          </button>

          {SERVER_POOL.map((server, index) => (
            <button
              key={server.id}
              onClick={() => setCurrentServerIndex(index)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                currentServerIndex === index
                  ? "bg-white/20 text-white font-bold border border-white/30"
                  : "bg-white/5 text-zinc-400 hover:text-white"
              }`}
            >
              {server.name.split(" ")[0]}
            </button>
          ))}

          <button
            onClick={nextServer}
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
