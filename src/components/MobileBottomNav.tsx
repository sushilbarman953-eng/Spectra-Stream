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
    <nav className="fixed bottom-3 left-3 right-3 z-50 md:hidden flex justify-center pointer-events-auto">
      <div className="w-full max-w-md flex items-center justify-around py-2 px-1 rounded-full glass-panel bg-black/85 border border-white/15 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-200 ${
                isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <div
                className={`p-1.5 rounded-lg transition-all ${
                  isActive ? "bg-white/20 border border-white/30 shadow-glow" : ""
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-medium tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
