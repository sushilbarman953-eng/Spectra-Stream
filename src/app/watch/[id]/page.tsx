"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Server,
  Volume2,
  RefreshCw,
  Sparkles,
  Languages,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { STREAM_SERVERS } from "@/lib/streamingSources";
import { SUPPORTED_LANGUAGES, LanguageOption } from "@/lib/languages";
import { playbackHistory } from "@/lib/playbackHistory";
import { soundFx } from "@/lib/soundFx";

export default function WatchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params?.id as string;
  const type = (searchParams.get("type") as "movie" | "tv") || "movie";
  const season = parseInt(searchParams.get("season") || "1", 10);
  const episode = parseInt(searchParams.get("episode") || "1", 10);

  const [currentServerIdx, setCurrentServerIdx] = useState<number>(0);
  const [selectedLang, setSelectedLang] = useState<string>("hi");
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showServerMenu, setShowServerMenu] = useState<boolean>(false);
  const [showLangMenu, setShowLangMenu] = useState<boolean>(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const watchdogTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeServer = STREAM_SERVERS[currentServerIdx];
  const streamUrl = activeServer.buildUrl({
    tmdbId: id,
    type,
    season,
    episode,
    lang: selectedLang,
  });

  // Track playback history so it immediately updates the "Continue Watching" shelf
  useEffect(() => {
    playbackHistory.save({
      id: `${id}_${type}_${season}_${episode}`,
      tmdbId: id,
      title: type === "tv" ? `Episode ${episode}` : `Movie Stream`,
      type,
      season,
      episode,
      currentTime: 120,
      duration: 3600,
      progressPercent: 15,
      lastWatched: Date.now(),
    });
  }, [id, type, season, episode]);

  // Failover watchdog
  useEffect(() => {
    setLoading(true);
    if (watchdogTimerRef.current) clearTimeout(watchdogTimerRef.current);

    watchdogTimerRef.current = setTimeout(() => {
      if (loading && currentServerIdx < STREAM_SERVERS.length - 1) {
        handleServerSwitch(currentServerIdx + 1, "Optimizing route: Switched to backup Indian CDN");
      }
    }, 8500);

    return () => {
      if (watchdogTimerRef.current) clearTimeout(watchdogTimerRef.current);
    };
  }, [currentServerIdx, selectedLang, id, season, episode]);

  const handleServerSwitch = (idx: number, msg?: string) => {
    soundFx.playCinematicWhoosh();
    setCurrentServerIdx(idx);
    setShowServerMenu(false);
    setToastMsg(msg || `Connected to ${STREAM_SERVERS[idx].name}`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleLanguageSelect = (lang: LanguageOption) => {
    soundFx.playCinematicPop();
    setSelectedLang(lang.code);
    setShowLangMenu(false);
    setToastMsg(`Audio switched to ${lang.label} (${lang.native})`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const navigateEpisode = (direction: "prev" | "next") => {
    soundFx.playCinematicPop();
    const nextEp = direction === "next" ? episode + 1 : Math.max(1, episode - 1);
    router.replace(`/watch/${id}?type=tv&season=${season}&episode=${nextEp}`);
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col select-none">
      {/* Top Player HUD Controls */}
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

          {/* Server Selector Button */}
          <div className="relative">
            <button
              onClick={() => {
                soundFx.playCinematicPop();
                setShowServerMenu(!showServerMenu);
                setShowLangMenu(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white backdrop-blur-xl transition shadow-glow"
            >
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span>{activeServer.name}</span>
              <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">
                ({activeServer.latency})
              </span>
            </button>

            {showServerMenu && (
              <div className="absolute top-12 left-0 w-64 rounded-2xl p-2 bg-[#0c0c14]/95 border border-white/20 shadow-2xl backdrop-blur-3xl space-y-1 z-50">
                <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 px-2 py-1 block">
                  Select Indian High-Speed CDN
                </span>
                {STREAM_SERVERS.map((server, idx) => (
                  <button
                    key={server.id}
                    onClick={() => handleServerSwitch(idx)}
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

        {/* Right HUD: Episode Switcher & Audio Selector */}
        <div className="flex items-center gap-2">
          {type === "tv" && (
            <div className="flex items-center gap-1 bg-white/10 border border-white/20 rounded-xl p-0.5 backdrop-blur-xl">
              <button
                disabled={episode <= 1}
                onClick={() => navigateEpisode("prev")}
                className="p-1 rounded-lg hover:bg-white/20 disabled:opacity-30 text-white transition"
                title="Previous Episode"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono font-bold px-1 text-white">
                E{episode}
              </span>
              <button
                onClick={() => navigateEpisode("next")}
                className="p-1 rounded-lg hover:bg-white/20 text-white transition"
                title="Next Episode"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Multi-Language Selector */}
          <div className="relative">
            <button
              onClick={() => {
                soundFx.playCinematicPop();
                setShowLangMenu(!showLangMenu);
                setShowServerMenu(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-xs font-bold text-emerald-300 backdrop-blur-xl transition shadow-glow"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentLangObj.badge} • {currentLangObj.label}</span>
            </button>

            {showLangMenu && (
              <div className="absolute top-12 right-0 w-56 rounded-2xl p-2 bg-[#0c0c14]/95 border border-white/20 shadow-2xl backdrop-blur-3xl space-y-1 z-50">
                <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 px-2 py-1 block">
                  Regional Audio Tracks
                </span>
                <div className="max-h-60 overflow-y-auto no-scrollbar space-y-1">
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const isSelected = selectedLang === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageSelect(lang)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition ${
                          isSelected ? "bg-white text-black font-extrabold" : "hover:bg-white/10 text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-mono px-1 py-0.5 rounded font-black ${
                            isSelected ? "bg-black text-white" : "bg-white/10 text-zinc-300"
                          }`}>
                            {lang.badge}
                          </span>
                          <div>
                            <p className="font-bold">{lang.label}</p>
                            <p className={`text-[9px] ${isSelected ? "text-zinc-700" : "text-zinc-400"}`}>
                              {lang.native}
                            </p>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-black" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMsg && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-2xl bg-white text-black text-xs font-bold shadow-glow flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Video Stream Embed */}
      <div className="relative w-full h-full flex items-center justify-center bg-black">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10 bg-black/90">
            <RefreshCw className="w-6 h-6 animate-spin text-white" />
            <span className="text-xs text-zinc-300 font-mono">
              Buffering stream from {activeServer.region} ({currentLangObj.label})...
            </span>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={streamUrl}
          onLoad={() => setLoading(false)}
          className="w-full h-full border-0"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
