export interface AnimeEpisode {
  mal_id: number;
  title: string;
  title_japanese?: string;
  aired?: string;
  score?: number;
  filler: boolean;
  recap: boolean;
  synopsis?: string;
}

export interface AnimeSearchResult {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
    };
  };
  episodes?: number;
  synopsis?: string;
  score?: number;
}

const JIKAN_BASE = "https://api.jikan.moe/v4";

export const jikan = {
  searchAnime: async (query: string): Promise<AnimeSearchResult | null> => {
    try {
      const res = await fetch(`${JIKAN_BASE}/anime?q=${encodeURIComponent(query)}&limit=1`, {
        next: { revalidate: 86400 },
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.data?.[0] || null;
    } catch (err) {
      console.error("Jikan search error:", err);
      return null;
    }
  },

  getEpisodes: async (malId: number, page: number = 1): Promise<AnimeEpisode[]> => {
    try {
      const res = await fetch(`${JIKAN_BASE}/anime/${malId}/episodes?page=${page}`, {
        next: { revalidate: 3600 },
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      console.error("Jikan episodes fetch error:", err);
      return [];
    }
  },
};
