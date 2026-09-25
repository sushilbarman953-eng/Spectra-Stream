"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Film, Tv, PlaySquare, Compass, Radio, X, Star } from "lucide-react";
import { IMAGE_BASE } from "@/lib/tmdb";

export const Navbar = () => {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          const data = await res.json();
          setResults(data.results || []);
          setIsOpen(true);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { label: "Home", href: "/", icon: Compass },
    { label: "Movies", href: "/movies", icon: Film },
    { label: "Series", href: "/series", icon: Tv },
    { label: "Anime", href: "/anime", icon: PlaySquare },
    { label: "Live TV", href: "/tv", icon: Radio },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex justify-center">
      <div className="w-full max-w-7xl flex items-center justify-between px-5 py-2.5 rounded-2xl glass-panel relative">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-widest text-white uppercase drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
            SPECTRA
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-1 glass-pill p-1 rounded-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 ${
                  isActive
                    ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)] font-bold"
                    : "text-zinc-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Search */}
        <div ref={searchRef} className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setIsOpen(true)}
            placeholder="Search titles..."
            className="w-36 md:w-56 glass-pill rounded-full py-1.5 pl-9 pr-8 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-white/40 focus:w-64 transition-all duration-300"
          />
          <Search className="w-3.5 h-3.5 text-zinc-300 absolute left-3 pointer-events-none" />

          {query && (
            <button
              onClick={() => {
                setQuery("");
                setIsOpen(false);
              }}
              className="absolute right-2.5 text-zinc-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {isOpen && results.length > 0 && (
            <div className="absolute top-12 right-0 w-72 sm:w-80 max-h-96 overflow-y-auto no-scrollbar rounded-2xl glass-panel bg-black/90 p-2 shadow-2xl flex flex-col gap-1 z-50">
              {results.slice(0, 8).map((item) => {
                const title = item.title || item.name || "Untitled";
                const year = (item.release_date || item.first_air_date || "").slice(0, 4);
                const poster = item.poster_path
                  ? `${IMAGE_BASE}/w92${item.poster_path}`
                  : null;

                return (
                  <Link
                    key={item.id}
                    href={`/details/${item.id}?type=${item.media_type}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition group"
                  >
                    <div className="relative w-10 h-14 rounded-lg overflow-hidden bg-zinc-900 flex-none">
                      {poster ? (
                        <Image src={poster} alt={title} fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-[9px] text-zinc-600">N/A</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate group-hover:text-zinc-200">
                        {title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-400">
                        <span className="uppercase">{item.media_type}</span>
                        {year && <span>• {year}</span>}
                        {item.vote_average > 0 && (
                          <span className="flex items-center gap-0.5 text-zinc-300">
                            <Star className="w-2.5 h-2.5 fill-white text-white" />
                            {item.vote_average.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
