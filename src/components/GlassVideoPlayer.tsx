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
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { playbackHistory } from "@/lib/playbackHistory";

interface GlassVideoPlayerProps {
  src: string;
  title: string;
  tmdbId?: string;
  type?: "movie" | "tv";
  season?: number;
  episode?: number;
  poster?: string;
  backdrop?: string;
  initialTime?: number;
  onNextEpisode?: () => void;
  introStart?: number;
  introEnd?: number;
}

export const GlassVideoPlayer = ({
  src,
  title,
  tmdbId,
  type = "movie",
  season,
  episode,
  poster,
  backdrop,
  initialTime = 0,
  onNextEpisode,
  introStart = 85,
  introEnd = 170,
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
  const [inIntro, setInIntro] = useState(false);

  const lastSavedTime = useRef<number>(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let isDisposed = false;
    setLoading(true);
    setHasError(false);
    setErrorMessage("");

    // Destroy existing Hls instance if any
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

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (isDisposed) return;
          setLoading(false);
          if (initialTime > 0) {
            try {
              video.currentTime = initialTime;
            } catch {}
          }
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
                setErrorMessage("Live stream currently unavailable. Please select another channel.");
                setLoading(false);
                try {
                  hls.destroy();
                } catch {}
                break;
            }
          }
        });
      } catch {
        setHasError(true);
        setErrorMessage("Error initializing stream engine.");
        setLoading(false);
      }
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native Safari / iOS HLS
      video.src = src;
      const onLoadedMetadata = () => {
        if (!isDisposed) {
          setLoading(false);
          if (initialTime > 0) {
            try {
              video.currentTime = initialTime;
            } catch {}
          }
        }
      };
      video.addEventListener("loadedmetadata", onLoadedMetadata, { once: true });
    } else if (!isHls) {
      // Standard video formats (.mp4, .webm)
      video.src = src;
      const onCanPlay = () => {
        if (!isDisposed) setLoading(false);
      };
      video.addEventListener("canplay", onCanPlay, { once: true });
    } else {
      setHasError(true);
      setErrorMessage("HLS playback is not supported on this browser.");
      setLoading(false);
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
          // Avoid removeAttribute('src') and video.load() which trigger NotSupportedError
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

    setInIntro(curr >= introStart && curr <= introEnd);

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
      try {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        }
      } catch {}
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
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
    try {
      video.currentTime = Math.max(0, Math.min(video.duration || 0, time));
    } catch {}
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
      onMouseMove={() => setShowControls(true)}
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
          // Suppress empty source cleanup errors
          const target = e.target as HTMLVideoElement;
          if (!target.currentSrc && !target.src) return;
          setHasError(true);
          setErrorMessage("Failed to load stream source. Please select another channel.");
          setLoading(false);
        }}
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Loading Overlay */}
      {loading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      )}

      {/* Error Fallback Banner */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#09090e]/95 p-6 text-center space-y-3 z-30">
          <div className="p-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Stream Unavailable</h4>
            <p className="text-xs text-zinc-400 max-w-sm mt-1">{errorMessage}</p>
          </div>
          <button
            onClick={() => {
              setHasError(false);
              setLoading(true);
              if (hlsRef.current) {
                hlsRef.current.loadSource(src);
              } else if (videoRef.current) {
                videoRef.current.src = src;
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-black font-bold text-xs shadow-glow active:scale-95 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      {/* Skip Intro Button */}
      {inIntro && (
        <button
          onClick={() => seek(introEnd + 1)}
          className="absolute bottom-20 right-5 z-30 px-3.5 py-1.5 rounded-xl bg-white text-black font-extrabold text-xs shadow-glow flex items-center gap-1.5 transition active:scale-95"
        >
          <SkipForward className="w-3.5 h-3.5 fill-black" />
          <span>Skip Intro</span>
        </button>
      )}

      {/* Frosted Glass Overlay Controls */}
      {!hasError && (
        <div
          className={`absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-t from-black/80 via-transparent to-black/60 transition-opacity duration-300 ${
            showControls ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Top Header */}
          <div className="flex items-center justify-between text-xs text-white drop-shadow-md">
            <span className="font-bold truncate max-w-sm">{title}</span>
            {onNextEpisode && (
              <button
                onClick={onNextEpisode}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-[10px] font-semibold flex items-center gap-1"
              >
                <SkipForward className="w-3 h-3" />
                <span>Next Ep</span>
              </button>
            )}
          </div>

          {/* Bottom Bar: Timeline + Controls */}
          <div className="space-y-2">
            {duration > 0 && (
              <div className="relative w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                <div
                  className="absolute left-0 top-0 bottom-0 bg-white/30"
                  style={{ width: `${buffered}%` }}
                />
                <div
                  className="absolute left-0 top-0 bottom-0 bg-white shadow-glow"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
                <input
                  type="range"
                  min={0}
                  max={duration}
                  value={currentTime}
                  onChange={(e) => seek(parseFloat(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-3">
                <button onClick={togglePlay} className="p-1 hover:text-zinc-300">
                  {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                </button>

                {duration > 0 && (
                  <>
                    <button onClick={() => seek(currentTime - 10)} className="p-1 hover:text-zinc-300">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => seek(currentTime + 10)} className="p-1 hover:text-zinc-300">
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}

                <button onClick={toggleMute} className="p-1 hover:text-zinc-300">
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {duration > 0 ? (
                  <span className="text-[11px] text-zinc-300 font-mono">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                ) : (
                  <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    Live Broadcast
                  </span>
                )}
              </div>

              <button onClick={toggleFullscreen} className="p-1 hover:text-zinc-300">
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
