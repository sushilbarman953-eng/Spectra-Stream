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
  status: "completed" | "downloading" | "paused" | "queued";
  quality: string;
  audioLanguage: string;
  captionLanguage: string;
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

  startBatchDownload: (items: Omit<DownloadItem, "progress" | "status" | "downloadedAt">[]) => {
    try {
      const current = downloadManager.getAll();
      const newItems: DownloadItem[] = [];

      items.forEach((item, index) => {
        const existing = current.find((d) => d.id === item.id);
        if (!existing) {
          newItems.push({
            ...item,
            progress: index === 0 ? 10 : 0,
            status: index === 0 ? "downloading" : "queued",
            downloadedAt: Date.now(),
          });
        }
      });

      const updated = [...newItems, ...current];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("spectra_downloads_updated"));

      // Progress simulation for active downloads
      newItems.forEach((item, idx) => {
        setTimeout(() => {
          let progress = 10;
          const timer = setInterval(() => {
            progress += Math.floor(Math.random() * 20) + 15;
            if (progress >= 100) {
              progress = 100;
              clearInterval(timer);
              downloadManager.updateStatus(item.id, "completed", 100);
            } else {
              downloadManager.updateStatus(item.id, "downloading", progress);
            }
          }, 700);
        }, idx * 1200);
      });
    } catch (e) {
      console.error("Batch download error:", e);
    }
  },

  resumeRemaining: (tmdbId: string) => {
    try {
      const all = downloadManager.getAll();
      const updated = all.map((d) => {
        if (d.tmdbId === tmdbId && d.status !== "completed") {
          return { ...d, status: "downloading" as const };
        }
        return d;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("spectra_downloads_updated"));

      // Simulate completion for resumed items
      updated
        .filter((d) => d.tmdbId === tmdbId && d.status === "downloading")
        .forEach((item, i) => {
          setTimeout(() => {
            downloadManager.updateStatus(item.id, "completed", 100);
          }, (i + 1) * 1500);
        });
    } catch (e) {
      console.error(e);
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
