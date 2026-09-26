"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const CATEGORIES = [
  { label: "Home", href: "/" },
  { label: "Movies", href: "/movies" },
  { label: "Series", href: "/series" },
  { label: "Anime", href: "/anime" },
  { label: "Live TV", href: "/tv" },
];

export const CategoryBar = () => {
  const pathname = usePathname();

  return (
    <div className="w-full flex justify-center px-3 sm:px-6 pt-1 pb-3">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 max-w-full">
        {CATEGORIES.map((cat) => {
          const isActive = pathname === cat.href;

          return (
            <Link
              key={cat.href}
              href={cat.href}
              className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide whitespace-nowrap transition-all duration-200 border ${
                isActive
                  ? "bg-white text-black border-white shadow-glow"
                  : "bg-white/5 text-zinc-300 border-white/10 hover:bg-white/15 hover:text-white"
              }`}
              style={{
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
            >
              {cat.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
