export interface AnimeEpisode {
  mal_id: number;
  title: string;
  episode: string;
  aired?: string;
  score?: number;
  filler?: boolean;
  recap?: boolean;
}

export const jikan = {
  // Search MAL for anime details
  searchAnime: async (query: string) => {
    try {
      const res = await fetch(
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`,
        { next: { revalidate: 86400 } }
      );
      if (!res.ok) return null;
      const data = await res.json();
      return data.data?.[0] || null;
    } catch (e) {
      console.error("Jikan search error:", e);
      return null;
    }
  },

  // Fetch all episode titles for an anime
  getEpisodes: async (malId: number): Promise<AnimeEpisode[]> => {
    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime/${malId}/episodes`, {
        next: { revalidate: 86400 },
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.data || [];
    } catch (e) {
      console.error("Jikan episodes error:", e);
      return [];
    }
  },
};
