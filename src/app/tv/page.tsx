"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Radio,
  Tv,
  Film,
  Trophy,
  Newspaper,
  Music,
  Play,
  Signal,
  Sparkles,
} from "lucide-react";
import { GlassVideoPlayer } from "@/components/GlassVideoPlayer";
import { GlassCard } from "@/components/ui/GlassCard";

interface ChannelItem {
  id: string;
  name: string;
  category: "news" | "sports" | "entertainment" | "cinema" | "anime" | "music";
  logo: string;
  streamUrl: string;
  currentProgram: string;
}

const LIVE_CHANNELS: ChannelItem[] = [
  {
    id: "nhk-world",
    name: "NHK World Japan",
    category: "news",
    logo: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=120&auto=format&fit=crop&q=80",
    streamUrl: "https://b23910.livepush.io/live/b23910/index.m3u8",
    currentProgram: "Newsline Live Broadcast",
  },
  {
    id: "redbull-tv",
    name: "Red Bull TV",
    category: "sports",
    logo: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=120&auto=format&fit=crop&q=80",
    streamUrl: "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8",
    currentProgram: "Action Sports Highlights & Live Events",
  },
  {
    id: "france24-en",
    name: "France 24 English",
    category: "news",
    logo: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=120&auto=format&fit=crop&q=80",
    streamUrl: "https://f24hls-i.akamaihd.net/hls/live/221193/F24_EN_LO_HLS/master_1000.m3u8",
    currentProgram: "Global Headlines & Insight",
  },
  {
    id: "anime-stream-1",
    name: "Retro Anime Classics",
    category: "anime",
    logo: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=120&auto=format&fit=crop&q=80",
    streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    currentProgram: "Non-stop Classic Anime Marathon",
  },
  {
    id: "cinema-now",
    name: "Spectra Cinema Live",
    category: "cinema",
    logo: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=120&auto=format&fit=crop&q=80",
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    currentProgram: "Featured Indie Showcase",
  },
  {
    id: "club-dance-tv",
    name: "Clubbing & Chill Beats",
    category: "music",
    logo: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&auto=format&fit=crop&q=80",
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    currentProgram: "Electronic Beats & Visuals",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Channels", icon: Radio },
  { id: "news", label: "News", icon: Newspaper },
  { id: "sports", label: "Sports", icon: Trophy },
  { id: "cinema", label: "Cinema", icon: Film },
  { id: "anime", label: "Anime", icon: Sparkles },
  { id: "music", label: "Music", icon: Music },
];

export default function LiveTvPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedChannel, setSelectedChannel] = useState<ChannelItem>(LIVE_CHANNELS[0]);

  const filteredChannels =
    activeCategory === "all"
      ? LIVE_CHANNELS
      : LIVE_CHANNELS.filter((c) => c.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2 pb-28 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-red-500 animate-pulse" />
            Live TV & IPTV Hub
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time low-latency IPTV broadcasts with instant channel switching
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider">
          <Signal className="w-3.5 h-3.5 animate-pulse" />
          <span>On Air</span>
        </div>
      </div>

      {/* Main Glass Stream Player */}
      <div className="space-y-2">
        <GlassVideoPlayer
          src={selectedChannel.streamUrl}
          title={`Live: ${selectedChannel.name} • ${selectedChannel.currentProgram}`}
          poster={selectedChannel.logo}
        />
        <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-zinc-900 border border-white/20">
              <Image
                src={selectedChannel.logo}
                alt={selectedChannel.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                {selectedChannel.name}
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </h3>
              <p className="text-[11px] text-zinc-400">{selectedChannel.currentProgram}</p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-2 py-0.5 rounded bg-white/10 border border-white/10">
            {selectedChannel.category}
          </span>
        </div>
      </div>

      {/* Channel Category Switcher */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition border ${
                  isSelected
                    ? "bg-white text-black border-white shadow-glow"
                    : "bg-white/5 text-zinc-400 border-white/10 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Channel Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredChannels.map((channel) => {
            const isCurrent = channel.id === selectedChannel.id;

            return (
              <div
                key={channel.id}
                onClick={() => {
                  setSelectedChannel(channel);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="cursor-pointer group"
              >
                <GlassCard
                  hoverEffect
                  className={`p-3 rounded-2xl flex items-center gap-3 border transition ${
                    isCurrent
                      ? "bg-white/15 border-white shadow-glow"
                      : "border-white/10 bg-[#0c0c12]/80 hover:border-white/25"
                  }`}
                >
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-950 border border-white/15 flex-none">
                    <Image
                      src={channel.logo}
                      alt={channel.name}
                      fill
                      className="object-cover group-hover:scale-105 transition"
                    />
                    {isCurrent && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Play className="w-4 h-4 fill-white text-white" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-zinc-200">
                        {channel.name}
                      </h4>
                      {isCurrent && (
                        <span className="text-[9px] font-extrabold text-red-400 uppercase tracking-widest flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                          Live
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-zinc-400 truncate">{channel.currentProgram}</p>
                  </div>
                </GlassCard>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
