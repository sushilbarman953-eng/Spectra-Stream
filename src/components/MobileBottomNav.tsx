"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Film, Tv, Download, User } from "lucide-react";
import { downloadManager } from "@/lib/downloadManager";

export const MobileBottomNav = () => {
  const pathname = usePathname();
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

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Movies", href: "/movies", icon: Film },
    { label: "Series", href: "/series", icon: Tv },
    { label: "Downloads", href: "/downloads", icon: Download, badge: downloadCount },
    { label: "Me", href: "/me", icon: User },
  ];

  return (
    <nav className="fixed bottom-3 left-4 right-4 z-50 md:hidden flex justify-center pointer-events-auto">
      <div 
        className="w-full max-w-sm flex items-center justify-around py-2 px-1 rounded-2xl border border-white/20 shadow-[0_10px_35px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.35)]"
        style={{
          background: "rgba(12, 12, 16, 0.70)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-all duration-200 relative ${
                isActive ? "text-white" : "text-zinc-300 hover:text-white"
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all duration-300 relative ${
                  isActive
                    ? "bg-white text-black shadow-[0_0_16px_rgba(255,255,255,0.45)]"
                    : "bg-white/[0.04] border border-white/10"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? "text-black stroke-[2.5]"
                      : "text-white stroke-[2] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  }`}
                />
                {Boolean(item.badge && item.badge > 0) && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-white text-black font-extrabold text-[8px] flex items-center justify-center border border-black shadow-glow">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[9px] tracking-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] ${
                  isActive
                    ? "font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                    : "font-semibold text-zinc-300"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
