export interface OfflineMediaItem {
  id: string; // composite id: tmdbId-s1-e1 or tmdbId-movie
  tmdbId: string;
  type: "movie" | "tv";
  title: string;
  season?: number;
  episode?: number;
  posterPath?: string;
  sizeBytes: number;
  savedAt: number;
  blobKey?: string;
}

const DB_NAME = "SpectraOfflineDB";
const STORE_NAME = "offline_chunks";
const METADATA_KEY = "spectra_offline_meta";

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject("No window");
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

export const downloadManager = {
  getAll: (): OfflineMediaItem[] => {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(METADATA_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  isDownloaded: (id: string): boolean => {
    const list = downloadManager.getAll();
    return list.some((item) => item.id === id);
  },

  saveMedia: async (
    item: Omit<OfflineMediaItem, "savedAt" | "sizeBytes">,
    streamUrl: string,
    onProgress?: (progress: number) => void
  ): Promise<boolean> => {
    try {
      // 1. Fetch raw media stream
      const res = await fetch(streamUrl);
      if (!res.ok) throw new Error("Stream fetch failed");

      const contentLength = res.headers.get("content-length");
      const total = contentLength ? parseInt(contentLength, 10) : 0;

      let blob: Blob;
      if (res.body && total > 0) {
        const reader = res.body.getReader();
        let received = 0;
        const chunks: Uint8Array[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
            received += value.length;
            if (onProgress) onProgress(Math.round((received / total) * 100));
          }
        }
        blob = new Blob(chunks, { type: "video/mp4" });
      } else {
        blob = await res.blob();
        if (onProgress) onProgress(100);
      }

      // 2. Persist in IndexedDB
      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        store.put(blob, item.id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });

      // 3. Persist metadata
      const metaItem: OfflineMediaItem = {
        ...item,
        sizeBytes: blob.size,
        savedAt: Date.now(),
      };

      const current = downloadManager.getAll().filter((i) => i.id !== item.id);
      localStorage.setItem(METADATA_KEY, JSON.stringify([metaItem, ...current]));
      window.dispatchEvent(new Event("spectra_downloads_updated"));
      return true;
    } catch (e) {
      console.error("Offline download error:", e);
      return false;
    }
  },

  getOfflineBlobUrl: async (id: string): Promise<string | null> => {
    try {
      const db = await openDB();
      return await new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(id);
        req.onsuccess = () => {
          if (req.result instanceof Blob) {
            resolve(URL.createObjectURL(req.result));
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  },

  removeMedia: async (id: string) => {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).delete(id);

      const current = downloadManager.getAll().filter((i) => i.id !== id);
      localStorage.setItem(METADATA_KEY, JSON.stringify(current));
      window.dispatchEvent(new Event("spectra_downloads_updated"));
    } catch (e) {
      console.error("Remove download error:", e);
    }
  },

  getStorageEstimate: async (): Promise<{ used: number; quota: number }> => {
    if (typeof navigator !== "undefined" && navigator.storage && navigator.storage.estimate) {
      const est = await navigator.storage.estimate();
      return {
        used: est.usage || 0,
        quota: est.quota || 0,
      };
    }
    return { used: 0, quota: 0 };
  },
};
