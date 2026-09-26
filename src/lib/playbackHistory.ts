export interface WatchProgressItem {
  id: string; // tmdbId or composite
  tmdbId: string;
  type: "movie" | "tv";
  title: string;
  season?: number;
  episode?: number;
  currentTime: number;
  duration: number;
  progressPercent: number;
  posterPath?: string;
  backdropPath?: string;
  updatedAt: number;
}

const STORAGE_KEY = "spectra_playback_history";

export const playbackHistory = {
  getAll: (): WatchProgressItem[] => {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveProgress: (item: Omit<WatchProgressItem, "updatedAt" | "progressPercent">) => {
    if (typeof window === "undefined" || !item.duration || item.duration <= 0) return;
    try {
      const percent = Math.min(100, Math.round((item.currentTime / item.duration) * 100));
      // Don't save if watched less than 1% or already 95%+ (considered finished)
      if (percent < 1) return;

      const current = playbackHistory.getAll();
      const filtered = current.filter((p) => p.id !== item.id);

      // If finished (>95%), remove from Continue Watching
      if (percent >= 95) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        window.dispatchEvent(new Event("spectra_playback_updated"));
        return;
      }

      const updatedItem: WatchProgressItem = {
        ...item,
        progressPercent: percent,
        updatedAt: Date.now(),
      };

      const updatedList = [updatedItem, ...filtered].slice(0, 20); // Keep last 20
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      window.dispatchEvent(new Event("spectra_playback_updated"));
    } catch (e) {
      console.error("Playback save error:", e);
    }
  },

  removeItem: (id: string) => {
    if (typeof window === "undefined") return;
    try {
      const current = playbackHistory.getAll();
      const updated = current.filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("spectra_playback_updated"));
    } catch (e) {
      console.error(e);
    }
  },
};
