"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Search, Download, User } from "lucide-react";
import { downloadManager } from "@/lib/downloadManager";
import { soundFx } from "@/lib/soundFx";

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const [downloadCount, setDownloadCount] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const lastScrollY = useRef<number>(0);

  useEffect(() => {
    const updateCount = () => {
      const items = downloadManager.getAll();
      setDownloadCount(items.length);
    };

    updateCount();
    window.addEventListener("spectra_downloads_updated", updateCount);
    return () => window.removeEventListener("spectra_downloads_updated", updateCount);
  }, []);

  // Directional scroll listener: hides when scrolling down, reappears when scrolling up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDiff = currentScrollY - lastScrollY.current;

      // Only trigger if scroll delta is noticeable (> 8px)
      if (Math.abs(scrollDiff) > 8) {
        if (currentScrollY > 60 && scrollDiff > 0) {
          // Scrolling DOWN -> Sink dock
          setIsVisible(false);
        } else {
          // Scrolling UP -> Reveal dock
          setIsVisible(true);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide on player page
  if (pathname.startsWith("/watch")) return null;

  const NAV_ITEMS = [
    { href: "/", label: "Home", icon: Home },
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/explore?search=true", label: "SEARCH", icon: Search, isCenter: true },
    { href: "/downloads", label: "Downloads", icon: Download, badge: downloadCount },
    { href: "/me", label: "Me", icon: User },
  ];

  return (
    <nav
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-md transition-all duration-300 ease-out select-none ${
        isVisible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-[150%] opacity-0 pointer-events-none"
      }`}
    >
      <div className="relative rounded-3xl bg-[#0b0b12]/90 backdrop-blur-2xl border border-white/10 px-4 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.85)]">
        <div className="flex items-center justify-between">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            if (item.isCenter) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => soundFx.playCinematicPop()}
                  className="relative -top-5 flex flex-col items-center group focus:outline-none"
                >
                  {/* Glowing background aura */}
                  <div className="absolute inset-0 w-12 h-12 rounded-full bg-white/25 blur-lg pointer-events-none" />

                  {/* Circular White Button */}
                  <div className="relative w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_24px_rgba(255,255,255,0.45)] transition-transform active:scale-90 group-hover:scale-105 border border-white/60">
                    <Icon className="w-5 h-5 stroke-[2.5]" />
                  </div>

                  <span className="text-[9px] font-black uppercase tracking-wider text-white mt-1">
                    {item.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => soundFx.playMechanicalTick()}
                className="flex flex-col items-center py-0.5 px-2 rounded-xl relative transition-all group focus:outline-none"
              >
                <div className="relative">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? "text-white stroke-[2.5]"
                        : "text-zinc-400 group-hover:text-zinc-200 stroke-[1.75]"
                    }`}
                  />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[14px] h-[14px] px-0.5 rounded-full bg-white text-black text-[8px] font-mono font-black flex items-center justify-center shadow-md">
                      {item.badge}
                    </span>
                  )}
                </div>

                <span
                  className={`text-[9px] tracking-tight mt-1 transition-colors ${
                    isActive
                      ? "text-white font-bold"
                      : "text-zinc-400 group-hover:text-zinc-200 font-medium"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
