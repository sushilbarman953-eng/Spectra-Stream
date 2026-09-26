"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Home,
  Film,
  Tv,
  PlaySquare,
  Radio,
  Download,
  X,
  Star,
  Sparkles,
  Mic,
  MicOff,
  History,
  Trash2,
  User,
} from "lucide-react";
import { IMAGE_BASE } from "@/lib/tmdb";

const QUICK_EXPLORE_GENRES = [
  { name: "Live TV", href: "/tv" },
  { name: "Anime Hub", href: "/anime" },
  { name: "Action", href: "/movies?genre=28" },
  { name: "Sci-Fi", href: "/movies?genre=878" },
  { name: "Horror", href: "/movies?genre=27" },
  { name: "Drama", href: "/series?genre=18" },
];

const RECENT_SEARCHES_KEY = "spectra_recent_searches";

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isListening, setIsListening] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveRecentSearch = useCallback((term: string) => {
    const clean = term.trim();
    if (!clean) return;

    setRecentSearches((prev) => {
      const updated = [clean, ...prev.filter((t) => t.toLowerCase() !== clean.toLowerCase())].slice(0, 6);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  }, []);

  const clearRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = false;
      recognizer.interimResults = false;
      recognizer.lang = "en-US";

      recognizer.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setQuery(transcript);
          setIsOpen(true);
          saveRecentSearch(transcript);
        }
        setIsListening(false);
      };

      recognizer.onerror = () => setIsListening(false);
      recognizer.onend = () => setIsListening(false);
      recognitionRef.current = recognizer;
    }
  }, [saveRecentSearch]);

  const toggleVoiceSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setIsOpen(true);
      } catch {
        // Speech API
      }
    }
  };

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
          setSelectedIndex(-1);
        }
      } catch (err) {
        console.error("Search API error:", err);
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        const item = results[selectedIndex];
        saveRecentSearch(query || item.title || item.name);
        setIsOpen(false);
        router.push(`/details/${item.id}?type=${item.media_type}`);
      } else if (query.trim()) {
        saveRecentSearch(query);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Movies", href: "/movies", icon: Film },
    { label: "Series", href: "/series", icon: Tv },
    { label: "Anime", href: "/anime", icon: PlaySquare },
    { label: "Live TV", href: "/tv", icon: Radio },
    { label: "Downloads", href: "/downloads", icon: Download },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 py-3 flex justify-center">
      <div
        className="w-full max-w-7xl flex items-center justify-between px-3 sm:px-5 py-2 rounded-2xl border border-white/20 shadow-[0_10px_35px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.35)] relative"
        style={{
          background: "rgba(12, 12, 16, 0.65)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
        }}
      >
        <Link href="/" className="flex items-center gap-2">
          <span className="text-base sm:text-lg font-extrabold tracking-widest text-white uppercase drop-shadow-[0_2px_8px_rgba(255,255,255,0.45)]">
            SPECTRA
          </span>
        </Link>

        {/* Desktop Tabs */}
        <nav
          className="hidden md:flex items-center gap-1 p-1 rounded-full border border-white/15"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.2)",
          }}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] ${
                  isActive
                    ? "bg-white text-black shadow-[0_0_16px_rgba(255,255,255,0.45)]"
                    : "text-zinc-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Search & Me */}
        <div className="flex items-center gap-2">
          <div ref={searchRef} className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "Listening..." : "Search..."}
              className={`w-32 sm:w-48 md:w-56 rounded-full py-1.5 pl-8 pr-12 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-white/50 focus:w-44 sm:focus:w-60 transition-all duration-300 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] ${
                isListening ? "border-red-500/80 bg-red-950/20" : ""
              }`}
              style={{
                background: isListening ? "rgba(127, 29, 29, 0.25)" : "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
            />
            <Search className="w-3.5 h-3.5 text-zinc-300 absolute left-2.5 pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />

            <div className="absolute right-2 flex items-center gap-1">
              <button
                onClick={toggleVoiceSearch}
                className={`p-1 rounded-full transition ${
                  isListening ? "bg-red-500 text-white animate-pulse" : "text-zinc-400 hover:text-white"
                }`}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>

              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    setResults([]);
                    setSelectedIndex(-1);
                  }}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {isOpen && (
              <div
                className="absolute top-12 right-0 w-72 sm:w-88 max-h-[85vh] overflow-y-auto no-scrollbar rounded-2xl border border-white/20 p-3 shadow-[0_16px_40px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.3)] flex flex-col gap-3 z-50 animate-in fade-in zoom-in-95 duration-150"
                style={{
                  background: "rgba(12, 12, 16, 0.95)",
                  backdropFilter: "blur(24px) saturate(180%)",
                  WebkitBackdropFilter: "blur(24px) saturate(180%)",
                }}
              >
                {!query && recentSearches.length > 0 && (
                  <div className="pb-2 border-b border-white/10">
                    <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                      <span className="flex items-center gap-1.5">
                        <History className="w-3 h-3 text-white" />
                        Recent Searches
                      </span>
                      <button
                        onClick={clearRecentSearches}
                        className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => {
                            setQuery(term);
                            saveRecentSearch(term);
                          }}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-zinc-300 bg-white/5 border border-white/10 hover:bg-white/15 hover:text-white transition"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!query && (
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                      <Sparkles className="w-3 h-3 text-white" />
                      Explore
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_EXPLORE_GENRES.map((g) => (
                        <Link
                          key={g.name}
                          href={g.href}
                          onClick={() => setIsOpen(false)}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-semibold text-zinc-200 bg-white/5 border border-white/10 hover:bg-white hover:text-black transition"
                        >
                          {g.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {results.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                      Results ({results.length})
                    </span>
                    {results.slice(0, 8).map((item, index) => {
                      const itemTitle = item.title || item.name || "Untitled";
                      const year = (item.release_date || item.first_air_date || "").slice(0, 4);
                      const poster = item.poster_path ? `${IMAGE_BASE}/w92${item.poster_path}` : null;
                      const isSelected = selectedIndex === index;

                      return (
                        <Link
                          key={item.id}
                          href={`/details/${item.id}?type=${item.media_type}`}
                          onClick={() => {
                            saveRecentSearch(itemTitle);
                            setIsOpen(false);
                          }}
                          className={`flex items-center gap-3 p-1.5 rounded-xl transition group ${
                            isSelected
                              ? "bg-white/20 border border-white/30"
                              : "hover:bg-white/10 border border-transparent"
                          }`}
                        >
                          <div className="relative w-9 h-12 rounded-lg overflow-hidden bg-zinc-900 flex-none border border-white/10">
                            {poster ? (
                              <Image src={poster} alt={itemTitle} fill className="object-cover" />
                            ) : (
                              <div className="flex items-center justify-center h-full text-[8px] text-zinc-600">N/A</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate text-white">
                              {itemTitle}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-zinc-400">
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
            )}
          </div>

          <Link
            href="/me"
            className={`p-1.5 rounded-full border transition duration-200 flex items-center justify-center ${
              pathname === "/me"
                ? "bg-white text-black border-white shadow-glow"
                : "border-white/20 text-zinc-300 hover:text-white hover:bg-white/10"
            }`}
            style={{
              background: pathname === "/me" ? "#fff" : "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(16px)",
            }}
            title="Profile & Library"
          >
            <User className={`w-4 h-4 ${pathname === "/me" ? "stroke-[2.5]" : "stroke-[2]"}`} />
          </Link>
        </div>
      </div>
    </header>
  );
};
