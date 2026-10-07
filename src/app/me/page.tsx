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
  Heart,
  ChevronDown,
  ChevronUp,
  DownloadCloud,
  ExternalLink,
  X,
  Copy,
  Check,
  Compass,
  Settings,
  MonitorPlay,
  Database,
  RotateCcw,
  CheckCircle2,
  Share2,
  Edit2,
  Camera,
  Bot,
  Skull,
  Eye,
  Tv,
  LogOut,
  Sliders,
} from "lucide-react";
import { watchlistManager, WatchlistItem } from "@/lib/watchlistManager";
import { playbackHistory, WatchProgressItem } from "@/lib/playbackHistory";
import { downloadManager } from "@/lib/downloadManager";
import { IMAGE_BASE } from "@/lib/tmdb";
import { GlassCard } from "@/components/ui/GlassCard";
import { soundFx } from "@/lib/soundFx";
import { useAuth } from "@/lib/authContext";
import { AdminStudioModal } from "@/components/AdminStudioModal";

const AVATARS = [
  { id: "ghost", label: "Spectre", icon: User },
  { id: "cyber", label: "Cyber Ronin", icon: Bot },
  { id: "noir", label: "Film Noir", icon: Eye },
  { id: "skull", label: "Reaper", icon: Skull },
  { id: "cinema", label: "Director", icon: Film },
  { id: "vintage", label: "Broadcast", icon: Tv },
  { id: "spark", label: "Astral", icon: Sparkles },
  { id: "sound", label: "Acoustic", icon: Disc3 },
];

export default function MePage() {
  const { user, logout, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState<"watchlist" | "history">("watchlist");
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [history, setHistory] = useState<WatchProgressItem[]>([]);
  const [avatarId, setAvatarId] = useState<string>("ghost");
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState<boolean>(false);
  const [shareCopied, setShareCopied] = useState<boolean>(false);

  // Studio Admin Modal State
  const [showStudioModal, setShowStudioModal] = useState<boolean>(false);

  // Settings & Audio
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(true);
  const [showAudioLab, setShowAudioLab] = useState<boolean>(false);
  const [activeSoundName, setActiveSoundName] = useState<string>("");
  const [showDonationModal, setShowDonationModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Preferences
  const [defaultQuality, setDefaultQuality] = useState<string>("auto");
  const [autoNextEp, setAutoNextEp] = useState<boolean>(true);
  const [storageUsed, setStorageUsed] = useState<string>("0 KB");
  const [cacheClearedStatus, setCacheClearedStatus] = useState<boolean>(false);

  useEffect(() => {
    const loadData = () => {
      setWatchlist(watchlistManager.getAll());
      setHistory(playbackHistory.getAll());
      setAudioEnabled(soundFx.isEnabled());

      const savedAvatar = localStorage.getItem("spectra_avatar_id");
      if (savedAvatar) setAvatarId(savedAvatar);

      const savedQuality = localStorage.getItem("spectra_pref_quality") || "auto";
      const savedAutoNext = localStorage.getItem("spectra_pref_autonext");
      const savedHaptics = localStorage.getItem("spectra_pref_haptics");

      setDefaultQuality(savedQuality);
      setAutoNextEp(savedAutoNext !== null ? savedAutoNext === "true" : true);
      setHapticsEnabled(savedHaptics !== null ? savedHaptics === "true" : true);
    };

    loadData();
    window.addEventListener("spectra_watchlist_updated", loadData);
    window.addEventListener("spectra_playback_updated", loadData);

    return () => {
      window.removeEventListener("spectra_watchlist_updated", loadData);
      window.removeEventListener("spectra_playback_updated", loadData);
    };
  }, []);

  const resumeItem = history[0];
  const activeAvatarKey = user?.avatarId || avatarId;
  const currentAvatar = AVATARS.find((a) => a.id === activeAvatarKey) || AVATARS[0];
  const AvatarIcon = currentAvatar.icon;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 pb-28 space-y-5 select-none">
      
      {/* 1. AUTHENTICATED PROFILE CARD */}
      <GlassCard className="p-4 sm:p-5 rounded-3xl border border-white/15 bg-[#0e0e14]/75 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              onClick={() => {
                soundFx.playCinematicPop();
                setShowAvatarPicker(true);
              }}
              className="relative w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-white/70 via-white/10 to-white/40 shadow-glow flex-none cursor-pointer group active:scale-95 transition-transform"
            >
              <div className="w-full h-full rounded-full bg-[#08080c] flex items-center justify-center text-white relative overflow-hidden">
                <AvatarIcon className="w-6 h-6 stroke-[2.2] group-hover:scale-90 transition-transform" />
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
                {user?.name || "Spectra Member"}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-[10px] text-zinc-400 font-semibold">
                <span className="text-zinc-300">{user?.email || "sync enabled"}</span>
                <span>•</span>
                <span className="text-white font-mono">{watchlist.length}</span> in list
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFx.playCinematicWhoosh();
                setShowSettingsModal(true);
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white shadow-glow transition active:scale-95"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                soundFx.playCinematicPop();
                logout();
              }}
              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* 2. EXCLUSIVE CONTENT STUDIO ADMIN CARD (MANAGE ALL TABS) */}
      <div
        onClick={() => {
          soundFx.playCinematicSwell();
          setShowStudioModal(true);
        }}
        className="p-4 rounded-3xl border border-red-500/30 bg-gradient-to-r from-red-950/40 via-[#0e0e16] to-[#08080c] flex items-center justify-between gap-4 cursor-pointer group hover:border-red-500/50 transition shadow-xl active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 group-hover:scale-105 transition-transform">
            <Sliders className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              Content Studio Admin
              <span className="px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/30 uppercase">
                All Tabs
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400">
              Change movie titles, poster links, ratings, audio tags, and stars live without code
            </p>
          </div>
        </div>

        <button className="px-3.5 py-1.5 rounded-xl bg-white text-black font-extrabold text-xs shadow-glow shrink-0 group-hover:bg-zinc-200 transition">
          Launch Studio
        </button>
      </div>

      {/* 3. RESUME QUICK SHELF */}
      {resumeItem && (
        <div className="p-3.5 rounded-2xl border border-white/15 bg-[#0c0c12]/90 flex items-center justify-between gap-3 shadow-lg">
          <div className="min-w-0 space-y-1">
            <span className="px-1.5 py-0.2 rounded bg-white text-black font-black text-[9px] uppercase">
              Resume
            </span>
            <h4 className="text-xs font-bold text-white truncate">{resumeItem.title}</h4>
            <div className="w-36 h-1 bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full"
                style={{ width: `${resumeItem.progressPercent}%` }}
              />
            </div>
          </div>

          <Link
            href={`/watch/${resumeItem.tmdbId}?type=${resumeItem.type}`}
            onClick={() => soundFx.playCinematicSwell()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-black font-extrabold text-xs shadow-glow flex-none"
          >
            <Play className="w-3 h-3 fill-black text-black" />
            <span>Play</span>
          </Link>
        </div>
      )}

      {/* 4. TABS: WATCHLIST / HISTORY */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab("watchlist")}
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
          onClick={() => setActiveTab("history")}
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

      {/* Watchlist Content Grid */}
      {activeTab === "watchlist" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {watchlist.map((item) => (
            <div key={item.id} className="p-2 rounded-2xl bg-[#0c0c14] border border-white/10">
              <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
            </div>
          ))}
        </div>
      )}

      {/* UNIVERSAL CONTENT STUDIO MODAL */}
      <AdminStudioModal
        isOpen={showStudioModal}
        onClose={() => setShowStudioModal(false)}
      />

    </div>
  );
}
