"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Hls from "hls.js";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  PictureInPicture2,
  Gauge,
  Loader2,
} from "lucide-react";

interface GlassVideoPlayerProps {
  src: string;
  poster?: string;
  isLive?: boolean;
}

export const GlassVideoPlayer = ({ src, poster, isLive = false }: GlassVideoPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [skipNotice, setSkipNotice] = useState<"-10s" | "+10s" | null>(null);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapRef = useRef<{ time: number; side: "left" | "right" | null }>({
    time: 0,
    side: null,
  });

  // HLS stream loader or fallback to standard MP4
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let hls: Hls | null = null;
    setIsBuffering(true);

    if (src.includes(".m3u8")) {
      if (Hls.isSupported()) {
        hls = new Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsBuffering(false);
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      }
    } else {
      video.src = src;
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [src]);

  // Activity timer for fading out controls
  const pingControls = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3200);
  }, [isPlaying]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
    pingControls();
  };

  const seekRelative = (delta: number) => {
    const video = videoRef.current;
    if (!video || isLive) return;
    video.currentTime = Math.min(Math.max(video.currentTime + delta, 0), video.duration || 0);
    setSkipNotice(delta > 0 ? "+10s" : "-10s");
    setTimeout(() => setSkipNotice(null), 650);
  };

  // Double-tap seek detector for touch devices
  const handleTouchZone = (side: "left" | "right") => {
    const now = Date.now();
    const prev = lastTapRef.current;
    if (now - prev.time < 300 && prev.side === side) {
      seekRelative(side === "left" ? -10 : 10);
      lastTapRef.current = { time: 0, side: null };
    } else {
      lastTapRef.current = { time: now, side };
      pingControls();
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video || isLive) return;
    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const cyclePlaybackRate = () => {
    const video = videoRef.current;
    if (!video || isLive) return;
    const rates = [1, 1.25, 1.5, 2, 0.75];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    video.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  const togglePiP = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture().catch(() => {});
    } else if (document.pictureInPictureEnabled) {
      await video.requestPictureInPicture().catch(() => {});
    }
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "00:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={pingControls}
      onClick={pingControls}
      className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black select-none group border border-white/15 shadow-2xl"
    >
      <video
        ref={videoRef}
        poster={poster}
        playsInline
        className="w-full h-full object-contain"
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => {
          setIsBuffering(false);
          setIsPlaying(true);
        }}
        onTimeUpdate={() => {
          if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) setDuration(videoRef.current.duration);
        }}
      />

      {/* Double Tap Seek Trigger Zones (Left & Right Screen Halves) */}
      <div
        className="absolute inset-y-0 left-0 w-1/3 z-20"
        onTouchStart={() => handleTouchZone("left")}
      />
      <div
        className="absolute inset-y-0 right-0 w-1/3 z-20"
        onTouchStart={() => handleTouchZone("right")}
      />

      {/* Skip Notice Ripple Indicator */}
      {skipNotice && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-in fade-in zoom-in-75 duration-200">
          <div className="px-5 py-2.5 rounded-full bg-black/80 backdrop-blur-xl border border-white/20 text-white font-extrabold text-sm shadow-[0_0_20px_rgba(255,255,255,0.4)] flex items-center gap-2">
            {skipNotice === "-10s" ? <RotateCcw className="w-4 h-4" /> : <RotateCw className="w-4 h-4" />}
            <span>{skipNotice}</span>
          </div>
        </div>
      )}

      {/* Central Spinner during Buffer */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 bg-black/40 backdrop-blur-xs">
          <Loader2 className="w-10 h-10 text-white animate-spin drop-shadow-[0_0_12px_rgba(255,255,255,0.5)]" />
        </div>
      )}

      {/* Center Play/Pause Large Tap Target */}
      <div
        onClick={togglePlay}
        className={`absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-300 ${
          !isPlaying || showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          className="p-4 rounded-full border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:scale-105 transition active:scale-95"
          style={{
            background: "rgba(12, 12, 16, 0.65)",
            backdropFilter: "blur(20px)",
          }}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white fill-white" />
          ) : (
            <Play className="w-6 h-6 text-white fill-white translate-x-0.5" />
          )}
        </button>
      </div>

      {/* Bottom Frosted Glass Console */}
      <div
        className={`absolute bottom-3 left-3 right-3 z-30 flex flex-col gap-2 p-2.5 sm:p-3 rounded-2xl border border-white/20 shadow-[0_12px_36px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.35)] transition-all duration-300 ${
          showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
        }`}
        style={{
          background: "rgba(10, 10, 14, 0.72)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
        }}
      >
        {/* Timeline Scrubber */}
        {!isLive && (
          <div className="relative flex items-center group/scrubber cursor-pointer w-full">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeekChange}
              className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-white hover:h-1.5 transition-all"
            />
          </div>
        )}

        {/* Console Buttons Strip */}
        <div className="flex items-center justify-between text-zinc-300">
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={togglePlay} className="p-1 text-white hover:text-zinc-300 transition">
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            </button>

            {!isLive && (
              <>
                <button
                  onClick={() => seekRelative(-10)}
                  title="Rewind 10s"
                  className="p-1 hover:text-white transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => seekRelative(10)}
                  title="Forward 10s"
                  className="p-1 hover:text-white transition"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            {/* Live Indicator or Time Tracker */}
            {isLive ? (
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-400 uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                Live
              </span>
            ) : (
              <span className="text-[10px] sm:text-xs font-medium text-zinc-400">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Speed Selector (VOD only) */}
            {!isLive && (
              <button
                onClick={cyclePlaybackRate}
                className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/15 transition"
              >
                <Gauge className="w-3 h-3 text-zinc-400" />
                <span>{playbackRate}x</span>
              </button>
            )}

            {/* Audio Mute */}
            <button onClick={toggleMute} className="p-1 hover:text-white transition">
              {isMuted ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-white" />}
            </button>

            {/* Picture in Picture */}
            <button onClick={togglePiP} className="p-1 hover:text-white transition" title="Picture in Picture">
              <PictureInPicture2 className="w-4 h-4" />
            </button>

            {/* Fullscreen */}
            <button onClick={toggleFullscreen} className="p-1 hover:text-white transition">
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
