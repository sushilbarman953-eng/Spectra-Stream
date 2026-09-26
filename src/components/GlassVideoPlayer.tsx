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
} from "lucide-react";
import { playbackHistory } from "@/lib/playbackHistory";

interface GlassVideoPlayerProps {
  src: string;
  title: string;
  tmdbId?: string;
  type?: "movie" | "tv";
  season?: number;
  episode?: number;
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

  // Skip states
  const [inIntro, setInIntro] = useState(false);
  const [inOutro, setInOutro] = useState(false);

  // Settings menu state
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [qualityLevels, setQualityLevels] = useState<{ id: number; height: number; bitrate: number }[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1); // -1 = Auto

  const lastSavedTime = useRef<number>(0);

  // Auto-hide controls timer
  const triggerUserActivity = () => {
    setShowControls(true);
    if (controlsTimeout) clearTimeout(controlsTimeout);
    const timeout = setTimeout(() => {
      if (isPlaying && !showSettings) setShowControls(false);
    }, 3500);
    setControlsTimeout(timeout);
  };

  // Setup HLS / Stream
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let isDisposed = false;
    setLoading(true);
    setHasError(false);

    if (hlsRef.current) {
      try {
        hlsRef.current.destroy();
      } catch {}
      hlsRef.current = null;
    }

    const isHls = src.includes(".m3u8") || src.includes("live") || src.includes("hls");

