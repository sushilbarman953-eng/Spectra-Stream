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
  synopsis?: string;
  hasHindiDub?: boolean;
}

// Curated lineup of top anime with verified Hindi Dub & regional audio in India
export const HINDI_DUBBED_ANIME_CATALOG: AnimeItem[] = [
  {
    mal_id: 38000,
    title: "Demon Slayer: Kimetsu no Yaiba",
    title_english: "Demon Slayer: Kimetsu no Yaiba",
    score: 8.5,
    episodes: 26,
    status: "Finished Airing",
    hasHindiDub: true,
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
        large_image_url: "https://cdn.myanimelist.net/images/anime/1286/99889l.jpg",
      },
    },
  },
  {
    mal_id: 40748,
    title: "Jujutsu Kaisen",
    title_english: "Jujutsu Kaisen",
    score: 8.6,
    episodes: 24,
    status: "Finished Airing",
    hasHindiDub: true,
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
        large_image_url: "https://cdn.myanimelist.net/images/anime/1171/109222l.jpg",
      },
    },
  },
  {
    mal_id: 52299,
    title: "Solo Leveling",
    title_english: "Solo Leveling (Ore dake Level Up na Ken)",
    score: 8.3,
    episodes: 12,
    status: "Finished Airing",
    hasHindiDub: true,
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/1869/141930.jpg",
        large_image_url: "https://cdn.myanimelist.net/images/anime/1869/141930l.jpg",
      },
    },
  },
  {
    mal_id: 20,
    title: "Naruto",
    title_english: "Naruto",
    score: 8.0,
    episodes: 220,
    status: "Finished Airing",
    hasHindiDub: true,
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/13/17405.jpg",
        large_image_url: "https://cdn.myanimelist.net/images/anime/13/17405l.jpg",
      },
    },
  },
  {
    mal_id: 1735,
    title: "Naruto: Shippuuden",
    title_english: "Naruto: Shippuden",
    score: 8.3,
    episodes: 500,
    status: "Finished Airing",
    hasHindiDub: true,
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/1565/111305.jpg",
        large_image_url: "https://cdn.myanimelist.net/images/anime/1565/111305l.jpg",
      },
    },
  },
  {
    mal_id: 21,
    title: "One Piece",
    title_english: "One Piece",
    score: 8.7,
    episodes: 1100,
    status: "Currently Airing",
    hasHindiDub: true,
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/6/73245.jpg",
        large_image_url: "https://cdn.myanimelist.net/images/anime/6/73245l.jpg",
      },
    },
  },
  {
    mal_id: 1535,
    title: "Death Note",
    title_english: "Death Note",
    score: 8.6,
    episodes: 37,
    status: "Finished Airing",
    hasHindiDub: true,
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/9/9453.jpg",
        large_image_url: "https://cdn.myanimelist.net/images/anime/9/9453l.jpg",
      },
    },
  },
  {
    mal_id: 16498,
    title: "Shingeki no Kyojin",
    title_english: "Attack on Titan",
    score: 8.5,
    episodes: 25,
    status: "Finished Airing",
    hasHindiDub: true,
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
        large_image_url: "https://cdn.myanimelist.net/images/anime/10/47347l.jpg",
      },
    },
  },
  {
    mal_id: 223,
    title: "Dragon Ball",
    title_english: "Dragon Ball",
    score: 7.9,
    episodes: 153,
    status: "Finished Airing",
    hasHindiDub: true,
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/1887/92111.jpg",
        large_image_url: "https://cdn.myanimelist.net/images/anime/1887/92111l.jpg",
      },
    },
  },
  {
    mal_id: 269,
    title: "Bleach",
    title_english: "Bleach",
    score: 7.9,
    episodes: 366,
    status: "Finished Airing",
    hasHindiDub: true,
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/3/40451.jpg",
        large_image_url: "https://cdn.myanimelist.net/images/anime/3/40451l.jpg",
      },
    },
  },
  {
    mal_id: 44511,
    title: "Chainsaw Man",
    title_english: "Chainsaw Man",
    score: 8.5,
    episodes: 12,
    status: "Finished Airing",
    hasHindiDub: true,
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/1806/126216.jpg",
        large_image_url: "https://cdn.myanimelist.net/images/anime/1806/126216l.jpg",
      },
    },
  },
  {
    mal_id: 31964,
    title: "Boku no Hero Academia",
    title_english: "My Hero Academia",
    score: 7.9,
    episodes: 13,
    status: "Finished Airing",
    hasHindiDub: true,
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/10/78745.jpg",
        large_image_url: "https://cdn.myanimelist.net/images/anime/10/78745l.jpg",
      },
    },
  },
];

export const animeService = {
  getTopAiring: async (): Promise<AnimeItem[]> => {
    try {
      const res = await fetch("https://api.jikan.moe/v4/top/anime?filter=airing&limit=15", {
        next: { revalidate: 86400 },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.data) && data.data.length > 0) {
          return data.data.map((item: any) => ({
            ...item,
            hasHindiDub: true,
          }));
        }
      }
    } catch (e) {
      console.error("Top airing fetch error:", e);
    }
    return HINDI_DUBBED_ANIME_CATALOG;
  },

  getHindiDubbedPopular: async (): Promise<AnimeItem[]> => {
    try {
      const res = await fetch("https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=24", {
        next: { revalidate: 86400 },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.data) && data.data.length > 0) {
          // Merge API items with known Hindi dub items so it is never empty
          const apiItems = data.data.map((item: any) => ({
            ...item,
            hasHindiDub: true,
          }));
          return [...HINDI_DUBBED_ANIME_CATALOG, ...apiItems];
        }
      }
    } catch (e) {
      console.error("Hindi popular fetch error:", e);
    }
    return HINDI_DUBBED_ANIME_CATALOG;
  },

  searchAnime: async (query: string): Promise<AnimeItem[]> => {
    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=12`, {
        next: { revalidate: 3600 },
      });
      if (res.ok) {
        const data = await res.json();
        return data.data || [];
      }
    } catch {}
    return HINDI_DUBBED_ANIME_CATALOG.filter((a) =>
      a.title.toLowerCase().includes(query.toLowerCase())
    );
  },
};
