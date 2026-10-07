"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Film,
  Sparkles,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Edit3,
  Check,
  ArrowLeft,
  X,
} from "lucide-react";
import { catalogManager, CustomCatalogState } from "@/lib/catalogManager";
import { SafeImage } from "@/components/SafeImage";

export default function AdminPage() {
  const [catalog, setCatalog] = useState<CustomCatalogState | null>(null);
  const [activeSection, setActiveSection] = useState<keyof CustomCatalogState>("bollywood");
  const [editingItem, setEditingItem] = useState<{ index: number; data: any } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = () => setCatalog(catalogManager.get());
    load();
    window.addEventListener("spectra_catalog_updated", load);
    return () => window.removeEventListener("spectra_catalog_updated", load);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    catalogManager.updateSectionItem(activeSection, editingItem.index, editingItem.data);
    setEditingItem(null);
    showToast("Changes saved in real-time!");
  };

  const handleAddNew = () => {
    const isStarSection = activeSection.includes("Stars");
    const newItem = isStarSection
      ? {
          id: `star_${Date.now()}`,
          name: "New Celebrity",
          role: "Main Lead",
          imageUrl: "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg",
          gradient: "bg-gradient-to-tr from-amber-500 via-zinc-800 to-red-600",
        }
      : {
          id: Date.now(),
          title: "New Movie Title",
          poster_path: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
          backdrop_path: "https://image.tmdb.org/t/p/w1280/yF1xTrentcIS5o99ZpHrP3Xeo2.jpg",
          vote_average: 8.5,
          media_type: "movie",
          audioLanguages: ["MULTI", "HIN"],
        };

    catalogManager.addSectionItem(activeSection, newItem);
    showToast("New item added to section!");
  };

  const handleDelete = (index: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      catalogManager.deleteSectionItem(activeSection, index);
      showToast("Item deleted!");
    }
  };

  const handleReset = () => {
    if (confirm("Reset everything back to default catalogs? All edits will be cleared.")) {
      catalogManager.reset();
      showToast("Catalog reset to defaults!");
    }
  };

  if (!catalog) return null;

  const currentList = (catalog[activeSection] as any[]) || [];
  const isCelebritySection = activeSection.includes("Stars");

  const SECTIONS: { id: keyof CustomCatalogState; label: string }[] = [
    { id: "hero", label: "00. Hero Carousel" },
    { id: "bollywood", label: "Bollywood" },
    { id: "south", label: "South Indian" },
    { id: "hollywood", label: "Hollywood" },
    { id: "regional", label: "Regional Hits" },
    { id: "series", label: "TV Series" },
    { id: "indianStars", label: "Indian Stars" },
    { id: "hollywoodStars", label: "Hollywood Stars" },
  ];

  return (
    <div className="min-h-screen bg-[#08080c] text-white p-4 sm:p-8 max-w-7xl mx-auto space-y-6 pb-28">
      {/* Top Navbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-300 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-wide flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-red-500" />
              Spectra Studio Admin
            </h1>
            <p className="text-xs text-zinc-400">
              Live Content Manager: Edit any title, poster, audio tag, or celebrity
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddNew}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-black font-extrabold text-xs shadow-glow hover:bg-zinc-200 transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25 font-bold text-xs transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-black font-extrabold text-xs shadow-2xl animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Section Filter Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? "bg-white text-black border-white shadow-glow font-black"
                  : "bg-white/[0.04] hover:bg-white/10 text-zinc-400 border-white/10"
              }`}
            >
              {sec.label}
            </button>
          );
        })}
      </div>

      {/* Items Grid for Selected Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentList.map((item, idx) => {
          const title = item.title || item.name || "Untitled";
          const image = item.poster_path || item.imageUrl || item.backdrop_path;

          return (
            <div
              key={`${item.id}-${idx}`}
              className="p-3 rounded-2xl bg-[#0c0c14] border border-white/15 flex flex-col justify-between gap-3 shadow-lg"
            >
              <div className="flex gap-3 items-center">
                <div className="relative w-16 h-24 rounded-xl overflow-hidden bg-zinc-950 border border-white/10 shrink-0">
                  <SafeImage src={image} alt={title} />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <h4 className="text-xs font-bold text-white truncate">{title}</h4>
                  {item.vote_average && (
                    <span className="inline-block text-[10px] text-amber-400 font-bold">
                      ★ {item.vote_average}
                    </span>
                  )}
                  {item.role && (
                    <span className="block text-[10px] text-zinc-400 truncate">
                      {item.role}
                    </span>
                  )}
                  {item.audioLanguages && (
                    <span className="inline-block text-[9px] px-1.5 py-0.2 rounded bg-red-600/30 text-red-200 border border-red-500/40">
                      {item.audioLanguages.join(" • ")}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => setEditingItem({ index: idx, data: { ...item } })}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(idx)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-[#0e0e16] border border-white/20 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-red-500" />
                Edit Item Details
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">
                  Title / Celebrity Name
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.data.title || editingItem.data.name || ""}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      data: {
                        ...editingItem.data,
                        title: e.target.value,
                        name: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-white/40"
                />
              </div>

              {!isCelebritySection ? (
                <>
                  <div>
                    <label className="text-xs font-bold text-zinc-400 block mb-1">
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
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-white/40"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-400 block mb-1">
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
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-white/40"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-zinc-400 block mb-1">
                        Rating (e.g., 8.5)
                      </label>
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
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-400 block mb-1">
                        Audio Tags (Comma separated)
                      </label>
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
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-bold text-zinc-400 block mb-1">
                      Celebrity Image URL
                    </label>
                    <input
                      type="url"
                      value={editingItem.data.imageUrl || ""}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, imageUrl: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-400 block mb-1">
                      Role Title
                    </label>
                    <input
                      type="text"
                      value={editingItem.data.role || ""}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, role: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black font-extrabold text-xs shadow-glow hover:bg-zinc-200 transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
