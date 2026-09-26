"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Mic,
  MicOff,
  History,
  Trash2,
  Star,
  Film,
  Tv,
  PlaySquare,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useSearch } from "@/context/SearchContext";
import { IMAGE_BASE } from "@/lib/tmdb";

const RECENT_SEARCHES_KEY = "spectra_recent_searches";

export const SearchModal = () => {
  const router = useRouter();
  const { isSearchOpen, closeSearch } = useSearch();

  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "movie" | "tv">("all");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Load recent searches
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch (e) {
      console.error(e);
    }
  }, [isSearchOpen]);

  // Auto focus input when opened
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
    }
  }, [isSearchOpen]);

  // Voice Search setup
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
          saveRecentSearch(transcript);
        }
        setIsListening(false);
      };

      recognizer.onerror = () => setIsListening(false);
      recognizer.onend = () => setIsListening(false);
      recognitionRef.current = recognizer;
    }
  }, []);

  const saveRecentSearch = useCallback((term: string) => {
    const clean = term.trim();
    if (!clean) return;

    setRecentSearches((prev) => {
      const updated = [clean, ...prev.filter((t) => t.toLowerCase() !== clean.toLowerCase())].slice(0, 8);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  }, []);

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleVoiceSearch = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        // Voice recognition initiation
      }
    }
  };

  // Debounced search fetch
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch (err) {
        console.error("Search API error:", err);
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Filtered Results
  const filteredResults = results.filter((item) => {
    if (filterType === "all") return true;
    return item.media_type === filterType;
  });

  const handleSelectMedia = (item: any) => {
    saveRecentSearch(query || item.title || item.name);
    closeSearch();
    router.push(`/details/${item.id}?type=${item.media_type}`);
  };

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#08080c]/95 backdrop-blur-2xl animate-in fade-in duration-200">
      {/* Search Header Container */}
      <div className="p-4 sm:p-6 pb-2 border-b border-white/10 max-w-4xl mx-auto w-full space-y-3">
        {/* Top Input Bar */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isListening ? "Listening..." : "Search movies, series, anime..."}
              className={`w-full py-3 pl-10 pr-20 rounded-2xl text-sm text-white placeholder-zinc-400 bg-white/[0.06] border border-white/20 focus:outline-none focus:border-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] transition ${
                isListening ? "border-red-500 bg-red-950/20" : ""
              }`}
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />

            <div className="absolute right-3 flex items-center gap-1.5">
              <button
                onClick={toggleVoiceSearch}
                className={`p-1.5 rounded-full transition ${
                  isListening ? "bg-red-500 text-white animate-pulse" : "text-zinc-400 hover:text-white"
                }`}
                title="Voice Search"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    setResults([]);
                  }}
                  className="p-1 rounded-full text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={closeSearch}
            className="p-2.5 rounded-2xl bg-white/5 border border-white/15 text-zinc-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Chips: All | Movies | Series */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1 rounded-xl text-xs font-semibold border transition ${
              filterType === "all"
                ? "bg-white text-black border-white shadow-glow"
                : "bg-white/5 text-zinc-400 border-white/10 hover:text-white"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType("movie")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition ${
              filterType === "movie"
                ? "bg-white text-black border-white shadow-glow"
                : "bg-white/5 text-zinc-400 border-white/10 hover:text-white"
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Movies</span>
          </button>
          <button
            onClick={() => setFilterType("tv")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition ${
              filterType === "tv"
                ? "bg-white text-black border-white shadow-glow"
                : "bg-white/5 text-zinc-400 border-white/10 hover:text-white"
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Series & Anime</span>
          </button>
        </div>
      </div>

      {/* Main Results / History Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6 max-w-4xl mx-auto w-full space-y-4">
        {/* Loading Spinner */}
        {loading && (
          <div className="flex items-center justify-center py-10 gap-2 text-zinc-400 text-xs">
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Scanning Spectra library...</span>
          </div>
        )}

        {/* Recent Searches (when query is empty) */}
        {!query && recentSearches.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-white" />
                Recent Searches
              </span>
              <button
                onClick={clearRecentSearches}
                className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-red-400 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setQuery(term);
                    saveRecentSearch(term);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-300 bg-white/5 border border-white/10 hover:bg-white/15 hover:text-white transition"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results Grid */}
        {filteredResults.length > 0 && (
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Matches ({filteredResults.length})
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredResults.map((item) => {
                const itemTitle = item.title || item.name || "Untitled";
                const year = (item.release_date || item.first_air_date || "").slice(0, 4);
                const poster = item.poster_path ? `${IMAGE_BASE}/w185${item.poster_path}` : null;

                return (
                  <div
                    key={`${item.media_type}-${item.id}`}
                    onClick={() => handleSelectMedia(item)}
                    className="flex items-center gap-3 p-2 rounded-2xl border border-white/10 bg-[#0e0e14]/70 hover:border-white/30 hover:bg-white/10 transition cursor-pointer group"
                  >
                    <div className="relative w-12 h-16 rounded-xl overflow-hidden bg-zinc-950 flex-none border border-white/10">
                      {poster ? (
                        <Image src={poster} alt={itemTitle} fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-[9px] text-zinc-600">N/A</div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-zinc-200">
                        {itemTitle}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                        <span className="uppercase font-semibold px-1.5 py-0.5 rounded bg-white/10 text-zinc-300">
                          {item.media_type === "tv" ? "Series" : "Movie"}
                        </span>
                        {year && <span>{year}</span>}
                        {item.vote_average > 0 && (
                          <span className="flex items-center gap-0.5 text-zinc-200 font-semibold">
                            <Star className="w-2.5 h-2.5 fill-white text-white" />
                            {item.vote_average.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state when query produces no matches */}
        {query && !loading && filteredResults.length === 0 && (
          <div className="py-16 text-center space-y-2">
            <p className="text-sm font-semibold text-white">No results found for &ldquo;{query}&rdquo;</p>
            <p className="text-xs text-zinc-400">Try searching with a different spelling or title keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
};
