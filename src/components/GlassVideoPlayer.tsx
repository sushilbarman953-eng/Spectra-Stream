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
} from "lucide-react";

interface GlassVideoPlayerProps {
  src: string;
  poster?: string;
  isLive?: boolean;
}

interface TrackOption {
  id: number;
  label: string;
}

export const GlassVideoPlayer = ({ src, poster, isLive = false }: GlassVideoPlayerProps) => {
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

  // Settings Menu Navigation: "root" | "quality" | "audio" | "captions" | "speed"
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<"root" | "quality" | "audio" | "captions" | "speed">("root");

  // Track Lists & Selected Indices
  const [qualities, setQualities] = useState<TrackOption[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<number>(-1); // -1 = Auto

  const [audioTracks, setAudioTracks] = useState<TrackOption[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<number>(0);

  const [captionTracks, setCaptionTracks] = useState<TrackOption[]>([]);
  const [selectedCaption, setSelectedCaption] = useState<number>(-1); // -1 = Off

  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapRef = useRef<{ time: number; side: "left" | "right" | null }>({
    time: 0,
    side: null,
  });

  // Initialize Video & Parse HLS Manifest Levels
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

          // Quality Levels
          if (hls && hls.levels.length > 0) {
            const parsedQualities: TrackOption[] = [
              { id: -1, label: "Auto" },
              ...hls.levels.map((lvl, index) => ({
                id: index,
                label: lvl.height ? `${lvl.height}p` : `Level ${index + 1}`,
              })),
            ];
            setQualities(parsedQualities);
          }

          // Audio Tracks
          if (hls && hls.audioTracks.length > 0) {
            const parsedAudio: TrackOption[] = hls.audioTracks.map((trk) => ({
              id: trk.id,
              label: trk.name || trk.lang || `Track ${trk.id + 1}`,
            }));
            setAudioTracks(parsedAudio);
            setSelectedAudio(hls.audioTrack);
          }

          // Subtitle Tracks
          if (hls && hls.subtitleTracks.length > 0) {
            const parsedSubs: TrackOption[] = [
              { id: -1, label: "Off" },
              ...hls.subtitleTracks.map((sub) => ({
                id: sub.id,
                label: sub.name || sub.lang || `Sub ${sub.id + 1}`,
              })),
            ];
            setCaptionTracks(parsedSubs);
            setSelectedCaption(hls.subtitleTrack);
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

  // Keep controls alive on activity
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

  // Quality Switcher
  const handleQualityChange = (id: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = id; // -1 for auto
      setSelectedQuality(id);
    }
    setSettingsOpen(false);
  };

  // Audio Switcher
  const handleAudioChange = (id: number) => {
    if (hlsRef.current) {
      hlsRef.current.audioTrack = id;
      setSelectedAudio(id);
    }
    setSettingsOpen(false);
  };

  // Caption Switcher
  const handleCaptionChange = (id: number) => {
    if (hlsRef.current) {
      hlsRef.current.subtitleTrack = id; // -1 for off
      setSelectedCaption(id);
    }
    setSettingsOpen(false);
  };

  // Speed Switcher
  const handleSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
    setSettingsOpen(false);
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

  const togglePiP = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture().catch(() => {});
    } else if (document.pictureInPictureEnabled) {
      await video.requestPictureInPicture().catch(() => {});
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
        onTimeUpdate={() => {
          if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) setDuration(videoRef.current.duration);
        }}
      />

      {/* Touch Seek Zones */}
      <div className="absolute inset-y-0 left-0 w-1/3 z-20" onTouchStart={() => handleTouchZone("left")} />
      <div className="absolute inset-y-0 right-0 w-1/3 z-20" onTouchStart={() => handleTouchZone("right")} />

      {/* Skip Feedback Notification */}
      {skipNotice && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-in fade-in zoom-in-75 duration-200">
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
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white fill-white" />
          ) : (
            <Play className="w-6 h-6 text-white fill-white translate-x-0.5" />
          )}
        </button>
      </div>

      {/* Bottom Frosted Glass Console */}
      <div
        className={`absolute bottom-3 left-3 right-3 z-30 flex flex-col gap-2 p-2.5 sm:p-3 rounded-2xl border border-white/20 shadow-[0_12px_36px_rgba(0,0,0,0.85)] transition-all duration-300 ${
          showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
        }`}
        style={{
          background: "rgba(10, 10, 14, 0.75)",
          backdropFilter: "blur(24px) saturate(180%)",
        }}
      >
        {/* Timeline Range */}
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

        {/* Console Buttons Strip */}
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
            {/* Audio Mute */}
            <button
              onClick={() => {
                if (videoRef.current) videoRef.current.muted = !isMuted;
                setIsMuted(!isMuted);
              }}
              className="p-1 hover:text-white transition"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-white" />}
            </button>

            {/* Picture in Picture */}
            <button onClick={togglePiP} className="p-1 hover:text-white transition" title="Picture in Picture">
              <PictureInPicture2 className="w-4 h-4" />
            </button>

            {/* SETTINGS MENU TRIGGER */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSettingsOpen(!settingsOpen);
                  setActiveMenu("root");
                }}
                className={`p-1.5 rounded-lg transition ${
                  settingsOpen ? "bg-white text-black" : "hover:text-white text-zinc-300"
                }`}
                title="Settings"
              >
                <Settings className={`w-4 h-4 ${settingsOpen ? "rotate-45" : ""} transition-transform duration-300`} />
              </button>

              {/* SETTINGS FROSTED POPUP */}
              {settingsOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-10 right-0 w-60 rounded-2xl border border-white/20 p-2 shadow-[0_16px_40px_rgba(0,0,0,0.9)] z-50 text-xs animate-in fade-in zoom-in-95 duration-150"
                  style={{
                    background: "rgba(12, 12, 16, 0.95)",
                    backdropFilter: "blur(24px) saturate(180%)",
                  }}
                >
                  {/* Root Menu */}
                  {activeMenu === "root" && (
                    <div className="flex flex-col gap-1">
                      {/* Quality Option */}
                      <button
                        onClick={() => setActiveMenu("quality")}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-white/10 text-zinc-200 transition"
                      >
                        <div className="flex items-center gap-2">
                          <Film className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Quality</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                          <span>
                            {selectedQuality === -1
                              ? "Auto"
                              : qualities.find((q) => q.id === selectedQuality)?.label || "Auto"}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </button>

                      {/* Language / Audio Option */}
                      <button
                        onClick={() => setActiveMenu("audio")}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-white/10 text-zinc-200 transition"
                      >
                        <div className="flex items-center gap-2">
                          <Languages className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Audio Track</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                          <span className="truncate max-w-[80px]">
                            {audioTracks.find((a) => a.id === selectedAudio)?.label || "Default"}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </button>

                      {/* Captions / Subtitles Option */}
                      <button
                        onClick={() => setActiveMenu("captions")}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-white/10 text-zinc-200 transition"
                      >
                        <div className="flex items-center gap-2">
                          <Subtitles className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Subtitles</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                          <span className="truncate max-w-[80px]">
                            {selectedCaption === -1
                              ? "Off"
                              : captionTracks.find((c) => c.id === selectedCaption)?.label || "Off"}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </button>

                      {/* Speed Option */}
                      {!isLive && (
                        <button
                          onClick={() => setActiveMenu("speed")}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-white/10 text-zinc-200 transition"
                        >
                          <div className="flex items-center gap-2">
                            <Gauge className="w-3.5 h-3.5 text-zinc-400" />
                            <span>Speed</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                            <span>{playbackSpeed}x</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Submenu: Quality Selection */}
                  {activeMenu === "quality" && (
                    <div className="flex flex-col gap-1 max-h-56 overflow-y-auto no-scrollbar">
                      <button
                        onClick={() => setActiveMenu("root")}
                        className="flex items-center gap-2 p-1.5 text-[11px] font-bold text-zinc-400 border-b border-white/10 mb-1"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Quality</span>
                      </button>
                      {qualities.length > 0 ? (
                        qualities.map((q) => (
                          <button
                            key={q.id}
                            onClick={() => handleQualityChange(q.id)}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-white/10 text-left transition"
                          >
                            <span className={selectedQuality === q.id ? "text-white font-bold" : "text-zinc-300"}>
                              {q.label}
                            </span>
                            {selectedQuality === q.id && <Check className="w-3.5 h-3.5 text-white" />}
                          </button>
                        ))
                      ) : (
                        <div className="p-2 text-zinc-500 text-[11px]">Stream sets quality automatically</div>
                      )}
                    </div>
                  )}

                  {/* Submenu: Audio / Language Selection */}
                  {activeMenu === "audio" && (
                    <div className="flex flex-col gap-1 max-h-56 overflow-y-auto no-scrollbar">
                      <button
                        onClick={() => setActiveMenu("root")}
                        className="flex items-center gap-2 p-1.5 text-[11px] font-bold text-zinc-400 border-b border-white/10 mb-1"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Audio Language</span>
                      </button>
                      {audioTracks.length > 0 ? (
                        audioTracks.map((a) => (
                          <button
                            key={a.id}
                            onClick={() => handleAudioChange(a.id)}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-white/10 text-left transition"
                          >
                            <span className={selectedAudio === a.id ? "text-white font-bold" : "text-zinc-300"}>
                              {a.label}
                            </span>
                            {selectedAudio === a.id && <Check className="w-3.5 h-3.5 text-white" />}
                          </button>
                        ))
                      ) : (
                        <div className="p-2 text-zinc-500 text-[11px]">Single audio feed detected</div>
                      )}
                    </div>
                  )}

                  {/* Submenu: Subtitles / Captions */}
                  {activeMenu === "captions" && (
                    <div className="flex flex-col gap-1 max-h-56 overflow-y-auto no-scrollbar">
                      <button
                        onClick={() => setActiveMenu("root")}
                        className="flex items-center gap-2 p-1.5 text-[11px] font-bold text-zinc-400 border-b border-white/10 mb-1"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Subtitles</span>
                      </button>
                      {captionTracks.length > 0 ? (
                        captionTracks.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => handleCaptionChange(c.id)}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-white/10 text-left transition"
                          >
                            <span className={selectedCaption === c.id ? "text-white font-bold" : "text-zinc-300"}>
                              {c.label}
                            </span>
                            {selectedCaption === c.id && <Check className="w-3.5 h-3.5 text-white" />}
                          </button>
                        ))
                      ) : (
                        <div className="p-2 text-zinc-500 text-[11px]">No captions embedded in this feed</div>
                      )}
                    </div>
                  )}

                  {/* Submenu: Playback Speed */}
                  {activeMenu === "speed" && (
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => setActiveMenu("root")}
                        className="flex items-center gap-2 p-1.5 text-[11px] font-bold text-zinc-400 border-b border-white/10 mb-1"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Playback Speed</span>
                      </button>
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSpeedChange(s)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-white/10 text-left transition"
                        >
                          <span className={playbackSpeed === s ? "text-white font-bold" : "text-zinc-300"}>
                            {s === 1 ? "1.0x (Normal)" : `${s}x`}
                          </span>
                          {playbackSpeed === s && <Check className="w-3.5 h-3.5 text-white" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

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
