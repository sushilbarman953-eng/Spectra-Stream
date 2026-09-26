export interface WatchlistItem {
  id: string;
  title: string;
  type: "movie" | "tv";
  posterPath: string | null;
  voteAverage?: number;
  addedAt: number;
}

const STORAGE_KEY = "spectra_watchlist";

export const watchlistManager = {
  getAll: (): WatchlistItem[] => {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  has: (id: string | number): boolean => {
    if (typeof window === "undefined") return false;
    const items = watchlistManager.getAll();
    return items.some((item) => String(item.id) === String(id));
  },

  isInWatchlist: (id: string | number): boolean => {
    return watchlistManager.has(id);
  },

  add: (item: WatchlistItem): void => {
    if (typeof window === "undefined") return;
    const items = watchlistManager.getAll();
    if (!items.some((i) => String(i.id) === String(item.id))) {
      const updated = [item, ...items];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("spectra_watchlist_updated"));
    }
  },

  remove: (id: string | number): void => {
    if (typeof window === "undefined") return;
    const items = watchlistManager.getAll();
    const updated = items.filter((i) => String(i.id) !== String(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("spectra_watchlist_updated"));
  },

  toggle: (item: WatchlistItem): boolean => {
    if (watchlistManager.has(item.id)) {
      watchlistManager.remove(item.id);
      return false;
    } else {
      watchlistManager.add(item);
      return true;
    }
  },
};
