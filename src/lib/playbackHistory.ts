export interface WatchProgressItem {
  id: string;
  tmdbId: string | number;
  title: string;
  type: "movie" | "tv";
  season?: number;
  episode?: number;
  posterPath: string | null;
  currentTime?: number;
  duration?: number;
  progressPercent: number;
  lastWatched: number;
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

  get: (id: string): WatchProgressItem | undefined => {
    const list = playbackHistory.getAll();
    return list.find((item) => item.id === id);
  },

  save: (item: WatchProgressItem): void => {
    if (typeof window === "undefined") return;
    try {
      const current = playbackHistory.getAll();
      const filtered = current.filter((i) => i.id !== item.id && i.tmdbId !== item.tmdbId);
      const updated = [item, ...filtered].slice(0, 20); // Keep latest 20 items

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("spectra_playback_updated"));
    } catch (e) {
      console.error("Failed to save playback progress:", e);
    }
  },

  // Alias for backward compatibility
  add: (item: WatchProgressItem): void => {
    playbackHistory.save(item);
  },

  updateProgress: (
    tmdbId: string | number,
    progressPercent: number,
    currentTime?: number,
    duration?: number
  ): void => {
    const current = playbackHistory.getAll();
    const existing = current.find((i) => String(i.tmdbId) === String(tmdbId));
    if (existing) {
      playbackHistory.save({
        ...existing,
        progressPercent,
        currentTime: currentTime ?? existing.currentTime,
        duration: duration ?? existing.duration,
        lastWatched: Date.now(),
      });
    }
  },

  remove: (id: string): void => {
    if (typeof window === "undefined") return;
    const current = playbackHistory.getAll();
    const updated = current.filter((item) => item.id !== id && String(item.tmdbId) !== String(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("spectra_playback_updated"));
  },

  clear: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("spectra_playback_updated"));
  }
};
