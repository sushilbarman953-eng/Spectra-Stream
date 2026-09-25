export interface SavedMedia {
  id: string;
  type: "movie" | "tv";
  title: string;
  poster: string;
  season?: number;
  episode?: number;
  timestamp?: number;
}

const WATCHLIST_KEY = "spectra_watchlist";
const PROGRESS_KEY = "spectra_progress";

export const storage = {
  getWatchlist: (): SavedMedia[] => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(WATCHLIST_KEY) || "[]");
    } catch {
      return [];
    }
  },

  toggleWatchlist: (item: SavedMedia): boolean => {
    const list = storage.getWatchlist();
    const exists = list.some((i) => i.id === item.id);
    let updated: SavedMedia[];

    if (exists) {
      updated = list.filter((i) => i.id !== item.id);
    } else {
      updated = [item, ...list];
    }

    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
    return !exists;
  },

  isSaved: (id: string): boolean => {
    const list = storage.getWatchlist();
    return list.some((i) => i.id === id);
  },

  saveProgress: (item: SavedMedia) => {
    if (typeof window === "undefined") return;
    const history: SavedMedia[] = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "[]");
    const filtered = history.filter((i) => i.id !== item.id);
    const updated = [{ ...item, timestamp: Date.now() }, ...filtered].slice(0, 15);
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));
  },

  getProgress: (): SavedMedia[] => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "[]");
    } catch {
      return [];
    }
  },
};
