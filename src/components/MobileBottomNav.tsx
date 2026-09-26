"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Compass, Search, Download, User } from "lucide-react";
import { downloadManager } from "@/lib/downloadManager";

export const MobileBottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [downloadCount, setDownloadCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const all = downloadManager.getAll();
      setDownloadCount(all.length);
    };

    updateCount();
    window.addEventListener("spectra_downloads_updated", updateCount);
    return () => window.removeEventListener("spectra_downloads_updated", updateCount);
  }, []);

  const triggerSearchFocus = () => {
    // Focus search input or scroll to top to search
    window.scrollTo({ top: 0, behavior: "smooth" });
    const searchInput = document.querySelector("header input") as HTMLInputElement;
    if (searchInput) {
      setTimeout(() => searchInput.focus(), 300);
    } else {
      router.push("/#search");
    }
  };

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-50 md:hidden flex justify-center pointer-events-auto">
      <div 
        className="w-full max-w-md flex items-center justify-around py-1.5 px-2 rounded-2xl border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.35)] relative"
        style={{
          background: "rgba(10, 10, 15, 0.75)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
        }}
      >
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition ${
            pathname === "/" ? "text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <Home className={`w-4 h-4 ${pathname === "/" ? "text-white stroke-[2.5]" : "stroke-[2]"}`} />
          <span className="text-[9px] font-semibold">Home</span>
        </Link>

        {/* 2. Explore */}
        <Link
          href="/movies"
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition ${
            pathname.startsWith("/movies") || pathname.startsWith("/series")
              ? "text-white"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Compass className="w-4 h-4 stroke-[2]" />
          <span className="text-[9px] font-semibold">Explore</span>
        </Link>

        {/* 3. Center Elevated Floating Search Button */}
        <div className="relative -top-5 flex flex-col items-center">
          <button
            onClick={triggerSearchFocus}
            className="w-12 h-12 rounded-full bg-white text-black border-2 border-black flex items-center justify-center shadow-[0_0_24px_rgba(255,255,255,0.6)] active:scale-95 transition-transform"
            title="Search"
          >
            <Search className="w-5 h-5 stroke-[2.5] text-black" />
          </button>
          <span className="text-[8px] font-extrabold text-white mt-1 uppercase tracking-wider">
            Search
          </span>
        </div>

        {/* 4. Downloads */}
        <Link
          href="/downloads"
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

        {/* 5. Me */}
        <Link
          href="/me"
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
