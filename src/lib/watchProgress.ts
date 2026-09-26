export interface WatchProgressItem {
  id: string;
  type: "movie" | "tv";
  season?: number;
  episode?: number;
  currentTime: number;
  duration: number;
  progressPercent: number;
  updatedAt: number;
}

const STORAGE_KEY = "spectra_watch_progress";

export const watchProgress = {
  get: (id: string, season: number = 1, episode: number = 1): WatchProgressItem | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const all: Record<string, WatchProgressItem> = JSON.parse(raw);
      const key = `${id}-s${season}-e${episode}`;
      return all[key] || null;
    } catch {
      return null;
    }
  },

  save: (
    id: string,
    type: "movie" | "tv",
    season: number,
    episode: number,
    currentTime: number,
    duration: number
  ) => {
    try {
      if (!duration || duration <= 0) return;
      const raw = localStorage.getItem(STORAGE_KEY);
      const all: Record<string, WatchProgressItem> = raw ? JSON.parse(raw) : {};
      const key = `${id}-s${season}-e${episode}`;
      const progressPercent = Math.min(100, Math.floor((currentTime / duration) * 100));

      all[key] = {
        id,
        type,
        season,
        episode,
        currentTime,
        duration,
        progressPercent,
        updatedAt: Date.now(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch (e) {
      console.error("Failed to save progress:", e);
    }
  },
};
