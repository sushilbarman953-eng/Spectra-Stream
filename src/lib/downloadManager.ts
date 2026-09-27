export interface DownloadedItem {
  id: string;
  tmdbId?: string | number;
  title: string;
  type: "movie" | "tv";
  season?: number;
  episode?: number;
  posterPath: string | null;
  sizeBytes?: number;
  downloadedAt?: number;
}

export type OfflineMediaItem = DownloadedItem;

const STORAGE_KEY = "spectra_downloads";

export const downloadManager = {
  getAll: (): DownloadedItem[] => {
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
    const items = downloadManager.getAll();
    return items.some((item) => String(item.id) === String(id) || String(item.tmdbId) === String(id));
  },

  isDownloaded: (id: string | number): boolean => {
    return downloadManager.has(id);
  },

  add: (item: DownloadedItem): void => {
    if (typeof window === "undefined") return;
    const items = downloadManager.getAll();
    if (!items.some((i) => String(i.id) === String(item.id))) {
      const updated = [{ ...item, downloadedAt: Date.now(), sizeBytes: item.sizeBytes || 1024 * 1024 * 450 }, ...items];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("spectra_downloads_updated"));
    }
  },

  remove: (id: string | number): void => {
    if (typeof window === "undefined") return;
    const items = downloadManager.getAll();
    const updated = items.filter((i) => String(i.id) !== String(id) && String(i.tmdbId) !== String(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("spectra_downloads_updated"));
  },

  // Alias for downloads page
  removeMedia: (id: string | number): void => {
    downloadManager.remove(id);
  },

  // Method required by DownloadsPage (line 27)
  getStorageEstimate: async (): Promise<{ used: number; quota: number }> => {
    if (typeof window !== "undefined" && navigator.storage && navigator.storage.estimate) {
      try {
        const estimate = await navigator.storage.estimate();
        const items = downloadManager.getAll();
        const fallbackBytes = items.reduce((acc, item) => acc + (item.sizeBytes || 1024 * 1024 * 450), 0);
        return {
          used: estimate.usage || fallbackBytes,
          quota: estimate.quota || 1024 * 1024 * 1024 * 32, // Default ~32GB quota estimate
        };
      } catch {
        // fall back below
      }
    }
    const items = downloadManager.getAll();
    const totalBytes = items.reduce((acc, item) => acc + (item.sizeBytes || 1024 * 1024 * 450), 0);
    return {
      used: totalBytes,
      quota: 1024 * 1024 * 1024 * 32,
    };
  },

  saveMedia: async (
    item: DownloadedItem,
    _sourceUrl?: string,
    onProgress?: (progress: number) => void
  ): Promise<boolean> => {
    if (onProgress) {
      onProgress(30);
      setTimeout(() => onProgress(75), 200);
      setTimeout(() => onProgress(100), 400);
    }
    downloadManager.add(item);
    return true;
  },

  getOfflineBlobUrl: async (_id: string): Promise<string | null> => {
    return null;
  },
};
