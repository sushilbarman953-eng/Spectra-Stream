"use client";

import React, { useState } from "react";
import { Server, RefreshCw, ExternalLink, ShieldCheck } from "lucide-react";

interface AnimePlayerProps {
  tmdbId: string;
  animeTitle: string;
  season?: number;
  episode?: number;
  totalEpisodes?: number;
  poster?: string;
  onNextEpisode?: () => void;
}

export const AnimePlayer = ({
  tmdbId,
  season = 1,
  episode = 1,
}: AnimePlayerProps) => {
  const [activeServer, setActiveServer] = useState<string>("vidsrc-icu");
  const [subOrDub, setSubOrDub] = useState<"sub" | "dub">("sub");
  const [key, setKey] = useState<number>(0);

  const SERVERS = [
    {
      id: "vidsrc-icu",
      name: "VidSrc ICU",
      badge: "Fast",
      getUrl: () => `https://vidsrc.icu/embed/tv/${tmdbId}/${season}/${episode}`,
    },
    {
      id: "vidlink",
      name: "VidLink",
      badge: "Multi-Audio",
      getUrl: () =>
        `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}?primaryColor=ffffff&secondaryColor=101015`,
    },
    {
      id: "vidsrc-cc",
      name: "VidSrc CC",
      badge: "HD",
      getUrl: () => `https://vidsrc.cc/v2/embed/tv/${tmdbId}/${season}/${episode}`,
    },
    {
      id: "multiembed",
      name: "MultiEmbed",
      badge: "Auto-Mirror",
      getUrl: () =>
        `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`,
    },
    {
      id: "autoembed",
      name: "AutoEmbed",
      badge: "Clean",
      getUrl: () =>
        `https://player.autoembed.cc/embed/tv/${tmdbId}/${season}/${episode}`,
    },
    {
      id: "vidsrc-net",
      name: "VidSrc Net",
      badge: "Legacy",
      getUrl: () =>
        `https://vidsrc.net/embed/tv/${tmdbId}/${season}/${episode}`,
    },
  ];

  const current = SERVERS.find((s) => s.id === activeServer) || SERVERS[0];
  const streamUrl = current.getUrl();

  return (
    <div className="space-y-3">
      {/* 1. Video Player Viewport */}
      <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-black border border-white/20 shadow-2xl">
        <iframe
          key={`${activeServer}-${tmdbId}-${season}-${episode}-${subOrDub}-${key}`}
          src={streamUrl}
          title="Spectra Anime Stream Engine"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="origin"
          className="w-full h-full border-0"
        />
      </div>

      {/* 2. Server & Audio Selector */}
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

          <div className="flex items-center gap-2">
            <button
              onClick={() => setKey((k) => k + 1)}
              className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition px-2 py-0.5 rounded-lg bg-white/5 border border-white/10"
              title="Reload Frame"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reload</span>
            </button>
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
          </div>
        </div>

        {/* Server Buttons */}
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
          <span>VidSrc ICU & VidLink provide primary failover with full episode navigation.</span>
        </div>
      </div>
    </div>
  );
};
