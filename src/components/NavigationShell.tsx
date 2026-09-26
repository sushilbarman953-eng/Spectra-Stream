"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Radio, Sparkles, Film, Tv, Flame, Search, Mic } from "lucide-react";
import { soundFx } from "@/lib/soundFx";

const TABS = [
  { href: "/tv", label: "Live TV", icon: Radio },
  { href: "/", label: "Home", icon: Sparkles },
  { href: "/movies", label: "Movies", icon: Film },
  { href: "/series", label: "Series", icon: Tv },
  { href: "/anime", label: "Anime", icon: Flame },
];

export const NavigationShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  // Hide rotary dial on details and watch player views
  const isDetailsOrPlayer = pathname.startsWith("/details") || pathname.startsWith("/watch");

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const getActiveTabIdx = () => {
    if (pathname === "/") return 1;
    const idx = TABS.findIndex((t) => t.href !== "/" && pathname.startsWith(t.href));
    return idx >= 0 ? idx : 1;
  };

  const currentTabIdx = getActiveTabIdx();

  // Global horizontal swipe gesture detection
  const handleTouchStart = (e: React.TouchEvent) => {
    // If the touch originated inside a carousel/poster row with data-no-swipe, ignore
    if ((e.target as HTMLElement).closest('[data-no-swipe="true"]')) {
      touchStartX.current = null;
      return;
    }
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null || isDetailsOrPlayer) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Must be predominantly horizontal swipe and at least 50px
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0 && currentTabIdx < TABS.length - 1) {
        // Swiped Left -> Move to Next Tab
        soundFx.playMechanicalTick();
        router.push(TABS[currentTabIdx + 1].href);
      } else if (deltaX > 0 && currentTabIdx > 0) {
        // Swiped Right -> Move to Previous Tab
        soundFx.playMechanicalTick();
        router.push(TABS[currentTabIdx - 1].href);
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="min-h-screen bg-[#08080c] text-white flex flex-col"
    >
      {/* Top Header: Displays Rotary Dial ONLY when not on Details or Player */}
      <header className="sticky top-0 z-40 bg-[#08080c]/85 backdrop-blur-xl border-b border-white/10 px-3 sm:px-6 py-2.5 flex items-center justify-between">
        <Link
          href="/"
          onClick={() => soundFx.playMechanicalTick()}
          className="text-sm font-black tracking-widest uppercase text-white flex items-center gap-1.5"
        >
          <span>SPECTRA</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </Link>

        {/* Rotary Dial Bar */}
        {!isDetailsOrPlayer ? (
          <nav className="flex items-center gap-1 p-1 rounded-2xl bg-white/5 border border-white/10">
            {TABS.map((tab, idx) => {
              const isActive = currentTabIdx === idx;
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  onClick={() => soundFx.playMechanicalTick()}
                  className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? "bg-white text-black shadow-glow font-black"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </nav>
        ) : (
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            {pathname.startsWith("/watch") ? "Spectra Player" : "Dossier View"}
          </div>
        )}

        {/* Right Search Action */}
        <div className="flex items-center gap-1">
          <Link
            href="/explore"
            onClick={() => soundFx.playCinematicPop()}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition border border-white/10"
          >
            <Search className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1">{children}</main>
    </div>
  );
};
