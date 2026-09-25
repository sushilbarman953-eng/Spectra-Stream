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
      <div className="w-full max-w-sm flex items-center justify-around py-2 px-2 rounded-2xl bg-[#09090b]/95 border border-white/20 backdrop-blur-xl shadow-[0_12px_36px_rgba(0,0,0,0.9)]">
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
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive
                    ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                    : "text-zinc-300"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-black stroke-[2.5]" : "text-zinc-300 stroke-[2]"}`} />
              </div>
              <span
                className={`text-[10px] tracking-tight ${
                  isActive ? "font-bold text-white" : "font-medium text-zinc-400"
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
