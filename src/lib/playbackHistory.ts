export interface WatchProgressItem {
  id: string;
  tmdbId: string | number;
  type: "movie" | "tv";
  title: string;
  season?: number;
  episode?: number;
  currentTime: number;
  duration: number;
  progressPercent: number;
  posterPath?: string | null;
  backdropPath?: string | null;
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

  save: (item: {
    id: string;
    tmdbId: string | number;
    title: string;
    type: "movie" | "tv";
    season?: number;
    episode?: number;
    currentTime?: number;
    duration?: number;
    progressPercent?: number;
    posterPath?: string | null;
    backdropPath?: string | null;
    lastWatched?: number;
  }): void => {
    if (typeof window === "undefined") return;
    try {
      const current = playbackHistory.getAll();
      const filtered = current.filter(
        (p) => p.id !== item.id && String(p.tmdbId) !== String(item.tmdbId)
      );

      const duration = item.duration || 3600;
      const currentTime = item.currentTime || 0;
      const progressPercent =
        item.progressPercent ??
        Math.min(100, Math.round((currentTime / duration) * 100));

      const updatedItem: WatchProgressItem = {
        id: item.id,
        tmdbId: item.tmdbId,
        type: item.type,
        title: item.title,
        season: item.season,
        episode: item.episode,
        currentTime,
        duration,
        progressPercent,
        posterPath: item.posterPath || null,
        backdropPath: item.backdropPath || null,
        updatedAt: item.lastWatched || Date.now(),
      };

      const updatedList = [updatedItem, ...filtered].slice(0, 20);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      window.dispatchEvent(new Event("spectra_playback_updated"));
    } catch (e) {
      console.error("Playback save error:", e);
    }
  },

  saveProgress: (item: {
    id: string;
    tmdbId: string | number;
    type: "movie" | "tv";
    title: string;
    season?: number;
    episode?: number;
    currentTime: number;
    duration: number;
    posterPath?: string | null;
    backdropPath?: string | null;
  }) => {
    playbackHistory.save(item);
  },

  removeItem: (id: string | number) => {
    if (typeof window === "undefined") return;
    try {
      const current = playbackHistory.getAll();
      const updated = current.filter(
        (p) => p.id !== id && String(p.tmdbId) !== String(id)
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("spectra_playback_updated"));
    } catch (e) {
      console.error(e);
    }
  },

  remove: (id: string | number) => {
    playbackHistory.removeItem(id);
  },

  clearAll: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("spectra_playback_updated"));
  },
};
