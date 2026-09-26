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
  VolumeX,
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
} from "lucide-react";
import { watchlistManager, WatchlistItem } from "@/lib/watchlistManager";
import { playbackHistory, WatchProgressItem } from "@/lib/playbackHistory";
import { downloadManager } from "@/lib/downloadManager";
import { IMAGE_BASE } from "@/lib/tmdb";
import { GlassCard } from "@/components/ui/GlassCard";
import { soundFx } from "@/lib/soundFx";

// 8 Curated monochrome aesthetic avatars
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
  const [activeTab, setActiveTab] = useState<"watchlist" | "history">("watchlist");
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [history, setHistory] = useState<WatchProgressItem[]>([]);
  const [downloadCount, setDownloadCount] = useState<number>(0);

  // Profile customization
  const [avatarId, setAvatarId] = useState<string>("ghost");
  const [userName, setUserName] = useState<string>("Spectra Member");
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState<boolean>(false);

  // Share URL state
  const [shareCopied, setShareCopied] = useState<boolean>(false);

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
      setDownloadCount(downloadManager.getAll().length);
      setAudioEnabled(soundFx.isEnabled());

      // Load Profile info
      const savedAvatar = localStorage.getItem("spectra_avatar_id");
      const savedName = localStorage.getItem("spectra_user_name");
      if (savedAvatar) setAvatarId(savedAvatar);
      if (savedName) setUserName(savedName);

      // Load Preferences
      const savedQuality = localStorage.getItem("spectra_pref_quality") || "auto";
      const savedAutoNext = localStorage.getItem("spectra_pref_autonext");
      const savedHaptics = localStorage.getItem("spectra_pref_haptics");

      setDefaultQuality(savedQuality);
      setAutoNextEp(savedAutoNext !== null ? savedAutoNext === "true" : true);
      setHapticsEnabled(savedHaptics !== null ? savedHaptics === "true" : true);

      calculateStorageUsage();
    };

    loadData();

    window.addEventListener("spectra_watchlist_updated", loadData);
    window.addEventListener("spectra_playback_updated", loadData);
    window.addEventListener("spectra_downloads_updated", loadData);
    window.addEventListener("spectra_sound_preference_changed", () => {
      setAudioEnabled(soundFx.isEnabled());
    });

    return () => {
      window.removeEventListener("spectra_watchlist_updated", loadData);
      window.removeEventListener("spectra_playback_updated", loadData);
      window.removeEventListener("spectra_downloads_updated", loadData);
    };
  }, []);

  const calculateStorageUsage = () => {
    try {
      let total = 0;
      for (let x in localStorage) {
        if (localStorage.hasOwnProperty(x)) {
          total += (localStorage[x].length + x.length) * 2;
        }
      }
      if (total < 1024 * 1024) {
        setStorageUsed(`${(total / 1024).toFixed(1)} KB`);
      } else {
        setStorageUsed(`${(total / (1024 * 1024)).toFixed(2)} MB`);
      }
    } catch {
      setStorageUsed("1.2 MB");
    }
  };

  const handleSelectAvatar = (id: string) => {
    soundFx.playCinematicPop();
    setAvatarId(id);
    localStorage.setItem("spectra_avatar_id", id);
    setShowAvatarPicker(false);
  };

  const handleSaveName = (newName: string) => {
    const trimmed = newName.trim() || "Spectra Member";
    setUserName(trimmed);
    localStorage.setItem("spectra_user_name", trimmed);
    setIsEditingName(false);
  };

  // Generate 1-Click Shareable Watchlist URL
  const handleShareWatchlist = () => {
    soundFx.playCinematicPop();
    if (watchlist.length === 0) {
      alert("Add at least one title to your list before sharing!");
      return;
    }

    try {
      // Lightweight serialization of list items
      const serialized = watchlist.map((item) => ({
        id: item.id,
        title: item.title,
        type: item.type,
        posterPath: item.posterPath,
        voteAverage: item.voteAverage,
      }));

      // Base64 encode string safely
      const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(serialized))));
      const shareUrl = `${window.location.origin}/share?list=${encoded}`;

      navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2200);

      if (navigator.share) {
        navigator.share({
          title: `${userName}'s Spectra Watchlist`,
          text: `Check out my curated watchlist on Spectra Cinema (${watchlist.length} titles)!`,
          url: shareUrl,
        }).catch(() => {});
      }
    } catch (e) {
      console.error("Share generation error:", e);
    }
  };

  const toggleSoundMaster = () => {
    const next = !audioEnabled;
    soundFx.setEnabled(next);
    setAudioEnabled(next);
    if (next) soundFx.playCinematicPop();
  };

  const handleQualityChange = (q: string) => {
    soundFx.playCinematicPop();
    setDefaultQuality(q);
    localStorage.setItem("spectra_pref_quality", q);
  };

  const toggleAutoNext = () => {
    soundFx.playCinematicPop();
    const next = !autoNextEp;
    setAutoNextEp(next);
    localStorage.setItem("spectra_pref_autonext", String(next));
  };

  const toggleHaptics = () => {
    const next = !hapticsEnabled;
    setHapticsEnabled(next);
    localStorage.setItem("spectra_pref_haptics", String(next));
    if (next && navigator.vibrate) navigator.vibrate(10);
    soundFx.playCinematicPop();
  };

  const handleClearCache = () => {
    soundFx.playCinematicPop();
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("tmdb_") || key.startsWith("search_cache_")) {
          localStorage.removeItem(key);
        }
      });
      calculateStorageUsage();
      setCacheClearedStatus(true);
      setTimeout(() => setCacheClearedStatus(false), 2000);
    } catch {}
  };

  const handleFactoryReset = () => {
    if (confirm("Are you sure? This will reset your watchlist, history, and preferences.")) {
      soundFx.playCinematicWhoosh();
      localStorage.clear();
      window.location.reload();
    }
  };

  const triggerTestSound = (name: string, fn: () => void) => {
    try {
      fn();
      setActiveSoundName(name);
      setTimeout(() => setActiveSoundName(""), 1200);
    } catch {}
  };

  const handleExportBackup = () => {
    soundFx.playCinematicPop();
    const backup = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      userName,
      avatarId,
      watchlist,
      history,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `spectra-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearHistory = () => {
    if (confirm("Clear all playback history?")) {
      soundFx.playCinematicPop();
      playbackHistory.clearAll();
      setHistory([]);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    soundFx.playCinematicPop();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const resumeItem = history[0];

  const currentAvatar = AVATARS.find((a) => a.id === avatarId) || AVATARS[0];
  const AvatarIcon = currentAvatar.icon;

  const SOUND_EFFECTS = [
    {
      name: "Haptic Dial Click",
      desc: "Warm acoustic rotary thud",
      icon: Disc3,
      action: () => {
        soundFx.playMechanicalTick();
        if (hapticsEnabled && navigator.vibrate) navigator.vibrate(8);
      },
    },
    {
      name: "Velvet Bubble Pop",
      desc: "Smooth organic touch tap",
      icon: Sparkle,
      action: () => soundFx.playCinematicPop(),
    },
    {
      name: "Cinematic Whoosh",
      desc: "Sub-bass sweep on swipes",
      icon: Waves,
      action: () => {
        soundFx.playCinematicWhoosh();
        if (hapticsEnabled && navigator.vibrate) navigator.vibrate(12);
      },
    },
    {
      name: "Cinematic Swell",
      desc: "Trailer & Play launcher",
      icon: Radio,
      action: () => soundFx.playCinematicSwell(),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 pb-28 space-y-5">
      {/* 1. SPECTRAL PROFILE CARD WITH INTERACTIVE AVATAR SELECTOR */}
      <GlassCard className="p-4 sm:p-5 rounded-3xl border border-white/15 bg-[#0e0e14]/75 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Interactive Tap-to-Change Avatar */}
            <div
              onClick={() => {
                soundFx.playCinematicPop();
                setShowAvatarPicker(true);
              }}
              className="relative w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-white/70 via-white/10 to-white/40 shadow-[0_0_20px_rgba(255,255,255,0.25)] flex-none cursor-pointer group active:scale-95 transition-transform"
              title="Tap to change avatar"
            >
              <div className="w-full h-full rounded-full bg-[#08080c] flex items-center justify-center text-white relative overflow-hidden">
                <AvatarIcon className="w-6 h-6 stroke-[2.2] group-hover:scale-90 transition-transform" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              {/* Editable User Name */}
              <div className="flex items-center gap-2">
                {isEditingName ? (
                  <input
                    type="text"
                    defaultValue={userName}
                    autoFocus
                    onBlur={(e) => handleSaveName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveName((e.target as HTMLInputElement).value);
                    }}
                    className="text-sm font-black text-white bg-white/10 px-2 py-0.5 rounded border border-white/20 focus:outline-none"
                  />
                ) : (
                  <div
                    onClick={() => setIsEditingName(true)}
                    className="flex items-center gap-1.5 cursor-pointer group"
                    title="Tap to rename"
                  >
                    <h2 className="text-base sm:text-lg font-black text-white tracking-wide group-hover:text-zinc-300 transition">
                      {userName}
                    </h2>
                    <Edit2 className="w-3 h-3 text-zinc-500 group-hover:text-white transition" />
                  </div>
                )}
                <Sparkles className="w-3.5 h-3.5 text-white/80" />
              </div>

              {/* Quick Metrics Badges */}
              <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-semibold">
                <span className="text-white font-mono">{watchlist.length}</span> in list
                <span>•</span>
                <span className="text-white font-mono">{history.length}</span> watched
                <span>•</span>
                <span className="text-white font-mono">{downloadCount}</span> offline
              </div>
            </div>
          </div>

          {/* Quick Header Actions: Share, Support, Downloads, Settings */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            {/* 1-Click Share Watchlist Trigger */}
            <button
              onClick={handleShareWatchlist}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition active:scale-95 shadow-glow"
              title="Share Watchlist"
            >
              {shareCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-400" />
                  <span className="text-emerald-400">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share List</span>
                </>
              )}
            </button>

            {/* Support / Donations Trigger */}
            <button
              onClick={() => {
                soundFx.playCinematicPop();
                setShowDonationModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-black font-extrabold text-xs shadow-glow hover:bg-zinc-200 active:scale-95 transition"
            >
              <Heart className="w-3.5 h-3.5 fill-black text-black" />
              <span>Support</span>
            </button>

            {/* Offline Hub */}
            <Link
              href="/downloads"
              onClick={() => soundFx.playCinematicPop()}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition"
              title="Downloads"
            >
              <Download className="w-3.5 h-3.5" />
            </Link>

            {/* Settings Cog */}
            <button
              onClick={() => {
                soundFx.playCinematicWhoosh();
                setShowSettingsModal(true);
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white shadow-glow active:scale-95 transition"
              title="Open Settings"
            >
              <Settings className="w-4 h-4 animate-spin-slow" />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* 2. AVATAR PICKER MODAL */}
      {showAvatarPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl p-5 bg-[#0c0c14]/95 border border-white/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-white" />
                <h3 className="text-sm font-bold text-white">Choose Profile Avatar</h3>
              </div>
              <button
                onClick={() => {
                  soundFx.playCinematicPop();
                  setShowAvatarPicker(false);
                }}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {AVATARS.map((av) => {
                const Icon = av.icon;
                const isSelected = avatarId === av.id;

                return (
                  <button
                    key={av.id}
                    onClick={() => handleSelectAvatar(av.id)}
                    className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 border transition-all active:scale-95 ${
                      isSelected
                        ? "bg-white text-black border-white shadow-glow scale-105"
                        : "bg-white/5 hover:bg-white/10 text-white border-white/10"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-[9px] font-bold truncate max-w-full">
                      {av.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. RESUME QUICK SHELF */}
      {resumeItem && (
        <div className="p-3 sm:p-3.5 rounded-2xl border border-white/15 bg-[#0c0c12]/90 flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-10 h-14 rounded-lg overflow-hidden bg-zinc-950 border border-white/15 flex-none">
              {resumeItem.posterPath ? (
                <Image
                  src={`${IMAGE_BASE}/w185${resumeItem.posterPath}`}
                  alt={resumeItem.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-zinc-600">
                  <Film className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.2 rounded bg-white text-black font-black text-[9px] uppercase tracking-wider">
                  Resume
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {resumeItem.type === "tv" ? `S${resumeItem.season || 1}:E${resumeItem.episode || 1}` : "Film"} • {resumeItem.progressPercent}%
                </span>
              </div>
              <h4 className="text-xs font-bold text-white truncate">{resumeItem.title}</h4>

              <div className="w-32 sm:w-48 h-1 bg-white/15 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white shadow-glow rounded-full"
                  style={{ width: `${resumeItem.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <Link
            href={
              resumeItem.type === "tv"
                ? `/watch/${resumeItem.tmdbId}?type=tv&season=${resumeItem.season || 1}&episode=${resumeItem.episode || 1}`
                : `/watch/${resumeItem.tmdbId}?type=movie`
            }
            onClick={() => soundFx.playCinematicSwell()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-black font-extrabold text-xs shadow-glow active:scale-95 transition flex-none"
          >
            <Play className="w-3.5 h-3.5 fill-black text-black" />
            <span>Play</span>
          </Link>
        </div>
      )}

      {/* 4. COLLAPSIBLE ACOUSTIC LAB */}
      <div className="border border-white/10 rounded-2xl bg-[#0a0a0f]/60 overflow-hidden">
        <button
          onClick={() => {
            soundFx.playCinematicPop();
            setShowAudioLab(!showAudioLab);
          }}
          className="w-full px-4 py-2.5 flex items-center justify-between text-left text-xs font-bold text-zinc-300 hover:text-white transition"
        >
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-white" />
            <span className="uppercase tracking-wider text-[11px]">Acoustic Audio Lab</span>
            <span className="text-[10px] text-zinc-500 font-mono">
              ({showAudioLab ? "Tap to close" : "4 Audio Profiles"})
            </span>
          </div>
          {showAudioLab ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
        </button>

        {showAudioLab && (
          <div className="p-3 pt-1 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 animate-in fade-in duration-200">
            {SOUND_EFFECTS.map((snd) => {
              const SndIcon = snd.icon;
              const isPlayingThis = activeSoundName === snd.name;

              return (
                <button
                  key={snd.name}
                  onClick={() => triggerTestSound(snd.name, snd.action)}
                  className={`p-2.5 rounded-xl border text-left flex flex-col justify-between h-20 transition-all select-none active:scale-95 ${
                    isPlayingThis
                      ? "bg-white text-black border-white shadow-glow"
                      : "bg-white/[0.03] hover:bg-white/[0.08] text-white border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <SndIcon className="w-3.5 h-3.5" />
                    <span className="text-[8px] font-mono font-bold px-1 py-0.5 rounded bg-white/10">
                      TEST
                    </span>
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold truncate">{snd.name}</h5>
                    <p className={`text-[8px] truncate ${isPlayingThis ? "text-zinc-800" : "text-zinc-400"}`}>
                      {snd.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. TABS STRIP */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
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

        <div className="flex items-center gap-2">
          {activeTab === "history" && history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-[11px] font-bold text-zinc-400 hover:text-red-400 flex items-center gap-1 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}

          <button
            onClick={handleExportBackup}
            className="text-[11px] font-bold text-zinc-400 hover:text-white flex items-center gap-1 transition"
            title="Download JSON data backup"
          >
            <DownloadCloud className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* 6. WATCHLIST VIEW */}
      {activeTab === "watchlist" && (
        <div>
          {watchlist.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Bookmark className="w-8 h-8 text-zinc-600 mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-white">Your list is currently empty</h4>
                <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
                  Find movies and anime you love and tap &ldquo;+ Add to List&rdquo; to save them here.
                </p>
              </div>

              <Link
                href="/explore"
                onClick={() => soundFx.playCinematicWhoosh()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black font-extrabold text-xs shadow-glow active:scale-95 transition"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Explore Catalog</span>
              </Link>
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

      {/* 7. HISTORY VIEW */}
      {activeTab === "history" && (
        <div className="space-y-2">
          {history.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <History className="w-8 h-8 text-zinc-600 mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-white">No playback history recorded</h4>
                <p className="text-xs text-zinc-400 mt-1">Start streaming to track watched progress.</p>
              </div>
              <Link
                href="/explore"
                onClick={() => soundFx.playCinematicWhoosh()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black font-extrabold text-xs shadow-glow"
              >
                <span>Browse Shows</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl flex items-center justify-between gap-3 border border-white/10 bg-[#0c0c12]/80"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white flex-none">
                      <Play className="w-4 h-4 fill-white" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                      <p className="text-[10px] text-zinc-400">
                        {item.type === "tv" ? `S${item.season}:E${item.episode}` : "Movie"} • {item.progressPercent}% completed
                      </p>
                    </div>
                  </div>

                  <Link
                    href={
                      item.type === "tv"
                        ? `/watch/${item.tmdbId}?type=tv&season=${item.season || 1}&episode=${item.episode || 1}`
                        : `/watch/${item.tmdbId}?type=movie`
                    }
                    onClick={() => soundFx.playCinematicSwell()}
                    className="px-3 py-1 rounded-xl bg-white text-black font-bold text-[11px] shadow-glow flex-none"
                  >
                    Resume
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 8. SETTINGS MODAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl p-5 bg-[#0a0a0f]/95 border border-white/20 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto no-scrollbar">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-white" />
                <h3 className="text-sm font-bold text-white">Spectra Engine Settings</h3>
              </div>
              <button
                onClick={() => {
                  soundFx.playCinematicPop();
                  setShowSettingsModal(false);
                }}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Acoustics */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-white" />
                Acoustics & Feedback
              </span>

              <div className="space-y-2 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-white">Synthesizer Sound Effects</h5>
                    <p className="text-[10px] text-zinc-400">Tactile dial ticks and cinematic whooshes</p>
                  </div>
                  <button
                    onClick={toggleSoundMaster}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 border ${
                      audioEnabled ? "bg-white border-white" : "bg-white/10 border-white/20"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full transition-transform ${
                        audioEnabled ? "translate-x-5 bg-black" : "translate-x-0 bg-white"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div>
                    <h5 className="text-xs font-bold text-white">Device Haptic Vibrations</h5>
                    <p className="text-[10px] text-zinc-400">Micro-pulses on category swipes & selections</p>
                  </div>
                  <button
                    onClick={toggleHaptics}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 border ${
                      hapticsEnabled ? "bg-white border-white" : "bg-white/10 border-white/20"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full transition-transform ${
                        hapticsEnabled ? "translate-x-5 bg-black" : "translate-x-0 bg-white"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Playback */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <MonitorPlay className="w-3.5 h-3.5 text-white" />
                Playback Engine
              </span>

              <div className="space-y-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">Default Resolution</span>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase">{defaultQuality}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {["auto", "1080p", "720p", "480p"].map((q) => (
                      <button
                        key={q}
                        onClick={() => handleQualityChange(q)}
                        className={`py-1 rounded-xl text-[10px] font-extrabold uppercase border transition ${
                          defaultQuality === q
                            ? "bg-white text-black border-white shadow-glow"
                            : "bg-white/5 text-zinc-400 border-white/10 hover:text-white"
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div>
                    <h5 className="text-xs font-bold text-white">Auto-Play Next Episode</h5>
                    <p className="text-[10px] text-zinc-400">Launch upcoming episode automatically</p>
                  </div>
                  <button
                    onClick={toggleAutoNext}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 border ${
                      autoNextEp ? "bg-white border-white" : "bg-white/10 border-white/20"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full transition-transform ${
                        autoNextEp ? "translate-x-5 bg-black" : "translate-x-0 bg-white"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Storage */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-white" />
                Data & Storage
              </span>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-white">Browser Storage Used</h5>
                    <p className="text-[10px] text-zinc-400">Posters cache, watch metrics & history</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-white/10 border border-white/15">
                    {storageUsed}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleClearCache}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    {cacheClearedStatus ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Cache Cleared!</span>
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Clear Image Cache</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleFactoryReset}
                    className="py-1.5 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold text-xs transition"
                  >
                    Reset App
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 text-center space-y-0.5 border-t border-white/10">
              <p className="text-[10px] text-zinc-400 font-mono">Spectra Cinema Engine • v2.4.0</p>
              <p className="text-[9px] text-zinc-600">Client Build #2026.09 • PWA Enabled</p>
            </div>
          </div>
        </div>
      )}

      {/* 9. SUPPORT / DONATIONS MODAL */}
      {showDonationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl p-5 bg-[#0c0c14]/95 border border-white/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-white fill-white" />
                <h3 className="text-sm font-bold text-white">Support Spectra</h3>
              </div>
              <button
                onClick={() => {
                  soundFx.playCinematicPop();
                  setShowDonationModal(false);
                }}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Spectra is an ad-free, open media initiative. Contributions directly fund video proxy relays and CDN bandwidth.
            </p>

            <div className="space-y-2">
              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">USDT (TRC20)</p>
                  <p className="text-xs font-mono text-white truncate max-w-[200px]">
                    TX8yJ1...9v2Kd
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard("TX8yJ1spectraDemoAddr9v2Kd", "usdt")}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white text-zinc-200 hover:text-black transition"
                >
                  {copiedKey === "usdt" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <a
                href="https://ko-fi.com"
                target="_blank"
                rel="noreferrer"
                onClick={() => soundFx.playCinematicPop()}
                className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-white text-black font-extrabold text-xs shadow-glow transition active:scale-95"
              >
                <span>Buy us a Coffee (Ko-fi)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
