export interface WatchlistItem {
  id: string | number;
  title: string;
  type: "movie" | "tv";
  posterPath?: string;
  backdropPath?: string;
  voteAverage?: number;
  overview?: string;
  addedAt: number;
}

const WATCHLIST_KEY = "spectra_user_watchlist";

export const watchlistManager = {
  getAll: (): WatchlistItem[] => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(WATCHLIST_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  isInList: (id: string | number): boolean => {
    const list = watchlistManager.getAll();
    return list.some((item) => String(item.id) === String(id));
  },

  toggle: (item: Omit<WatchlistItem, "addedAt">): boolean => {
    if (typeof window === "undefined") return false;
    try {
      const list = watchlistManager.getAll();
      const exists = list.some((i) => String(i.id) === String(item.id));

      let updated: WatchlistItem[];
      if (exists) {
        updated = list.filter((i) => String(i.id) !== String(item.id));
      } else {
        const newItem: WatchlistItem = {
          ...item,
          addedAt: Date.now(),
        };
        updated = [newItem, ...list];
      }

      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("spectra_watchlist_updated"));
      return !exists;
    } catch (e) {
      console.error("Watchlist toggle error:", e);
      return false;
    }
  },

  remove: (id: string | number) => {
    if (typeof window === "undefined") return;
    try {
      const list = watchlistManager.getAll();
      const updated = list.filter((i) => String(i.id) !== String(id));
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("spectra_watchlist_updated"));
    } catch (e) {
      console.error(e);
    }
  },
};
