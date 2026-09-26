export interface DownloadedItem {
  id: string;
  title: string;
  type: "movie" | "tv";
  posterPath: string | null;
  sizeBytes?: number;
  downloadedAt?: number;
}

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
    return items.some((item) => String(item.id) === String(id));
  },

  isDownloaded: (id: string | number): boolean => {
    return downloadManager.has(id);
  },

  add: (item: DownloadedItem): void => {
    if (typeof window === "undefined") return;
    const items = downloadManager.getAll();
    if (!items.some((i) => String(i.id) === String(item.id))) {
      const updated = [{ ...item, downloadedAt: Date.now() }, ...items];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("spectra_downloads_updated"));
    }
  },

  remove: (id: string | number): void => {
    if (typeof window === "undefined") return;
    const items = downloadManager.getAll();
    const updated = items.filter((i) => String(i.id) !== String(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("spectra_downloads_updated"));
  },
};
