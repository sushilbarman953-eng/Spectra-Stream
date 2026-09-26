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

export const HINDI_DUBBED_ANIME_CATALOG: AnimeItem[] = [
  {
    mal_id: 38000,
    title: "Demon Slayer: Kimetsu no Yaiba",
    title_english: "Demon Slayer",
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
    title_english: "Solo Leveling",
    score: 8.4,
    episodes: 12,
    status: "Finished Airing",
    hasHindiDub: true,
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/1096/142999.jpg",
        large_image_url: "https://cdn.myanimelist.net/images/anime/1096/142999l.jpg",
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
];

export const animeService = {
  getTopAiring: async (): Promise<AnimeItem[]> => {
    try {
      const res = await fetch("https://api.jikan.moe/v4/top/anime?filter=airing&limit=12", {
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
    } catch {}
    return HINDI_DUBBED_ANIME_CATALOG;
  },

  getHindiDubbedPopular: async (): Promise<AnimeItem[]> => {
    try {
      const res = await fetch("https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=15", {
        next: { revalidate: 86400 },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.data) && data.data.length > 0) {
          const apiItems = data.data.map((item: any) => ({
            ...item,
            hasHindiDub: true,
          }));
          return [...HINDI_DUBBED_ANIME_CATALOG, ...apiItems];
        }
      }
    } catch {}
    return HINDI_DUBBED_ANIME_CATALOG;
  },
};
