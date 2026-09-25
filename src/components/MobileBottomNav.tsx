"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Film, Tv, PlaySquare, Radio } from "lucide-react";

export const MobileBottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/", icon: Compass },
    { label: "Movies", href: "/movies", icon: Film },
    { label: "Series", href: "/series", icon: Tv },
    { label: "Anime", href: "/anime", icon: PlaySquare },
    { label: "Live TV", href: "/tv", icon: Radio },
  ];

  return (
    <nav className="fixed bottom-3 left-4 right-4 z-50 md:hidden flex justify-center pointer-events-auto">
      <div 
        className="w-full max-w-sm flex items-center justify-around py-2 px-2 rounded-2xl border border-white/20 shadow-[0_10px_35px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.35)]"
        style={{
          background: "rgba(12, 12, 16, 0.62)",
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
              className={`flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-white"
                  : "text-zinc-300 hover:text-white"
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all duration-300 ${
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
              </div>
              <span
                className={`text-[10px] tracking-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] ${
                  isActive
                    ? "font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                    : "font-semibold text-zinc-200"
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
