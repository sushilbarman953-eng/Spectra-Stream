"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Bookmark,
  History,
  Download,
  Trash2,
  Play,
  Film,
  Star,
  Sparkles,
  Volume2,
  Disc3,
  Waves,
  Sparkle,
  Radio,
  Sliders,
} from "lucide-react";
import { watchlistManager, WatchlistItem } from "@/lib/watchlistManager";
import { playbackHistory, WatchProgressItem } from "@/lib/playbackHistory";
import { IMAGE_BASE } from "@/lib/tmdb";
import { GlassCard } from "@/components/ui/GlassCard";
import { soundFx } from "@/lib/soundFx";

export default function MePage() {
  const [activeTab, setActiveTab] = useState<"watchlist" | "history">("watchlist");
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [history, setHistory] = useState<WatchProgressItem[]>([]);
  const [activeSoundName, setActiveSoundName] = useState<string>("");

  useEffect(() => {
    const loadData = () => {
      setWatchlist(watchlistManager.getAll());
      setHistory(playbackHistory.getAll());
    };
    loadData();

    window.addEventListener("spectra_watchlist_updated", loadData);
    window.addEventListener("spectra_playback_updated", loadData);

    return () => {
      window.removeEventListener("spectra_watchlist_updated", loadData);
      window.removeEventListener("spectra_playback_updated", loadData);
    };
  }, []);

  const triggerSound = (name: string, fn: () => void) => {
    try {
      fn();
      setActiveSoundName(name);
      setTimeout(() => setActiveSoundName(""), 1200);
    } catch (e: any) {
      console.error("Audio trigger error:", e);
    }
  };

  const SOUND_EFFECTS = [
    {
      name: "Mechanical Tick",
      desc: "Top carousel ratchet dial",
      icon: Disc3,
      action: () => {
        soundFx.playMechanicalTick();
        if (navigator.vibrate) navigator.vibrate(8);
      },
    },
    {
      name: "Cinematic Whoosh",
      desc: "Drawer & swipe transitions",
      icon: Waves,
      action: () => {
        soundFx.playCinematicWhoosh();
        if (navigator.vibrate) navigator.vibrate(12);
      },
    },
    {
      name: "Glass Pop Chime",
      desc: "Touch selections & pills",
      icon: Sparkle,
      action: () => soundFx.playCinematicPop(),
    },
    {
      name: "Cinematic Swell",
      desc: "Play & trailer launches",
      icon: Radio,
      action: () => soundFx.playCinematicSwell(),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 pb-28 space-y-6">
      {/* Profile Card */}
      <GlassCard className="p-4 sm:p-6 rounded-3xl border border-white/15 bg-[#0e0e14]/70 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-white to-zinc-400 p-0.5 shadow-glow">
            <div className="w-full h-full rounded-full bg-[#08080c] flex items-center justify-center text-white">
              <User className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              Spectra Member
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </h2>
            <p className="text-xs text-zinc-400">Offline & Sync Enabled</p>
          </div>
        </div>

        <Link
          href="/downloads"
          onClick={() => soundFx.playCinematicPop()}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition backdrop-blur-xl"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Offline Hub</span>
        </Link>
      </GlassCard>

      {/* DEDICATED SOUND LAB / AUDIO CHECK PANEL */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-white" />
            <span>Acoustic Audio Lab</span>
          </h3>
          {activeSoundName && (
            <span className="text-[10px] font-mono font-bold text-emerald-400 animate-pulse">
              Playing: {activeSoundName}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {SOUND_EFFECTS.map((snd) => {
            const SndIcon = snd.icon;
            const isPlayingThis = activeSoundName === snd.name;

            return (
              <button
                key={snd.name}
                onClick={() => triggerSound(snd.name, snd.action)}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between h-24 transition-all duration-150 select-none active:scale-95 ${
                  isPlayingThis
                    ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.7)] scale-[1.02]"
                    : "bg-[#0c0c12]/80 hover:bg-white/[0.08] text-white border-white/15"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`p-1.5 rounded-xl border ${
                    isPlayingThis ? "bg-black/10 border-black/20 text-black" : "bg-white/10 border-white/15 text-white"
                  }`}>
                    <SndIcon className="w-4 h-4" />
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isPlayingThis ? "bg-black text-white" : "bg-white/10 text-zinc-400"
                  }`}>
                    TEST
                  </span>
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-xs font-black truncate">{snd.name}</h4>
                  <p className={`text-[9px] truncate ${isPlayingThis ? "text-zinc-800" : "text-zinc-400"}`}>
                    {snd.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => {
            soundFx.playCinematicPop();
            setActiveTab("watchlist");
          }}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition border ${
            activeTab === "watchlist"
              ? "bg-white text-black border-white shadow-glow"
              : "bg-white/5 text-zinc-400 border-white/10 hover:text-white"
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>My List ({watchlist.length})</span>
        </button>

        <button
          onClick={() => {
            soundFx.playCinematicPop();
            setActiveTab("history");
          }}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition border ${
            activeTab === "history"
              ? "bg-white text-black border-white shadow-glow"
              : "bg-white/5 text-zinc-400 border-white/10 hover:text-white"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Watch History ({history.length})</span>
        </button>
      </div>

      {/* Watchlist */}
      {activeTab === "watchlist" && (
        <div>
          {watchlist.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <Bookmark className="w-8 h-8 text-zinc-600 mx-auto" />
              <h4 className="text-sm font-bold text-white">Your list is currently empty</h4>
              <p className="text-xs text-zinc-400">
                Tap &ldquo;+ Add to List&rdquo; on any movie or series to save it here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {watchlist.map((item) => {
                const poster = item.posterPath ? `${IMAGE_BASE}/w342${item.posterPath}` : null;
                return (
                  <div key={item.id} className="group relative">
                    <Link
                      href={`/details/${item.id}?type=${item.type}`}
                      onClick={() => soundFx.playCinematicPop()}
                    >
                      <GlassCard
                        hoverEffect
                        className="overflow-hidden border border-white/10 rounded-2xl h-full flex flex-col justify-between bg-[#0b0b10]"
                      >
                        <div className="relative aspect-[2/3] w-full bg-zinc-950">
                          {poster ? (
                            <Image
                              src={poster}
                              alt={item.title}
                              fill
                              sizes="180px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-zinc-600 text-xs">
                              <Film className="w-6 h-6" />
                            </div>
                          )}
                          {item.voteAverage && (
                            <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] text-white font-bold border border-white/15">
                              <Star className="w-2.5 h-2.5 fill-white text-white" />
                              {item.voteAverage.toFixed(1)}
                            </div>
                          )}
                        </div>
                        <div className="p-2.5 bg-black/60 flex items-center justify-between gap-1">
                          <h4 className="text-xs font-semibold text-white truncate">{item.title}</h4>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              soundFx.playCinematicPop();
                              watchlistManager.remove(item.id);
                            }}
                            className="p-1 text-zinc-500 hover:text-red-400 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </GlassCard>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* History */}
      {activeTab === "history" && (
        <div className="space-y-2">
          {history.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <History className="w-8 h-8 text-zinc-600 mx-auto" />
              <h4 className="text-sm font-bold text-white">No playback history recorded</h4>
              <p className="text-xs text-zinc-400">Stream a title to start tracking progress.</p>
            </div>
          ) : (
            history.map((item) => (
              <div key={item.id} className="p-2.5 rounded-2xl flex items-center justify-between gap-3 border border-white/10 bg-[#0e0e14]/70">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white">
                    <Play className="w-3.5 h-3.5 fill-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                    <p className="text-[10px] text-zinc-400">Progress: {item.progressPercent}%</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