    if (isHls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60,
      });

      hlsRef.current = hls;

      try {
        hls.loadSource(src);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
          if (isDisposed) return;
          setLoading(false);
          if (initialTime > 0) {
            try {
              video.currentTime = initialTime;
            } catch {}
          }
          // Populate available resolutions
          const levels = data.levels.map((lvl, index) => ({
            id: index,
            height: lvl.height,
            bitrate: lvl.bitrate,
          }));
          setQualityLevels(levels);
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (isDisposed) return;
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                setHasError(true);
                setErrorMessage("Unable to connect to stream feed.");
                setLoading(false);
                break;
            }
          }
        });
      } catch {
        setHasError(true);
        setLoading(false);
      }
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      const onLoadedMetadata = () => {
        if (!isDisposed) {
          setLoading(false);
          if (initialTime > 0) video.currentTime = initialTime;
        }
      };
      video.addEventListener("loadedmetadata", onLoadedMetadata, { once: true });
    } else if (!isHls) {
      video.src = src;
      const onCanPlay = () => {
        if (!isDisposed) setLoading(false);
      };
      video.addEventListener("canplay", onCanPlay, { once: true });
    }

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
  }, [src, initialTime]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const curr = video.currentTime;
    const dur = video.duration || 0;
    setCurrentTime(curr);
    setDuration(dur);

    // Intro window
    setInIntro(curr >= introStart && curr <= introEnd);

    // Outro window: default to last 90 seconds if not provided
    const computedOutro = outroStart || (dur > 120 ? dur - 90 : 0);
    setInOutro(computedOutro > 0 && curr >= computedOutro && curr < dur - 5);

    if (video.buffered.length > 0 && dur > 0) {
      setBuffered((video.buffered.end(video.buffered.length - 1) / dur) * 100);
    }

    // Save playback progress every 5 seconds
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
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
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
      } else if (video !== document.pictureInPictureElement) {
        await video.requestPictureInPicture();
      }
    } catch (err) {
      console.error("PiP error:", err);
    }
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

  const changeSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  };

  const changeQuality = (levelIndex: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIndex;
      setCurrentQuality(levelIndex);
    }
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
      onTouchStart={triggerUserActivity}
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
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Loading Spinner */}
      {loading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none z-10">
          <Loader2 className="w-10 h-10 animate-spin text-white" />
        </div>
      )}

      {/* Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#09090e]/95 p-6 text-center space-y-3 z-30">
          <div className="p-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Playback Error</h4>
            <p className="text-xs text-zinc-400 max-w-sm mt-1">{errorMessage}</p>
          </div>
          <button
            onClick={() => {
              setHasError(false);
              setLoading(true);
              if (hlsRef.current) hlsRef.current.loadSource(src);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-black font-bold text-xs shadow-glow active:scale-95 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* CENTER PLAY BUTTON */}
      {!loading && !hasError && (
        <div
          onClick={togglePlay}
          className={`absolute inset-0 flex items-center justify-center pointer-events-auto cursor-pointer transition-all duration-300 ${
            !isPlaying || showControls ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
          }`}
        >
          <div className="p-4 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/30 text-white shadow-[0_0_30px_rgba(255,255,255,0.4)] active:scale-90 transition-transform">
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-white text-white" />
            ) : (
              <Play className="w-8 h-8 fill-white text-white translate-x-0.5" />
            )}
          </div>
        </div>
      )}

      {/* FROSTED GLASS CONTROLS OVERLAY */}
      {!hasError && (
        <div
          className={`absolute inset-0 flex flex-col justify-between p-3.5 sm:p-5 bg-gradient-to-t from-black/90 via-transparent to-black/80 transition-opacity duration-300 pointer-events-none z-20 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* TOP GLASS STRIP: Title & Badges */}
          <div className="flex flex-col gap-1.5 pointer-events-auto">
            <h2 className="text-xs sm:text-base font-extrabold text-white tracking-wide truncate drop-shadow-md">
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

          {/* BOTTOM CONTROLS & SKIP ACTIONS */}
          <div className="space-y-2 pointer-events-auto">
            {/* SKIP INTRO / OUTRO / NEXT EPISODE (Aligned right above timeline) */}
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

            {/* TIMELINE SLIDER */}
            <div className="relative w-full h-1.5 sm:h-2 bg-white/20 hover:h-2.5 rounded-full overflow-hidden cursor-pointer transition-all">
              <div
                className="absolute left-0 top-0 bottom-0 bg-white/30"
                style={{ width: `${buffered}%` }}
              />
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

            {/* CONTROL BAR */}
            <div className="flex items-center justify-between text-xs text-white pt-1">
              {/* Left Controls: Play/Pause, -10s, +10s, Time */}
              <div className="flex items-center gap-2.5 sm:gap-4">
                <button onClick={togglePlay} className="p-1 hover:text-zinc-300 active:scale-90 transition">
                  {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                </button>

                <button onClick={() => seek(currentTime - 10)} className="p-1 hover:text-zinc-300 active:scale-90 transition" title="Rewind 10s">
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button onClick={() => seek(currentTime + 10)} className="p-1 hover:text-zinc-300 active:scale-90 transition" title="Forward 10s">
                  <RotateCw className="w-4 h-4" />
                </button>

                <span className="text-[10px] sm:text-xs text-zinc-300 font-mono font-medium">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Right Controls: Volume, PiP, Settings, Fullscreen */}
              <div className="flex items-center gap-2 sm:gap-3.5 relative">
                <button onClick={toggleMute} className="p-1 hover:text-zinc-300 active:scale-90 transition">
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <button onClick={togglePiP} className="p-1 hover:text-zinc-300 active:scale-90 transition" title="Picture in Picture">
                  <PictureInPicture2 className="w-4 h-4" />
                </button>

                {/* Settings Toggle */}
                <div className="relative">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`p-1 hover:text-zinc-300 active:scale-90 transition ${
                      showSettings ? "text-white rotate-45" : "text-zinc-300"
                    }`}
                    title="Playback Settings"
                  >
                    <Settings className="w-4 h-4 transition-transform" />
                  </button>

                  {/* Settings Modal Popover */}
                  {showSettings && (
                    <div className="absolute bottom-9 right-0 w-44 rounded-2xl p-2.5 bg-[#0a0a0f]/95 backdrop-blur-2xl border border-white/20 shadow-2xl space-y-2.5 z-40 text-left">
                      {/* Speed Settings */}
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-1">
                          Speed
                        </span>
                        <div className="grid grid-cols-3 gap-1 mt-1">
                          {[0.75, 1, 1.25, 1.5, 2].map((spd) => (
                            <button
                              key={spd}
                              onClick={() => changeSpeed(spd)}
                              className={`py-0.5 text-[10px] rounded font-semibold border transition ${
                                playbackSpeed === spd
                                  ? "bg-white text-black border-white"
                                  : "bg-white/5 text-zinc-300 border-white/10 hover:text-white"
                              }`}
                            >
                              {spd === 1 ? "Normal" : `${spd}x`}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quality Settings */}
                      {qualityLevels.length > 0 && (
                        <div className="pt-1.5 border-t border-white/10">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-1">
                            Quality
                          </span>
                          <div className="space-y-1 mt-1 max-h-24 overflow-y-auto no-scrollbar">
                            <button
                              onClick={() => changeQuality(-1)}
                              className={`w-full flex items-center justify-between px-2 py-1 rounded text-[10px] font-semibold ${
                                currentQuality === -1 ? "bg-white/20 text-white font-bold" : "text-zinc-400 hover:text-white"
                              }`}
                            >
                              <span>Auto</span>
                              {currentQuality === -1 && <Check className="w-3 h-3 text-white" />}
                            </button>
                            {qualityLevels.map((lvl) => (
                              <button
                                key={lvl.id}
                                onClick={() => changeQuality(lvl.id)}
                                className={`w-full flex items-center justify-between px-2 py-1 rounded text-[10px] font-semibold ${
                                  currentQuality === lvl.id ? "bg-white/20 text-white font-bold" : "text-zinc-400 hover:text-white"
                                }`}
                              >
                                <span>{lvl.height}p</span>
                                {currentQuality === lvl.id && <Check className="w-3 h-3 text-white" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button onClick={toggleFullscreen} className="p-1 hover:text-zinc-300 active:scale-90 transition">
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
