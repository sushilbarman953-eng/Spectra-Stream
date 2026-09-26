export interface AnimeItem {
  mal_id: number;
  title: string;
  title_english?: string;
  title_japanese?: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
    };
  };
  score: number;
  episodes: number | null;
  status: string;
  synopsis: string;
  hasHindiDub?: boolean;
}

const HINDI_POPULAR_ANIME_IDS = [
  20,    // Naruto
  1735,  // Naruto Shippuden
  21,    // One Piece
  269,   // Bleach
  1535,  // Death Note
  38000, // Demon Slayer
  5114,  // Fullmetal Alchemist: Brotherhood
  31964, // My Hero Academia
  40748, // Jujutsu Kaisen
  235,   // Detective Conan
  2406,  // Doraemon
  233,   // Crayon Shin-chan
];

export const animeService = {
  // Top Airing Anime from Jikan
  getTopAiring: async (): Promise<AnimeItem[]> => {
    try {
      const res = await fetch("https://api.jikan.moe/v4/top/anime?filter=airing&limit=15", {
        next: { revalidate: 86400 },
      });
      const data = await res.json();
      return (data.data || []).map((item: any) => ({
        ...item,
        hasHindiDub: HINDI_POPULAR_ANIME_IDS.includes(item.mal_id),
      }));
    } catch {
      return [];
    }
  },

  // Popular Hindi Dubbed Anime in India
  getHindiDubbedPopular: async (): Promise<AnimeItem[]> => {
    try {
      const res = await fetch("https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=20", {
        next: { revalidate: 86400 },
      });
      const data = await res.json();
      return (data.data || []).map((item: any) => ({
        ...item,
        hasHindiDub: HINDI_POPULAR_ANIME_IDS.includes(item.mal_id) || item.score > 8.0,
      }));
    } catch {
      return [];
    }
  },

  // Search Anime via Jikan
  searchAnime: async (query: string): Promise<AnimeItem[]> => {
    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=12`, {
        next: { revalidate: 3600 },
      });
      const data = await res.json();
      return data.data || [];
    } catch {
      return [];
    }
  }
};
