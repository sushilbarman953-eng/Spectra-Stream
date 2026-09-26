"use client";

import React, { useRef, useState, useEffect } from "react";
import Hls from "hls.js";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  Loader2,
  SkipForward,
  FastForward,
  Settings,
  Star,
  ShieldAlert,
  PictureInPicture2,
  AlertCircle,
  RefreshCw,
  Check,
  Sun,
  Scaling,
  ChevronRight,
  ChevronLeft,
  X,
} from "lucide-react";
import { playbackHistory } from "@/lib/playbackHistory";
import { downloadManager } from "@/lib/downloadManager";

interface GlassVideoPlayerProps {
  src: string;
  title: string;
  tmdbId?: string;
  type?: "movie" | "tv";
  season?: number;
  episode?: number;
  offlineId?: string;
  rating?: number | string;
  certificate?: string;
  poster?: string;
  backdrop?: string;
  initialTime?: number;
  onNextEpisode?: () => void;
  introStart?: number;
  introEnd?: number;
  outroStart?: number;
}

export const GlassVideoPlayer = ({
  src,
  title,
  tmdbId,
  type = "movie",
  season,
  episode,
  offlineId,
  rating = "8.6",
  certificate = "PG-13",
  poster,
  backdrop,
  initialTime = 0,
  onNextEpisode,
  introStart = 85,
  introEnd = 175,
  outroStart,
}: GlassVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);

  // Gestures & HUD states
  const [brightness, setBrightness] = useState<number>(100);
  const [volumeLevel, setVolumeLevel] = useState<number>(100);
  const [hudIndicator, setHudIndicator] = useState<{ type: "brightness" | "volume"; value: number } | null>(null);
  const [seekHud, setSeekHud] = useState<{ targetTime: number; delta: number } | null>(null);
  const [doubleTapFeedback, setDoubleTapFeedback] = useState<"left" | "right" | null>(null);
  const [objectFit, setObjectFit] = useState<"contain" | "cover">("contain");

  // Skip & Auto-next countdown
  const [inIntro, setInIntro] = useState(false);
  const [inOutro, setInOutro] = useState(false);
  const [autoNextCountdown, setAutoNextCountdown] = useState<number | null>(null);
  const autoNextFired = useRef<boolean>(false);

  // Settings
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [qualityLevels, setQualityLevels] = useState<{ id: number; height: number; bitrate: number }[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1);

  const lastSavedTime = useRef<number>(0);
  const lastTapRef = useRef<{ time: number; x: number }>({ time: 0, x: 0 });
  const touchStartRef = useRef<{
    x: number;
    y: number;
    isLeft: boolean;
    initialVideoTime: number;
    mode: "undecided" | "horizontal" | "vertical";
  } | null>(null);
  const hudTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerUserActivity = () => {
    setShowControls(true);
    if (controlsTimeout) clearTimeout(controlsTimeout);
    const timeout = setTimeout(() => {
      if (isPlaying && !showSettings && !seekHud) setShowControls(false);
    }, 3500);
    setControlsTimeout(timeout);
  };

  // Video stream initialization (Offline Blob vs Online HLS/MP4)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isDisposed = false;
    setLoading(true);
    setHasError(false);
    autoNextFired.current = false;
    setAutoNextCountdown(null);

    const initStream = async () => {
      // 1. Check if Offline Mode Requested
      if (offlineId) {
        const offlineUrl = await downloadManager.getOfflineBlobUrl(offlineId);
        if (offlineUrl && !isDisposed) {
          video.src = offlineUrl;
          video.oncanplay = () => setLoading(false);
          return;
        }
      }

      if (!src) return;

      if (hlsRef.current) {
        try {
          hlsRef.current.destroy();
        } catch {}
        hlsRef.current = null;
      }

      const isHls = src.includes(".m3u8") || src.includes("live") || src.includes("hls");

      if (isHls && Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
        hlsRef.current = hls;
        hls.loadSource(src);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
          if (isDisposed) return;
          setLoading(false);
          if (initialTime > 0) video.currentTime = initialTime;
          setQualityLevels(
            data.levels.map((lvl, index) => ({
              id: index,
              height: lvl.height,
              bitrate: lvl.bitrate,
            }))
          );
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (isDisposed) return;
          if (data.fatal) {
            setHasError(true);
            setErrorMessage("Stream error encountered.");
            setLoading(false);
          }
        });
      } else {
        video.src = src;
        video.oncanplay = () => {
          if (!isDisposed) {
            setLoading(false);
            if (initialTime > 0) video.currentTime = initialTime;
          }
        };
      }
    };

    initStream();

    return () => {
      isDisposed = true;
      if (hlsRef.current) {
        try {
          hlsRef.current.destroy();
        } catch {}
        hlsRef.current = null;
      }
      if (video) {
        try {
          video.pause();
          video.src = "";
        } catch {}
      }
    };
  }, [src, offlineId, initialTime]);

  // Next Episode Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoNextCountdown !== null && autoNextCountdown > 0) {
      timer = setTimeout(() => {
        setAutoNextCountdown(autoNextCountdown - 1);
      }, 1000);
    } else if (autoNextCountdown === 0 && onNextEpisode && !autoNextFired.current) {
      autoNextFired.current = true;
      onNextEpisode();
    }
    return () => clearTimeout(timer);
  }, [autoNextCountdown, onNextEpisode]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const curr = video.currentTime;
    const dur = video.duration || 0;
    setCurrentTime(curr);
    setDuration(dur);

    // Intro trigger
    setInIntro(curr >= introStart && curr <= introEnd);

    // Outro trigger & Next Episode Countdown
    const computedOutro = outroStart || (dur > 120 ? dur - 80 : 0);
    const inOutroZone = computedOutro > 0 && curr >= computedOutro && curr < dur - 5;
    setInOutro(inOutroZone);

    if (inOutroZone && onNextEpisode && autoNextCountdown === null && !autoNextFired.current) {
      setAutoNextCountdown(10);
    }

    if (video.buffered.length > 0 && dur > 0) {
      setBuffered((video.buffered.end(video.buffered.length - 1) / dur) * 100);
    }

    if (tmdbId && dur > 0 && Math.abs(curr - lastSavedTime.current) > 5) {
      lastSavedTime.current = curr;
      playbackHistory.saveProgress({
        id: type === "tv" ? `${tmdbId}-s${season || 1}-e${episode || 1}` : `${tmdbId}-movie`,
        tmdbId,
        type,
        title,
        season,
        episode,
        currentTime: curr,
        duration: dur,
        posterPath: poster,
        backdropPath: backdrop,
      });
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video || hasError) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
    triggerUserActivity();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const togglePiP = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch {}
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const seek = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.duration || 0, time));
    triggerUserActivity();
  };

  // TOUCH SCRUB & GESTURE SYSTEM
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    triggerUserActivity();
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const isLeft = x < rect.width / 2;

    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      isLeft,
      initialVideoTime: videoRef.current ? videoRef.current.currentTime : 0,
      mode: "undecided",
    };

    const now = Date.now();
    if (now - lastTapRef.current.time < 300) {
      if (isLeft) {
        seek(currentTime - 10);
        setDoubleTapFeedback("left");
      } else {
        seek(currentTime + 10);
        setDoubleTapFeedback("right");
      }
      setTimeout(() => setDoubleTapFeedback(null), 600);
      lastTapRef.current = { time: 0, x: 0 };
    } else {
      lastTapRef.current = { time: now, x };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touchStartRef.current.y - touch.clientY;

    if (touchStartRef.current.mode === "undecided") {
      if (Math.abs(deltaX) > 12) {
        touchStartRef.current.mode = "horizontal";
      } else if (Math.abs(deltaY) > 12) {
        touchStartRef.current.mode = "vertical";
      }
    }

    if (touchStartRef.current.mode === "horizontal") {
      if (!duration || duration <= 0) return;
      const seekSecondsDelta = Math.round(deltaX * 0.35);
      const target = Math.max(0, Math.min(duration, touchStartRef.current.initialVideoTime + seekSecondsDelta));
      setSeekHud({ targetTime: target, delta: seekSecondsDelta });
      return;
    }

    if (touchStartRef.current.mode === "vertical") {
      const step = (deltaY / 200) * 100;
      if (touchStartRef.current.isLeft) {
        setBrightness((prev) => {
          const updated = Math.min(160, Math.max(30, Math.round(prev + step * 0.08)));
          setHudIndicator({ type: "brightness", value: updated });
          return updated;
        });
      } else {
        setVolumeLevel((prev) => {
          const updated = Math.min(100, Math.max(0, Math.round(prev + step * 0.08)));
          if (videoRef.current) {
            videoRef.current.volume = updated / 100;
            videoRef.current.muted = updated === 0;
            setIsMuted(updated === 0);
          }
          setHudIndicator({ type: "volume", value: updated });
          return updated;
        });
      }
      if (hudTimeoutRef.current) clearTimeout(hudTimeoutRef.current);
      hudTimeoutRef.current = setTimeout(() => setHudIndicator(null), 1000);
    }
  };

  const handleTouchEnd = () => {
    if (touchStartRef.current?.mode === "horizontal" && seekHud) {
      seek(seekHud.targetTime);
      setSeekHud(null);
    }
    touchStartRef.current = null;
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={triggerUserActivity}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative aspect-video w-full rounded-3xl overflow-hidden bg-black border border-white/20 shadow-2xl group select-none"
    >
      <video
        ref={videoRef}
        playsInline
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onWaiting={() => setLoading(true)}
        onPlaying={() => {
          setLoading(false);
          setIsPlaying(true);
        }}
        onError={(e) => {
          const target = e.target as HTMLVideoElement;
          if (!target.currentSrc && !target.src) return;
          setHasError(true);
          setErrorMessage("Failed to decode media source.");
          setLoading(false);
        }}
        onClick={togglePlay}
        style={{
          filter: `brightness(${brightness}%)`,
          objectFit: objectFit,
        }}
        className="w-full h-full cursor-pointer transition-all duration-150"
      />

      {/* AUTO-PLAY NEXT EPISODE COUNTDOWN OVERLAY */}
      {autoNextCountdown !== null && onNextEpisode && (
        <div className="absolute top-4 right-4 z-40 animate-in fade-in zoom-in-95 duration-200">
          <div
            className="flex items-center gap-3 p-3 rounded-2xl border border-white/25 shadow-2xl"
            style={{
              background: "rgba(10, 10, 16, 0.85)",
              backdropFilter: "blur(24px) saturate(180%)",
            }}
          >
            <div className="relative w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center font-black text-xs text-white">
              <span>{autoNextCountdown}</span>
            </div>
            <div>
              <p className="text-[10px] text-zinc-400 font-semibold">Up Next</p>
              <h4 className="text-xs font-bold text-white">Next Episode</h4>
            </div>
            <div className="flex items-center gap-1.5 pl-2">
              <button
                onClick={onNextEpisode}
                className="px-2.5 py-1 rounded-xl bg-white text-black font-extrabold text-[10px] shadow-glow"
              >
                Play Now
              </button>
              <button
                onClick={() => setAutoNextCountdown(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
                title="Cancel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HORIZONTAL SCRUB SEEK HUD */}
      {seekHud && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <div
            className="flex flex-col items-center gap-2.5 px-6 py-4 rounded-3xl border border-white/25 shadow-[0_24px_50px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.4)]"
            style={{
              background: "rgba(12, 12, 20, 0.72)",
              backdropFilter: "blur(32px) saturate(200%)",
            }}
          >
            <div className="flex items-center gap-1.5">
              {seekHud.delta >= 0 ? (
                <ChevronRight className="w-5 h-5 text-emerald-400 animate-pulse stroke-[3]" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-amber-400 animate-pulse stroke-[3]" />
              )}
              <span
                className={`text-lg font-black tracking-wider ${
                  seekHud.delta >= 0 ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {seekHud.delta >= 0 ? `+${seekHud.delta}s` : `${seekHud.delta}s`}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white">
              <span>{formatTime(seekHud.targetTime)}</span>
              <span className="text-zinc-500">/</span>
              <span className="text-zinc-400">{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      )}

      {/* VERTICAL HUD (BRIGHTNESS / VOLUME) */}
      {hudIndicator && !seekHud && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <div
            className="flex flex-col items-center gap-2 px-5 py-3.5 rounded-3xl border border-white/25 shadow-2xl"
            style={{
              background: "rgba(12, 12, 20, 0.72)",
              backdropFilter: "blur(32px) saturate(200%)",
            }}
          >
            {hudIndicator.type === "brightness" ? (
              <Sun className="w-6 h-6 text-white" />
            ) : (
              <Volume2 className="w-6 h-6 text-white" />
            )}
            <div className="w-28 h-1.5 bg-white/15 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-white shadow-glow transition-all"
                style={{
                  width: `${
                    hudIndicator.type === "brightness"
                      ? Math.min(100, Math.round((hudIndicator.value / 160) * 100))
                      : hudIndicator.value
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* DOUBLE TAP FEEDBACK */}
      {doubleTapFeedback === "left" && (
        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-2xl border border-white/30 text-white font-black text-xs shadow-glow pointer-events-none z-30">
          <RotateCcw className="w-4 h-4 animate-spin" />
          <span>-10s</span>
        </div>
      )}
      {doubleTapFeedback === "right" && (
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-2xl border border-white/30 text-white font-black text-xs shadow-glow pointer-events-none z-30">
          <span>+10s</span>
          <RotateCw className="w-4 h-4 animate-spin" />
        </div>
      )}

      {/* Loading Overlay */}
      {loading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none z-10">
          <Loader2 className="w-10 h-10 animate-spin text-white" />
        </div>
      )}

      {/* Center Play Button */}
      {!loading && !hasError && !seekHud && (
        <div
          onClick={togglePlay}
          className={`absolute inset-0 flex items-center justify-center pointer-events-auto cursor-pointer transition-all duration-300 ${
            !isPlaying || showControls ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
          }`}
        >
          <div className="p-4 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/30 text-white shadow-glow active:scale-90 transition-transform">
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-white text-white" />
            ) : (
              <Play className="w-8 h-8 fill-white text-white translate-x-0.5" />
            )}
          </div>
        </div>
      )}

      {/* Frosted Controls Overlay */}
      {!hasError && (
        <div
          className={`absolute inset-0 flex flex-col justify-between p-3.5 sm:p-5 bg-gradient-to-t from-black/90 via-transparent to-black/80 transition-opacity duration-300 pointer-events-none z-20 ${
            showControls && !seekHud ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Top Title & Badges */}
          <div className="flex flex-col gap-1.5 pointer-events-auto">
            <h2 className="text-xs sm:text-base font-extrabold text-white tracking-wide truncate">
              {title}
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs font-bold text-white shadow-sm">
                <Star className="w-3 h-3 fill-white text-white" />
                <span>{rating}</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs font-black text-zinc-200 uppercase tracking-wider">
                <ShieldAlert className="w-3 h-3 text-zinc-300" />
                <span>{certificate}</span>
              </div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="space-y-2 pointer-events-auto">
            {/* Skip Buttons */}
            <div className="flex items-center justify-end gap-2 pb-0.5">
              {inIntro && (
                <button
                  onClick={() => seek(introEnd + 1)}
                  className="px-3 py-1 rounded-xl bg-white/25 hover:bg-white text-white hover:text-black backdrop-blur-xl border border-white/40 font-extrabold text-[11px] shadow-glow flex items-center gap-1 transition active:scale-95"
                >
                  <SkipForward className="w-3 h-3" />
                  <span>Skip Intro</span>
                </button>
              )}
              {inOutro && (
                <button
                  onClick={() => seek(duration - 5)}
                  className="px-3 py-1 rounded-xl bg-white/25 hover:bg-white text-white hover:text-black backdrop-blur-xl border border-white/40 font-extrabold text-[11px] shadow-glow flex items-center gap-1 transition active:scale-95"
                >
                  <FastForward className="w-3 h-3" />
                  <span>Skip Outro</span>
                </button>
              )}
              {onNextEpisode && (
                <button
                  onClick={onNextEpisode}
                  className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white text-zinc-200 hover:text-black backdrop-blur-xl border border-white/20 font-bold text-[11px] flex items-center gap-1 transition active:scale-95"
                >
                  <SkipForward className="w-3 h-3" />
                  <span>Next Episode</span>
                </button>
              )}
            </div>

            {/* Timeline Bar */}
            <div className="relative w-full h-1.5 sm:h-2 bg-white/20 hover:h-2.5 rounded-full overflow-hidden cursor-pointer transition-all">
              <div className="absolute left-0 top-0 bottom-0 bg-white/30" style={{ width: `${buffered}%` }} />
              <div
                className="absolute left-0 top-0 bottom-0 bg-white shadow-glow"
                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
              />
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={(e) => seek(parseFloat(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between text-xs text-white pt-1">
              <div className="flex items-center gap-2.5 sm:gap-4">
                <button onClick={togglePlay} className="p-1 hover:text-zinc-300 active:scale-90 transition">
                  {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                </button>
                <button onClick={() => seek(currentTime - 10)} className="p-1 hover:text-zinc-300">
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button onClick={() => seek(currentTime + 10)} className="p-1 hover:text-zinc-300">
                  <RotateCw className="w-4 h-4" />
                </button>
                <span className="text-[10px] sm:text-xs text-zinc-300 font-mono font-medium">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3.5 relative">
                <button
                  onClick={() => setObjectFit(objectFit === "contain" ? "cover" : "contain")}
                  className={`p-1 transition ${objectFit === "cover" ? "text-white" : "text-zinc-400 hover:text-white"}`}
                  title="Aspect: Fill/Fit"
                >
                  <Scaling className="w-4 h-4" />
                </button>
                <button onClick={toggleMute} className="p-1 hover:text-zinc-300">
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button onClick={togglePiP} className="p-1 hover:text-zinc-300">
                  <PictureInPicture2 className="w-4 h-4" />
                </button>
                <button onClick={toggleFullscreen} className="p-1 hover:text-zinc-300">
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
