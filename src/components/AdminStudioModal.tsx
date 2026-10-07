"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Layers,
} from "lucide-react";
import { catalogManager, CustomCatalogState } from "@/lib/catalogManager";
import { SafeImage } from "@/components/SafeImage";

interface AdminStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminStudioModal: React.FC<AdminStudioModalProps> = ({ isOpen, onClose }) => {
  const [catalog, setCatalog] = useState<CustomCatalogState | null>(null);
  const [activeTabGroup, setActiveTabGroup] = useState<"home" | "movies" | "series" | "anime" | "tv">("movies");
  const [activeSection, setActiveSection] = useState<keyof CustomCatalogState>("bollywood");
  const [editingItem, setEditingItem] = useState<{ index: number; data: any } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = () => setCatalog(catalogManager.get());
    load();
    window.addEventListener("spectra_catalog_updated", load);
    return () => window.removeEventListener("spectra_catalog_updated", load);
  }, []);

  if (!isOpen || !catalog) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const TAB_GROUPS: Record<string, { id: keyof CustomCatalogState; label: string }[]> = {
    home: [
      { id: "homeHero", label: "Home Carousel" },
      { id: "trendingMovies", label: "Trending Movies" },
      { id: "trendingSeries", label: "Trending Series" },
      { id: "trendingAnime", label: "Trending Anime" },
    ],
    movies: [
      { id: "moviesHero", label: "Movies Carousel" },
      { id: "bollywood", label: "Bollywood" },
      { id: "south", label: "South Indian" },
      { id: "hollywood", label: "Hollywood" },
      { id: "regional", label: "Regional Hits" },
      { id: "franchises", label: "Franchises" },
      { id: "indianStars", label: "Indian Stars" },
      { id: "hollywoodStars", label: "Hollywood Stars" },
    ],
    series: [
      { id: "seriesHero", label: "Series Carousel" },
      { id: "indianWeb", label: "Indian Web Originals" },
      { id: "crimeThrillers", label: "Crime Thrillers" },
      { id: "kdrama", label: "K-Dramas" },
    ],
    anime: [
      { id: "animeHero", label: "Anime Carousel" },
      { id: "hindiDubAnime", label: "Hindi Dubbed Anime" },
      { id: "topShonen", label: "Top Shonen" },
    ],
    tv: [
      { id: "liveChannels", label: "IPTV Live Channels" },
    ],
  };

  const currentList = (catalog[activeSection] as any[]) || [];
  const isCelebritySection = activeSection.includes("Stars");
  const isChannelSection = activeSection === "liveChannels";

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    catalogManager.updateSectionItem(activeSection, editingItem.index, editingItem.data);
    setEditingItem(null);
    showToast("Changes updated live across the app!");
  };

  const handleAddNew = () => {
    let newItem: any;

    if (isCelebritySection) {
      newItem = {
        id: `star_${Date.now()}`,
        name: "New Celebrity",
        role: "Main Lead",
        imageUrl: "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg",
        gradient: "bg-gradient-to-tr from-amber-500 via-zinc-800 to-red-600",
      };
    } else if (isChannelSection) {
      newItem = {
        id: `channel_${Date.now()}`,
        name: "New Live Channel",
        category: "Entertainment",
        streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
      };
    } else {
      newItem = {
        id: Date.now(),
        title: "New Media Title",
        poster_path: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
        backdrop_path: "https://image.tmdb.org/t/p/w1280/yF1xTrentcIS5o99ZpHrP3Xeo2.jpg",
        vote_average: 8.5,
        media_type: activeTabGroup === "movies" ? "movie" : "tv",
        audioLanguages: ["MULTI", "HIN"],
      };
    }

    catalogManager.addSectionItem(activeSection, newItem);
    showToast("Item added!");
  };

  const handleDelete = (index: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      catalogManager.deleteSectionItem(activeSection, index);
      showToast("Item deleted!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[90vh] rounded-3xl bg-[#09090f] border border-white/20 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-600/20 border border-red-500/30">
              <Sparkles className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                Spectra Universal Studio
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-zinc-300">
                  Live CMS
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Edit titles, posters, ratings, audio tags, and actors across every tab
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddNew}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-black font-extrabold text-xs shadow-glow active:scale-95 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
            <button
              onClick={() => {
                if (confirm("Reset everything back to default catalogs?")) {
                  catalogManager.reset();
                  showToast("Catalogs reset!");
                }
              }}
              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs transition"
              title="Reset All"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Switcher: Home | Movies | Series | Anime | TV */}
        <div className="px-4 py-2 border-b border-white/10 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0 bg-black/40">
          {(["home", "movies", "series", "anime", "tv"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTabGroup(tab);
                setActiveSection(TAB_GROUPS[tab][0].id);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase transition ${
                activeTabGroup === tab
                  ? "bg-white text-black font-black shadow-glow"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Sub-Section Pills */}
        <div className="px-4 py-2 border-b border-white/5 flex gap-2 overflow-x-auto no-scrollbar shrink-0 bg-zinc-950/60">
          {TAB_GROUPS[activeTabGroup].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition border ${
                activeSection === sec.id
                  ? "bg-white/20 text-white border-white/30 shadow-sm"
                  : "bg-white/[0.03] text-zinc-400 border-white/5 hover:text-zinc-200"
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="absolute top-16 right-6 z-50 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white text-black font-bold text-xs shadow-2xl">
            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Main Editable Grid */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {currentList.map((item, idx) => {
              const title = item.title || item.name || "Untitled";
              const image = item.poster_path || item.imageUrl || item.backdrop_path;

              return (
                <div
                  key={`${item.id}-${idx}`}
                  className="p-2.5 rounded-2xl bg-[#0c0c14] border border-white/10 flex flex-col justify-between gap-2.5 shadow-md hover:border-white/25 transition"
                >
                  <div className="flex gap-2.5 items-center">
                    <div className="relative w-14 h-20 rounded-xl overflow-hidden bg-zinc-950 border border-white/10 shrink-0">
                      <SafeImage src={image} alt={title} />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <h4 className="text-xs font-bold text-white truncate">{title}</h4>
                      {item.vote_average && (
                        <span className="inline-block text-[10px] text-amber-400 font-bold">
                          ★ {Number(item.vote_average).toFixed(1)}
                        </span>
                      )}
                      {item.audioLanguages && (
                        <span className="block text-[8px] font-bold text-zinc-400">
                          {item.audioLanguages.join(" • ")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-1.5 pt-1.5 border-t border-white/10">
                    <button
                      onClick={() => setEditingItem({ index: idx, data: { ...item } })}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(idx)}
                      className="p-1 rounded-lg text-zinc-500 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Item Edit Form */}
        {editingItem && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-md p-5 rounded-3xl bg-[#0e0e16] border border-white/20 shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-red-500" />
                  Edit Item
                </h4>
                <button onClick={() => setEditingItem(null)} className="text-zinc-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 block mb-1">Title / Name</label>
                  <input
                    type="text"
                    required
                    value={editingItem.data.title || editingItem.data.name || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, title: e.target.value, name: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none"
                  />
                </div>

                {!isCelebritySection && !isChannelSection && (
                  <>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 block mb-1">
                        Poster URL (9:16 Vertical)
                      </label>
                      <input
                        type="url"
                        value={editingItem.data.poster_path || ""}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, poster_path: e.target.value },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 block mb-1">
                        Backdrop URL (16:9 Landscape for Carousel)
                      </label>
                      <input
                        type="url"
                        value={editingItem.data.backdrop_path || ""}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, backdrop_path: e.target.value },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 block mb-1">Rating</label>
                        <input
                          type="number"
                          step="0.1"
                          value={editingItem.data.vote_average || 8.0}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, vote_average: parseFloat(e.target.value) },
                            })
                          }
                          className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 block mb-1">Audio Tags</label>
                        <input
                          type="text"
                          value={editingItem.data.audioLanguages?.join(", ") || "HIN"}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: {
                                ...editingItem.data,
                                audioLanguages: e.target.value.split(",").map((s) => s.trim()),
                              },
                            })
                          }
                          className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                {isCelebritySection && (
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 block mb-1">Celebrity Image URL</label>
                    <input
                      type="url"
                      value={editingItem.data.imageUrl || ""}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, imageUrl: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-3 py-1.5 rounded-xl text-xs text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-black font-extrabold text-xs shadow-glow"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
