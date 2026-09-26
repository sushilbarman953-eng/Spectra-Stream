"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Server,
  Volume2,
  RefreshCw,
  Maximize2,
  AlertCircle,
  Radio,
  Sparkles,
} from "lucide-react";
import { STREAM_SERVERS, StreamSource } from "@/lib/streamingSources";
import { soundFx } from "@/lib/soundFx";

export default function WatchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params?.id as string;
  const type = (searchParams.get("type") as "movie" | "tv") || "movie";
  const season = parseInt(searchParams.get("season") || "1", 10);
  const episode = parseInt(searchParams.get("episode") || "1", 10);

  // Streaming State
  const [currentServerIdx, setCurrentServerIdx] = useState<number>(0);
  const [audioTrack, setAudioTrack] = useState<"hindi" | "original">("hindi");
  const [loading, setLoading] = useState<boolean>(true);
  const [failoverToast, setFailoverToast] = useState<string | null>(null);
  const [showServerMenu, setShowServerMenu] = useState<boolean>(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const failoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeServer = STREAM_SERVERS[currentServerIdx];
  const streamUrl = activeServer.buildUrl({
    tmdbId: id,
    type,
    season,
    episode,
    audio: audioTrack,
  });

  // Watchdog: If iframe fails to finish handshaking within 8 seconds, automatically failover
  useEffect(() => {
    setLoading(true);

    if (failoverTimeoutRef.current) clearTimeout(failoverTimeoutRef.current);

    failoverTimeoutRef.current = setTimeout(() => {
      if (loading && currentServerIdx < STREAM_SERVERS.length - 1) {
        handleFailover(currentServerIdx + 1, "Slow Indian route response. Switched to backup server.");
      }
    }, 8500);

    return () => {
      if (failoverTimeoutRef.current) clearTimeout(failoverTimeoutRef.current);
    };
  }, [currentServerIdx, audioTrack, id, season, episode]);

  const handleFailover = (nextIdx: number, reason?: string) => {
    soundFx.playCinematicWhoosh();
    setCurrentServerIdx(nextIdx);
    setFailoverToast(reason || `Switched to ${STREAM_SERVERS[nextIdx].name}`);
    setTimeout(() => setFailoverToast(null), 3000);
  };

  const handleIframeLoaded = () => {
    setLoading(false);
    if (failoverTimeoutRef.current) clearTimeout(failoverTimeoutRef.current);
  };

  const toggleAudioTrack = () => {
    soundFx.playCinematicPop();
    const nextAudio = audioTrack === "hindi" ? "original" : "hindi";
    setAudioTrack(nextAudio);
    setFailoverToast(`Switched to ${nextAudio === "hindi" ? "Hindi Dub / Audio" : "Original Audio"}`);
    setTimeout(() => setFailoverToast(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col select-none">
      {/* Top HUD Controls */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-3 sm:p-4 bg-gradient-to-b from-black/90 via-black/40 to-transparent">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundFx.playCinematicWhoosh();
              router.back();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-xl transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Active Server Info */}
          <div className="relative">
            <button
              onClick={() => {
                soundFx.playCinematicPop();
                setShowServerMenu(!showServerMenu);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white backdrop-blur-xl transition shadow-glow"
            >
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span>{activeServer.name}</span>
              <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">
                ({activeServer.latency})
              </span>
            </button>

            {/* Server Selector Dropdown */}
            {showServerMenu && (
              <div className="absolute top-12 left-0 w-64 rounded-2xl p-2 bg-[#0c0c14]/95 border border-white/20 shadow-2xl backdrop-blur-3xl space-y-1 z-50">
                <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 px-2 py-1 block">
                  Select Indian / Asian Mirror
                </span>
                {STREAM_SERVERS.map((server, idx) => (
                  <button
                    key={server.id}
                    onClick={() => {
                      setShowServerMenu(false);
                      handleFailover(idx);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition ${
                      currentServerIdx === idx
                        ? "bg-white text-black font-extrabold"
                        : "hover:bg-white/10 text-white"
                    }`}
                  >
                    <div>
                      <p className="font-bold truncate">{server.name}</p>
                      <p className={`text-[9px] ${currentServerIdx === idx ? "text-zinc-700" : "text-zinc-400"}`}>
                        {server.region}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono">{server.latency}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right HUD Controls: Audio Track Switch */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleAudioTrack}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border backdrop-blur-xl ${
              audioTrack === "hindi"
                ? "bg-emerald-400 text-black border-emerald-400 shadow-glow font-black"
                : "bg-white/10 hover:bg-white/20 text-white border-white/20"
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{audioTrack === "hindi" ? "Hindi Audio" : "Original"}</span>
          </button>
        </div>
      </div>

      {/* Failover Toast Notification */}
      {failoverToast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-2xl bg-white text-black text-xs font-bold shadow-glow flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{failoverToast}</span>
        </div>
      )}

      {/* Video Stream Embed */}
      <div className="relative w-full h-full flex items-center justify-center bg-black">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10 bg-black/90">
            <RefreshCw className="w-6 h-6 animate-spin text-white" />
            <span className="text-xs text-zinc-300 font-mono">
              Connecting to {activeServer.region} ({activeServer.latency})...
            </span>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={streamUrl}
          onLoad={handleIframeLoaded}
          className="w-full h-full border-0"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
