"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Bookmark,
  History,
  Heart,
  MessageSquare,
  Share2,
  Coffee,
  Settings,
  LogOut,
  LogIn,
  ChevronRight,
  ShieldCheck,
  Trash2,
  Sparkles,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

export default function MePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);
  const [listCount, setListCount] = useState(0);

  useEffect(() => {
    try {
      const history = localStorage.getItem("spectra_watch_progress");
      if (history) {
        setHistoryCount(Object.keys(JSON.parse(history)).length);
      }
      const watchlist = localStorage.getItem("spectra_watchlist");
      if (watchlist) {
        setListCount(JSON.parse(watchlist).length);
      }
    } catch {
      // Storage access
    }
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Spectra Cinema",
          text: "Check out Spectra for free movies, anime, and live TV in monochrome glass!",
          url: window.location.origin,
        });
      } catch {
        // User cancel
      }
    } else {
      navigator.clipboard.writeText(window.location.origin);
      alert("Spectra link copied to clipboard!");
    }
  };

  const clearAppData = () => {
    if (confirm("Clear local watch history and cache?")) {
      localStorage.removeItem("spectra_watch_progress");
      localStorage.removeItem("spectra_recent_searches");
      setHistoryCount(0);
      alert("Cache cleared successfully!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 pb-28 space-y-6">
      {/* 1. Profile Header Card */}
      <GlassCard className="p-5 rounded-3xl border border-white/20 bg-[#0c0c10]/80 shadow-[0_12px_40px_rgba(0,0,0,0.7)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-glow">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-lg font-bold text-white tracking-wide">
                {isLoggedIn ? "Spectra Member" : "Guest Explorer"}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 border border-white/15 text-zinc-300">
                {isLoggedIn ? "PRO" : "FREE"}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              {isLoggedIn ? "Sync active across all devices" : "Local storage profile"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition border ${
            isLoggedIn
              ? "bg-white/10 text-white border-white/20 hover:bg-white/15"
              : "bg-white text-black border-white shadow-glow"
          }`}
        >
          {isLoggedIn ? (
            <>
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </>
          ) : (
            <>
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </>
          )}
        </button>
      </GlassCard>

      {/* 2. Library & Activity Hub */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest px-1 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          My Library
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* My List */}
          <Link href="/watchlist" className="group">
            <GlassCard hoverEffect className="p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <Bookmark className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">My List</h4>
                  <p className="text-[10px] text-zinc-400">{listCount} Saved</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
            </GlassCard>
          </Link>

          {/* Watch History */}
          <Link href="/" className="group">
            <GlassCard hoverEffect className="p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <History className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">History</h4>
                  <p className="text-[10px] text-zinc-400">{historyCount} Resumes</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
            </GlassCard>
          </Link>

          {/* Liked Titles */}
          <div className="cursor-pointer group">
            <GlassCard hoverEffect className="p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Liked</h4>
                  <p className="text-[10px] text-zinc-400">Favorites</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
            </GlassCard>
          </div>
        </div>
      </div>

      {/* 3. Community & Support Actions */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest px-1">
          Community & Social
        </span>

        <div className="flex flex-col gap-2">
          {/* Comments */}
          <div className="cursor-pointer">
            <GlassCard hoverEffect className="p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">My Comments & Reviews</h4>
                  <p className="text-[10px] text-zinc-400">Manage your episode commentary</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500" />
            </GlassCard>
          </div>

          {/* Share */}
          <div onClick={handleShare} className="cursor-pointer">
            <GlassCard hoverEffect className="p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <Share2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Share Spectra</h4>
                  <p className="text-[10px] text-zinc-400">Invite friends to watch together</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500" />
            </GlassCard>
          </div>

          {/* Donate */}
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <GlassCard hoverEffect className="p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <Coffee className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Donate & Support Project</h4>
                  <p className="text-[10px] text-zinc-400">Keep Spectra 100% free and open-source</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500" />
            </GlassCard>
          </a>
        </div>
      </div>

      {/* 4. Settings & Storage Control */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest px-1">
          Settings & Local Data
        </span>

        <div className="flex flex-col gap-2">
          {/* Settings */}
          <div className="cursor-pointer">
            <GlassCard hoverEffect className="p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <Settings className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">App Preferences</h4>
                  <p className="text-[10px] text-zinc-400">Autoplay, default audio, stream server defaults</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500" />
            </GlassCard>
          </div>

          {/* Clear Cache */}
          <div onClick={clearAppData} className="cursor-pointer">
            <GlassCard hoverEffect className="p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-red-400">Clear Storage Cache</h4>
                  <p className="text-[10px] text-zinc-400">Erase search queries and local watch logs</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500" />
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
