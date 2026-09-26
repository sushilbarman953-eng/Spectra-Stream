"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Search, Download, User } from "lucide-react";
import { downloadManager } from "@/lib/downloadManager";
import { useSearch } from "@/context/SearchContext";
import { soundFx } from "@/lib/soundFx";

export const MobileBottomNav = () => {
  const pathname = usePathname();
  const { openSearch } = useSearch();
  const [downloadCount, setDownloadCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 30) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      if (currentScrollY > lastScrollY.current + 8) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current - 8) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateCount = () => {
      setDownloadCount(downloadManager.getAll().length);
    };

    updateCount();
    window.addEventListener("spectra_downloads_updated", updateCount);
    return () => window.removeEventListener("spectra_downloads_updated", updateCount);
  }, []);

  const handleNavClick = () => {
    soundFx.playGlassTap();
  };

  return (
    <nav
      className={`fixed bottom-3 left-3 right-3 z-50 md:hidden flex justify-center pointer-events-auto transition-all duration-300 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-28 opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="w-full max-w-md flex items-center justify-around py-1.5 px-2 rounded-2xl border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.35)] relative"
        style={{
          background: "rgba(10, 10, 15, 0.75)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
        }}
      >
        <Link
          href="/"
          onClick={handleNavClick}
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition ${
            pathname === "/" ? "text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <Home className={`w-4 h-4 ${pathname === "/" ? "text-white stroke-[2.5]" : "stroke-[2]"}`} />
          <span className="text-[9px] font-semibold">Home</span>
        </Link>

        <Link
          href="/explore"
          onClick={handleNavClick}
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition ${
            pathname === "/explore" ? "text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <Compass className={`w-4 h-4 ${pathname === "/explore" ? "text-white stroke-[2.5]" : "stroke-[2]"}`} />
          <span className="text-[9px] font-semibold">Explore</span>
        </Link>

        <div className="relative -top-5 flex flex-col items-center">
          <button
            onClick={() => {
              soundFx.playGlassTap();
              openSearch();
            }}
            className="w-12 h-12 rounded-full bg-white text-black border-2 border-black flex items-center justify-center shadow-[0_0_24px_rgba(255,255,255,0.6)] active:scale-95 transition-transform"
            title="Open Search"
          >
            <Search className="w-5 h-5 stroke-[2.5] text-black" />
          </button>
          <span className="text-[8px] font-extrabold text-white mt-1 uppercase tracking-wider">
            Search
          </span>
        </div>

        <Link
          href="/downloads"
          onClick={handleNavClick}
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition relative ${
            pathname === "/downloads" ? "text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <div className="relative">
            <Download className={`w-4 h-4 ${pathname === "/downloads" ? "text-white stroke-[2.5]" : "stroke-[2]"}`} />
            {downloadCount > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-white text-black font-extrabold text-[8px] flex items-center justify-center border border-black shadow-glow">
                {downloadCount}
              </span>
            )}
          </div>
          <span className="text-[9px] font-semibold">Downloads</span>
        </Link>

        <Link
          href="/me"
          onClick={handleNavClick}
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition ${
            pathname === "/me" ? "text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <User className={`w-4 h-4 ${pathname === "/me" ? "text-white stroke-[2.5]" : "stroke-[2]"}`} />
          <span className="text-[9px] font-semibold">Me</span>
        </Link>
      </div>
    </nav>
  );
};
