"use client";

import React, { useState } from "react";
import { Sparkles, Server, RefreshCw, ExternalLink, ShieldCheck } from "lucide-react";
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
  const [activeServer, setActiveServer] = useState<string>("frosted-glass");
  const [key, setKey] = useState<number>(0);

  const SERVERS = [
    {
      id: "frosted-glass",
      name: "Frosted Glass",
      badge: "Spectra Pro",
      isCustom: true,
    },
    {
      id: "vidsrc-icu",
      name: "VidSrc ICU",
      badge: "Fast",
      getUrl: () =>
        type === "tv"
          ? `https://vidsrc.icu/embed/tv/${id}/${season}/${episode}`
          : `https://vidsrc.icu/embed/movie/${id}`,
    },
    {
      id: "vidlink",
      name: "VidLink",
      badge: "Multi-Sub",
      getUrl: () =>
        type === "tv"
          ? `https://vidlink.pro/tv/${id}/${season}/${episode}?primaryColor=ffffff&secondaryColor=101015`
          : `https://vidlink.pro/movie/${id}?primaryColor=ffffff&secondaryColor=101015`,
    },
    {
      id: "vidsrc-cc",
      name: "VidSrc CC",
      badge: "HD",
      getUrl: () =>
        type === "tv"
          ? `https://vidsrc.cc/v2/embed/tv/${id}/${season}/${episode}`
          : `https://vidsrc.cc/v2/embed/movie/${id}`,
    },
    {
      id: "multiembed",
      name: "MultiEmbed",
      badge: "Auto-Failover",
      getUrl: () =>
        type === "tv"
          ? `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${season}&e=${episode}`
          : `https://multiembed.mov/?video_id=${id}&tmdb=1`,
    },
    {
      id: "autoembed",
      name: "AutoEmbed",
      badge: "Clean",
      getUrl: () =>
        type === "tv"
          ? `https://player.autoembed.cc/embed/tv/${id}/${season}/${episode}`
          : `https://player.autoembed.cc/embed/movie/${id}`,
    },
  ];

  const current = SERVERS.find((s) => s.id === activeServer) || SERVERS[0];
  const streamUrl = current.getUrl ? current.getUrl() : "";

  return (
    <div className="space-y-3">
      {/* 1. Active Viewport: Frosted Glass Player vs External Mirror */}
      {activeServer === "frosted-glass" ? (
        <GlassVideoPlayer
          src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
          title={title}
          tmdbId={id}
          type={type}
          season={season}
          episode={episode}
          poster={poster}
          backdrop={backdrop}
        />
      ) : (
        <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-black border border-white/20 shadow-2xl">
          <iframe
            key={`${activeServer}-${id}-${season}-${episode}-${key}`}
            src={streamUrl}
            title="Spectra Stream Engine"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="origin"
            className="w-full h-full border-0"
          />
        </div>
      )}

      {/* 2. Stream & Server Selection Control Strip */}
      <div className="p-3 rounded-2xl border border-white/10 bg-[#0e0e14]/80 backdrop-blur-xl space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
            <Server className="w-3.5 h-3.5 text-white" />
            <span>Select Stream Engine</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setKey((k) => k + 1)}
              className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition px-2 py-0.5 rounded-lg bg-white/5 border border-white/10"
              title="Reload Frame"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reload</span>
            </button>
            {streamUrl && (
              <a
                href={streamUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition px-2 py-0.5 rounded-lg bg-white/5 border border-white/10"
                title="Popout"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Popout</span>
              </a>
            )}
          </div>
        </div>

        {/* Server & Engine Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {SERVERS.map((server) => {
            const isSelected = server.id === activeServer;

            return (
              <button
                key={server.id}
                onClick={() => {
                  setActiveServer(server.id);
                  setKey((k) => k + 1);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                  isSelected
                    ? "bg-white text-black border-white shadow-glow font-bold"
                    : "bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {server.isCustom && <Sparkles className="w-3 h-3" />}
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
            {activeServer === "frosted-glass"
              ? "Using custom monochrome frosted glass player with gesture & intro-skip support."
              : "Using external failover mirror. Tap Frosted Glass to return to native UI."}
          </span>
        </div>
      </div>
    </div>
  );
};
