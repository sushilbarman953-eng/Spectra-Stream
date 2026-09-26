"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, RotateCw, FastForward, Check, StepForward } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";
import { watchProgress } from "@/lib/watchProgress";

interface AnimePlayerProps {
  tmdbId: string;
  animeTitle: string;
  season?: number;
  episode: number;
  totalEpisodes?: number;
  onNextEpisode?: () => void;
}

export const AnimePlayer = ({
  tmdbId,
  animeTitle,
  season = 1,
  episode,
  totalEpisodes,
  onNextEpisode,
}: AnimePlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [audioMode, setAudioMode] = useState<"sub" | "dub">("sub");
  const [currentServer, setCurrentServer] = useState(0);

  // Auto-Next State
  const [showNextOverlay, setShowNextOverlay] = useState(false);
  const [countdown, setCountdown] = useState(10);

  // Playback & Skip Controls
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [showSkipOutro, setShowSkipOutro] = useState(false);

  // Resume check
  const savedProgress = watchProgress.get(tmdbId, season, episode);
  const resumeTime = savedProgress && savedProgress.progressPercent < 90 ? savedProgress.currentTime : 0;

  const SERVERS = [
    {
      id: "vidlink",
      name: "VidLink (Fast)",
      getUrl: (ep: number) =>
        `https://vidlink.pro/tv/${tmdbId}/${season}/${ep}?subOrDub=${audioMode}&startAt=${Math.floor(resumeTime)}`,
    },
    {
      id: "vidsrc",
      name: "VidSrc Anime",
      getUrl: (ep: number) =>
        `https://vidsrc.in/embed/tv/${tmdbId}/${season}/${ep}`,
    },
    {
      id: "2embed",
      name: "2Embed",
      getUrl: (ep: number) =>
        `https://www.2embed.cc/embedtv/${tmdbId}&s=${season}&e=${ep}`,
    },
    {
      id: "autoembed",
      name: "AutoEmbed Multi",
      getUrl: (ep: number) =>
        `https://player.autoembed.cc/embed/tv/${tmdbId}/${season}/${ep}`,
    },
  ];

  const activeServer = SERVERS[currentServer];
  const streamUrl = activeServer.getUrl(episode);

  // Listen to postMessage from embed players (VidLink, PlayerJS, etc.)
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (!data) return;

        // Extract timeupdate / progress
        const time = data.currentTime || data.time || data.detail?.currentTime;
        const dur = data.duration || data.totalTime || data.detail?.duration;

        if (typeof time === "number") {
          setCurrentTime(time);
          if (dur) setDuration(dur);

          // Save progress
          if (dur > 0) {
            watchProgress.save(tmdbId, "tv", season, episode, time, dur);
          }

          // Intro detector (typically within first 2.5 minutes)
          setShowSkipIntro(time >= 10 && time <= 110);

          // Outro detector (typically final 2 minutes)
          if (dur > 0) {
            setShowSkipOutro(time >= dur - 130 && time < dur - 20);
          }

          // Trigger Auto-Next at 96% completion
          if (dur > 0 && time / dur >= 0.96 && !showNextOverlay && onNextEpisode) {
            setShowNextOverlay(true);
            setCountdown(10);
          }
        }

        // Trigger Auto-Next on explicit "ended" event
        if (
          (data.event === "ended" || data.status === "ended" || data === "ended") &&
          !showNextOverlay &&
          onNextEpisode
        ) {
          setShowNextOverlay(true);
          setCountdown(10);
        }
      } catch {
        // Non-JSON iframe message
      }
    },
    [tmdbId, season, episode, showNextOverlay, onNextEpisode]
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  // Next Episode Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showNextOverlay && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (showNextOverlay && countdown === 0) {
      setShowNextOverlay(false);
      setCountdown(10);
      onNextEpisode?.();
    }
    return () => clearTimeout(timer);
  }, [showNextOverlay, countdown, onNextEpisode]);

  // Skip Forward via postMessage
  const sendSeek = (secondsToAdd: number) => {
    if (!iframeRef.current?.contentWindow) return;
    const target = currentTime + secondsToAdd;
    iframeRef.current.contentWindow.postMessage(
      JSON.stringify({ event: "seek", time: target }),
      "*"
    );
    iframeRef.current.contentWindow.postMessage(
      { type: "player:seek", time: target },
      "*"
    );
  };

  return (
    <div className="w-full flex flex-col gap-3 select-none">
      {/* Player Screen */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden glass-panel border border-white/15 bg-black shadow-2xl">
        <iframe
          ref={iframeRef}
          key={`${activeServer.id}-${season}-${episode}-${audioMode}`}
          src={streamUrl}
          title={`Season ${season} Episode ${episode}`}
          className="w-full h-full border-0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />

        {/* Skip Intro Button */}
        {showSkipIntro && (
          <button
            onClick={() => {
              sendSeek(85);
              setShowSkipIntro(false);
            }}
            className="absolute bottom-14 left-4 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/30 text-xs font-bold text-white shadow-glow animate-in fade-in slide-in-from-bottom-2 duration-200"
            style={{
              background: "rgba(12, 12, 16, 0.85)",
              backdropFilter: "blur(20px)",
            }}
          >
            <StepForward className="w-3.5 h-3.5 fill-white" />
            <span>Skip Intro (+85s)</span>
          </button>
        )}

        {/* Skip Outro Button */}
        {showSkipOutro && (
          <button
            onClick={() => {
              sendSeek(90);
              setShowSkipOutro(false);
            }}
            className="absolute bottom-14 right-4 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/30 text-xs font-bold text-white shadow-glow animate-in fade-in slide-in-from-bottom-2 duration-200"
            style={{
              background: "rgba(12, 12, 16, 0.85)",
              backdropFilter: "blur(20px)",
            }}
          >
            <StepForward className="w-3.5 h-3.5 fill-white" />
            <span>Skip Outro</span>
          </button>
        )}

        {/* Automatic Next Episode Countdown Modal */}
        {showNextOverlay && (
          <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center gap-3 animate-in fade-in duration-300">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
              Up Next
            </span>
            <h4 className="text-lg font-bold text-white">
              Episode {episode + 1}
            </h4>
            <p className="text-xs text-zinc-400">
              Playing automatically in{" "}
              <span className="text-white font-bold text-sm">{countdown}s</span>
            </p>

            <div className="flex items-center gap-2.5 pt-2">
              <GlassButton
                variant="primary"
                onClick={() => {
                  setShowNextOverlay(false);
                  onNextEpisode?.();
                }}
                className="text-xs py-1.5 px-4"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                Play Now
              </GlassButton>
              <button
                onClick={() => setShowNextOverlay(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-zinc-400 hover:text-white border border-white/10 hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Control Strip: Sub/Dub Switcher + Server Picker */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl glass-panel border border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 rounded-xl bg-white/5 border border-white/15">
            <button
              onClick={() => setAudioMode("sub")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                audioMode === "sub"
                  ? "bg-white text-black shadow-glow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              SUB
            </button>
            <button
              onClick={() => setAudioMode("dub")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                audioMode === "dub"
                  ? "bg-white text-black shadow-glow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              DUB
            </button>
          </div>

          <span className="text-xs text-zinc-300 font-semibold px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
            S{season} : Ep {episode} {totalEpisodes ? `/ ${totalEpisodes}` : ""}
          </span>
        </div>

        {/* Server Failover Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {SERVERS.map((server, idx) => (
            <button
              key={server.id}
              onClick={() => setCurrentServer(idx)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                currentServer === idx
                  ? "bg-white text-black font-bold shadow-glow"
                  : "bg-white/5 text-zinc-400 hover:text-white"
              }`}
            >
              {server.name.split(" ")[0]}
            </button>
          ))}

          <button
            onClick={() => setCurrentServer((prev) => (prev + 1) % SERVERS.length)}
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
