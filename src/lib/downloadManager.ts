export interface DownloadItem {
  id: string;
  tmdbId: string;
  title: string;
  type: "movie" | "tv";
  season?: number;
  episode?: number;
  posterPath?: string;
  fileSizeMb: number;
  progress: number;
  status: "completed" | "downloading" | "paused";
  downloadedAt: number;
  streamUrl: string;
}

const STORAGE_KEY = "spectra_downloads";

export const downloadManager = {
  getAll: (): DownloadItem[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  startDownload: (item: Omit<DownloadItem, "progress" | "status" | "downloadedAt">) => {
    try {
      const current = downloadManager.getAll();
      const existing = current.find((d) => d.id === item.id);
      if (existing) return existing;

      const newItem: DownloadItem = {
        ...item,
        progress: 15,
        status: "downloading",
        downloadedAt: Date.now(),
      };

      const updated = [newItem, ...current];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // Simulate download progress steps
      let progress = 15;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 20) + 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          downloadManager.updateStatus(item.id, "completed", 100);
        } else {
          downloadManager.updateStatus(item.id, "downloading", progress);
        }
      }, 800);

      return newItem;
    } catch (e) {
      console.error("Failed to start download:", e);
      return null;
    }
  },

  updateStatus: (id: string, status: DownloadItem["status"], progress: number) => {
    try {
      const current = downloadManager.getAll();
      const updated = current.map((d) => (d.id === id ? { ...d, status, progress } : d));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("spectra_downloads_updated"));
    } catch (e) {
      console.error(e);
    }
  },

  deleteDownload: (id: string) => {
    try {
      const current = downloadManager.getAll();
      const updated = current.filter((d) => d.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("spectra_downloads_updated"));
    } catch (e) {
      console.error(e);
    }
  },
};
