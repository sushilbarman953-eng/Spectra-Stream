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

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [inIntro, setInIntro] = useState(false);

  const lastSavedTime = useRef<number>(0);

  // Load stream via HLS or native HTML5 video
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    setLoading(true);
    let hls: Hls | null = null;

    if (Hls.isSupported() && src.includes(".m3u8")) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
        if (initialTime > 0) video.currentTime = initialTime;
      });
    } else {
      video.src = src;
      if (initialTime > 0) video.currentTime = initialTime;
      setLoading(false);
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [src, initialTime]);

  // Video Time Update & Playback Persistence
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const curr = video.currentTime;
    const dur = video.duration || 0;
    setCurrentTime(curr);
    setDuration(dur);

    // Intro check
    setInIntro(curr >= introStart && curr <= introEnd);

    // Buffer check
    if (video.buffered.length > 0) {
      setBuffered((video.buffered.end(video.buffered.length - 1) / dur) * 100);
    }

    // Save playback position every 5 seconds
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
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true));
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
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  const seek = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.duration || 0, time));
  };

  const formatTime = (seconds: number) => {
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
        onTimeUpdate={handleTimeUpdate}
        onWaiting={() => setLoading(true)}
        onPlaying={() => {
          setLoading(false);
          setIsPlaying(true);
        }}
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
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

        {/* Bottom Bar: Timeline + Play/Pause/Mute/Full */}
        <div className="space-y-2">
          {/* Progress Slider */}
          <div className="relative w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
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

          <div className="flex items-center justify-between text-xs text-white">
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} className="p-1 hover:text-zinc-300">
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              </button>

              <button onClick={() => seek(currentTime - 10)} className="p-1 hover:text-zinc-300">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button onClick={() => seek(currentTime + 10)} className="p-1 hover:text-zinc-300">
                <RotateCw className="w-3.5 h-3.5" />
              </button>

              <button onClick={toggleMute} className="p-1 hover:text-zinc-300">
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <span className="text-[11px] text-zinc-300 font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <button onClick={toggleFullscreen} className="p-1 hover:text-zinc-300">
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
