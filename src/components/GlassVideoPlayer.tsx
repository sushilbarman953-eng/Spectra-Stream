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
  Settings,
  Check,
  ChevronRight,
  ArrowLeft,
  Loader2,
  Subtitles,
  Languages,
  Film,
  Gauge,
  StepForward,
} from "lucide-react";
import { watchProgress } from "@/lib/watchProgress";

interface GlassVideoPlayerProps {
  id?: string;
  type?: "movie" | "tv";
  season?: number;
  episode?: number;
  src: string;
  poster?: string;
  isLive?: boolean;
  onEnded?: () => void;
}

interface TrackOption {
  id: number;
  label: string;
}

export const GlassVideoPlayer = ({
  id,
  type = "movie",
  season = 1,
  episode = 1,
  src,
  poster,
  isLive = false,
  onEnded,
}: GlassVideoPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [skipNotice, setSkipNotice] = useState<"-10s" | "+10s" | null>(null);

  // Skip Intro / Outro Buttons
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [showSkipOutro, setShowSkipOutro] = useState(false);

  // Settings Menu Navigation
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<"root" | "quality" | "audio" | "captions" | "speed">("root");

  const [qualities, setQualities] = useState<TrackOption[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<number>(-1);
  const [audioTracks, setAudioTracks] = useState<TrackOption[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<number>(0);
  const [captionTracks, setCaptionTracks] = useState<TrackOption[]>([]);
  const [selectedCaption, setSelectedCaption] = useState<number>(-1);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapRef = useRef<{ time: number; side: "left" | "right" | null }>({
    time: 0,
    side: null,
  });

  // Resume check
  useEffect(() => {
    if (!id || isLive) return;
    const prev = watchProgress.get(id, season, episode);
    if (prev && prev.currentTime > 10 && prev.progressPercent < 90 && videoRef.current) {
      videoRef.current.currentTime = prev.currentTime;
    }
  }, [id, season, episode, isLive]);

  // Initialize HLS / MP4
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let hls: Hls | null = null;
    setIsBuffering(true);

    if (src.includes(".m3u8")) {
      if (Hls.isSupported()) {
        hls = new Hls({ enableWorker: true, lowLatencyMode: true });
        hlsRef.current = hls;
        hls.loadSource(src);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsBuffering(false);
          if (hls && hls.levels.length > 0) {
            setQualities([
              { id: -1, label: "Auto" },
              ...hls.levels.map((lvl, idx) => ({
                id: idx,
                label: lvl.height ? `${lvl.height}p` : `Level ${idx + 1}`,
              })),
            ]);
          }
          if (hls && hls.audioTracks.length > 0) {
            setAudioTracks(
              hls.audioTracks.map((trk) => ({
                id: trk.id,
                label: trk.name || trk.lang || `Track ${trk.id + 1}`,
              }))
            );
          }
          if (hls && hls.subtitleTracks.length > 0) {
            setCaptionTracks([
              { id: -1, label: "Off" },
              ...hls.subtitleTracks.map((sub) => ({
                id: sub.id,
                label: sub.name || sub.lang || `Sub ${sub.id + 1}`,
              })),
            ]);
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      }
    } else {
      video.src = src;
    }

    return () => {
      if (hls) hls.destroy();
      hlsRef.current = null;
    };
  }, [src]);

  const pingControls = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !settingsOpen) setShowControls(false);
    }, 3500);
  }, [isPlaying, settingsOpen]);

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

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    const cur = video.currentTime;
    const dur = video.duration || 0;
    setCurrentTime(cur);

    if (id && dur > 0 && !isLive) {
      watchProgress.save(id, type, season, episode, cur, dur);
    }

    // Skip states
    setShowSkipIntro(cur >= 10 && cur <= 110);
    if (dur > 0) {
      setShowSkipOutro(cur >= dur - 130 && cur < dur - 20);
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
      className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black select-none border border-white/15 shadow-2xl"
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
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (videoRef.current) setDuration(videoRef.current.duration);
        }}
        onEnded={onEnded}
      />

      {/* Skip Intro Button */}
      {showSkipIntro && (
        <button
          onClick={() => {
            if (videoRef.current) videoRef.current.currentTime += 85;
            setShowSkipIntro(false);
          }}
          className="absolute bottom-16 left-4 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/30 text-xs font-bold text-white shadow-glow animate-in fade-in"
          style={{ background: "rgba(12, 12, 16, 0.85)", backdropFilter: "blur(20px)" }}
        >
          <StepForward className="w-3.5 h-3.5 fill-white" />
          <span>Skip Intro (+85s)</span>
        </button>
      )}

      {/* Skip Outro Button */}
      {showSkipOutro && (
        <button
          onClick={() => {
            if (videoRef.current) videoRef.current.currentTime = (duration || 0) - 5;
            setShowSkipOutro(false);
          }}
          className="absolute bottom-16 right-4 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/30 text-xs font-bold text-white shadow-glow animate-in fade-in"
          style={{ background: "rgba(12, 12, 16, 0.85)", backdropFilter: "blur(20px)" }}
        >
          <StepForward className="w-3.5 h-3.5 fill-white" />
          <span>Skip Outro</span>
        </button>
      )}

      {/* Skip Feedback */}
      {skipNotice && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="px-5 py-2.5 rounded-full bg-black/80 backdrop-blur-xl border border-white/20 text-white font-extrabold text-sm shadow-[0_0_20px_rgba(255,255,255,0.4)] flex items-center gap-2">
            {skipNotice === "-10s" ? <RotateCcw className="w-4 h-4" /> : <RotateCw className="w-4 h-4" />}
            <span>{skipNotice}</span>
          </div>
        </div>
      )}

      {/* Center Spinner */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 bg-black/40">
          <Loader2 className="w-10 h-10 text-white animate-spin drop-shadow-[0_0_12px_rgba(255,255,255,0.5)]" />
        </div>
      )}

      {/* Center Play Button */}
      <div
        onClick={togglePlay}
        className={`absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-300 ${
          !isPlaying || showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          className="p-4 rounded-full border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.8)] hover:scale-105 transition"
          style={{ background: "rgba(12, 12, 16, 0.65)", backdropFilter: "blur(20px)" }}
        >
          {isPlaying ? <Pause className="w-6 h-6 text-white fill-white" /> : <Play className="w-6 h-6 text-white fill-white translate-x-0.5" />}
        </button>
      </div>

      {/* Bottom Console */}
      <div
        className={`absolute bottom-3 left-3 right-3 z-30 flex flex-col gap-2 p-2.5 sm:p-3 rounded-2xl border border-white/20 shadow-[0_12px_36px_rgba(0,0,0,0.85)] transition-all duration-300 ${
          showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
        }`}
        style={{ background: "rgba(10, 10, 14, 0.75)", backdropFilter: "blur(24px) saturate(180%)" }}
      >
        {!isLive && (
          <div className="relative flex items-center w-full">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (videoRef.current) videoRef.current.currentTime = val;
                setCurrentTime(val);
              }}
              className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-white hover:h-1.5 transition-all"
            />
          </div>
        )}

        <div className="flex items-center justify-between text-zinc-300">
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={togglePlay} className="p-1 text-white hover:text-zinc-300 transition">
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            </button>

            {!isLive && (
              <>
                <button onClick={() => seekRelative(-10)} className="p-1 hover:text-white transition">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => seekRelative(10)} className="p-1 hover:text-white transition">
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </>
            )}

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
            <button
              onClick={() => {
                if (videoRef.current) videoRef.current.muted = !isMuted;
                setIsMuted(!isMuted);
              }}
              className="p-1 hover:text-white transition"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-white" />}
            </button>

            <button
              onClick={async () => {
                if (document.pictureInPictureElement) await document.exitPictureInPicture().catch(() => {});
                else if (videoRef.current) await videoRef.current.requestPictureInPicture().catch(() => {});
              }}
              className="p-1 hover:text-white transition"
            >
              <PictureInPicture2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (!document.fullscreenElement) containerRef.current?.requestFullscreen?.();
                else document.exitFullscreen?.();
                setIsFullscreen(!isFullscreen);
              }}
              className="p-1 hover:text-white transition"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
