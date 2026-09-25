"use client";

import React, { useState, useEffect, useRef } from "react";
import Hls from "hls.js";
import { Radio, Tv, Play, AlertCircle, Signal, Volume2, VolumeX } from "lucide-react";
import { CURATED_CHANNELS, LiveChannel } from "@/lib/iptv";
import { GlassCard } from "@/components/ui/GlassCard";

export default function LiveTvPage() {
  const [channels] = useState<LiveChannel[]>(CURATED_CHANNELS);
  const [selectedChannel, setSelectedChannel] = useState<LiveChannel>(CURATED_CHANNELS[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [playbackError, setPlaybackError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const categories = ["All", ...Array.from(new Set(channels.map((c) => c.category)))];

  const filteredChannels =
    selectedCategory === "All"
      ? channels
      : channels.filter((c) => c.category === selectedCategory);

  useEffect(() => {
    if (!videoRef.current || !selectedChannel) return;

    setPlaybackError(false);
    const video = videoRef.current;
    let hls: Hls | null = null;
    const isHlsStream = selectedChannel.streamUrl.includes(".m3u8");

    if (isHlsStream) {
      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });

        hls.loadSource(selectedChannel.streamUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            console.warn("HLS Error:", data.type);
            setPlaybackError(true);
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = selectedChannel.streamUrl;
        video.play().catch(() => {});
      }
    } else {
      video.src = selectedChannel.streamUrl;
      video.play().catch(() => {});
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [selectedChannel]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-white/10 border border-white/20">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Live TV Lounge
              <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                Live
              </span>
            </h1>
            <p className="text-xs text-zinc-400">Stream global broadcast feeds</p>
          </div>
        </div>

        <button
          onClick={toggleMute}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel text-xs text-white border border-white/15 hover:bg-white/10"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-zinc-400" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
          <span>{isMuted ? "Unmute" : "Muted"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-3">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden glass-panel border border-white/15 bg-black shadow-2xl">
            <video
              ref={videoRef}
              muted={isMuted}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />

            {playbackError && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center gap-2">
                <AlertCircle className="w-7 h-7 text-zinc-400" />
                <p className="text-xs text-zinc-300">
                  Stream blocked by regional CDN or offline. Pick another channel below.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl glass-panel border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Signal className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{selectedChannel.name}</h3>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
                  {selectedChannel.category}
                </span>
              </div>
            </div>
            <span className="text-xs text-zinc-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
              Live Feed
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition border ${
                  selectedCategory === cat
                    ? "bg-white text-black border-white shadow-glow font-bold"
                    : "bg-white/[0.04] text-zinc-400 border-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto no-scrollbar pr-1">
            {filteredChannels.map((channel) => {
              const isCurrent = selectedChannel.id === channel.id;

              return (
                <div
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className="cursor-pointer"
                >
                  <GlassCard
                    hoverEffect
                    className={`flex items-center justify-between p-3 rounded-xl transition border ${
                      isCurrent
                        ? "bg-white/15 border-white shadow-glow"
                        : "border-white/10 hover:border-white/25"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                        <Tv className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{channel.name}</p>
                        <p className="text-[10px] text-zinc-400">{channel.category}</p>
                      </div>
                    </div>

                    {isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    ) : (
                      <Play className="w-3.5 h-3.5 text-zinc-500" />
                    )}
                  </GlassCard>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
