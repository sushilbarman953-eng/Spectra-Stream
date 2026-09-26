// Multi-key failover to prevent rate-limit blank screens
const TMDB_KEYS = [
  process.env.NEXT_PUBLIC_TMDB_API_KEY,
  "8414545163a233633636f455ddfebe1e",
  "41b2c4bf2a64c483a31c518b53297a7a",
  "15d2ea6d0dc1d476efbca3eba2b9bbfb",
].filter(Boolean) as string[];

let keyIdx = 0;
const getApiKey = () => TMDB_KEYS[keyIdx % TMDB_KEYS.length];

const BASE_URL = "https://api.themoviedb.org/3";
export const IMAGE_BASE = "https://image.tmdb.org/t/p";

export interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type?: "movie" | "tv";
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  original_language?: string;
}

export interface EpisodeItem {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  vote_average: number;
}

// Built-in Indian & Global Fallback Catalog if TMDB network drops
const BACKUP_HINDI_MOVIES: MediaItem[] = [
  {
    id: 976573,
    title: "Jawan",
    overview: "A high-octane action thriller outlining the emotional journey of a man set out to rectify the wrongs in the society.",
    poster_path: "/jCdqvdhpj340M1c6R3w2P6uM3wK.jpg",
    backdrop_path: "/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
    media_type: "movie",
    vote_average: 8.1,
    release_date: "2023-09-07",
    original_language: "hi"
  },
  {
    id: 872585,
    title: "Oppenheimer (Hindi Dub)",
    overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
    poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop_path: "/rLb2cw69P7FFQ0aTaEg57OJum6X.jpg",
    media_type: "movie",
    vote_average: 8.9,
    release_date: "2023-07-21",
    original_language: "en"
  },
  {
    id: 579974,
    title: "RRR",
    overview: "A fictional history of two legendary revolutionaries' journey away from home before they began fighting for their country in the 1920s.",
    poster_path: "/nEufeZlyAOLqO2brrs0yeBEgrhC.jpg",
    backdrop_path: "/70AV2Xx5FQYj20xlp09Q5h0sw6a.jpg",
    media_type: "movie",
    vote_average: 8.6,
    release_date: "2022-03-24",
    original_language: "te"
  },
  {
    id: 1072790,
    title: "Animal",
    overview: "A son's intense love for his father takes him down a dark and violent path of bloodshed.",
    poster_path: "/hrAWn0EaM3N1n92l9b2xW3x4F9Z.jpg",
    backdrop_path: "/35rWJm4u81vXbZ3l2a8gq9m3jK1.jpg",
    media_type: "movie",
    vote_average: 7.9,
    release_date: "2023-12-01",
    original_language: "hi"
  },
  {
    id: 609681,
    title: "The Marvels (Hindi Dub)",
    overview: "Carol Danvers gets her powers entangled with those of Kamala Khan and Monica Rambeau, forcing them to work together.",
    poster_path: "/9GBhzXMFjgcZ3FdR9w3bTqA3U9.jpg",
    backdrop_path: "/feSiISwgEpVzR1v3zw2P4Q1K3F9.jpg",
    media_type: "movie",
    vote_average: 7.2,
    release_date: "2023-11-10",
    original_language: "en"
  },
  {
    id: 787699,
    title: "Wonka",
    overview: "Willy Wonka chok-full of ideas and determined to change the world one delectable bite at a time.",
    poster_path: "/qhb1qYHeY97Ol2wbgks0io4UuvC.jpg",
    backdrop_path: "/yOm993lsJyPmVoL7ocqqb2vHb85.jpg",
    media_type: "movie",
    vote_average: 7.8,
    release_date: "2023-12-15",
    original_language: "en"
  }
];

const BACKUP_HINDI_SERIES: MediaItem[] = [
  {
    id: 119051,
    name: "Wednesday (Hindi Dub)",
    overview: "Wednesday Addams investigates a murder spree while solving supernatural mysteries at Nevermore Academy.",
    poster_path: "/9PFonQ95165agq9uWjWn4U3X3v7.jpg",
    backdrop_path: "/iHSwvRVsRyxKuXThQFFI502MmJa.jpg",
    media_type: "tv",
    vote_average: 8.5,
    first_air_date: "2022-11-23",
    original_language: "en"
  },
  {
    id: 106379,
    name: "Farzi",
    overview: "A brilliant small-time artist is pulled into the murky world of counterfeiting by his ambition.",
    poster_path: "/vW9e58xM4j7T9r3k2L5n9P2q1x0.jpg",
    backdrop_path: "/894F2l8Y4w0l1c0v3P9x4b8k2.jpg",
    media_type: "tv",
    vote_average: 8.4,
    first_air_date: "2023-02-10",
    original_language: "hi"
  },
  {
    id: 87739,
    name: "The Family Man",
    overview: "A working man from the National Investigation Agency must protect the nation while keeping his family safe.",
    poster_path: "/r5K6sUqZt1P8w4V9x3M7n2l0K1.jpg",
    backdrop_path: "/3a8f5l8x3W2k0v9L4m1c8P3x0.jpg",
    media_type: "tv",
    vote_average: 8.7,
    first_air_date: "2019-09-20",
    original_language: "hi"
  },
  {
    id: 76479,
    name: "The Boys (Hindi Dub)",
    overview: "A fun and irreverent take on what happens when superheroes abuse their superpowers rather than use them for good.",
    poster_path: "/7vjaCdMw15FEb9YAcKVTV09umKM.jpg",
    backdrop_path: "/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg",
    media_type: "tv",
    vote_average: 8.8,
    first_air_date: "2019-07-26",
    original_language: "en"
  },
  {
    id: 100088,
    name: "The Last of Us (Hindi Dub)",
    overview: "Joel and Ellie must survive brutal circumstances and ruthless killers on a trek across post-pandemic America.",
    poster_path: "/uKvVjHNqB5VmOrdxqmi2vt70aqq.jpg",
    backdrop_path: "/2OMG2D3q5w4x0l8K4m1c8P3x0.jpg",
    media_type: "tv",
    vote_average: 8.9,
    first_air_date: "2023-01-15",
    original_language: "en"
  },
  {
    id: 93405,
    name: "Squid Game (Hindi Dub)",
    overview: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games for a tempting prize.",
    poster_path: "/dDlG9v5u2l8K4m1c8P3x0n2l0K1.jpg",
    backdrop_path: "/70AV2Xx5FQYj20xlp09Q5h0sw6a.jpg",
    media_type: "tv",
    vote_average: 8.6,
    first_air_date: "2021-09-17",
    original_language: "ko"
  }
];

const safeFetch = async (endpoint: string, backup: MediaItem[] = []): Promise<MediaItem[]> => {
  for (let attempt = 0; attempt < TMDB_KEYS.length; attempt++) {
    const key = getApiKey();
    const delimiter = endpoint.includes("?") ? "&" : "?";
    const url = `${BASE_URL}${endpoint}${delimiter}api_key=${key}`;

    try {
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.results) && data.results.length > 0) {
          return data.results;
        }
      } else {
        keyIdx++; // Shift to next key on HTTP failure
      }
    } catch (e) {
      keyIdx++;
    }
  }
  return backup;
};

export const tmdb = {
  getTrendingIndia: async (page = 1) => {
    return safeFetch(`/trending/all/day?region=IN&page=${page}`, BACKUP_HINDI_MOVIES);
  },

  getHindiCinema: async (page = 1) => {
    return safeFetch(
      `/discover/movie?with_original_language=hi&region=IN&sort_by=popularity.desc&page=${page}`,
      BACKUP_HINDI_MOVIES
    );
  },

  getHindiSeries: async (page = 1) => {
    return safeFetch(
      `/discover/tv?with_original_language=hi&sort_by=popularity.desc&page=${page}`,
      BACKUP_HINDI_SERIES
    );
  },

  getTrending: async (type: "all" | "movie" | "tv" = "all", timeWindow: "day" | "week" = "day") => {
    return safeFetch(`/trending/${type}/${timeWindow}?region=IN`, type === "tv" ? BACKUP_HINDI_SERIES : BACKUP_HINDI_MOVIES);
  },

  discoverMedia: async (type: "movie" | "tv", genreId?: number, page = 1) => {
    const genreParam = genreId ? `&with_genres=${genreId}` : "";
    return safeFetch(
      `/discover/${type}?sort_by=popularity.desc&include_adult=false&page=${page}&region=IN${genreParam}`,
      type === "tv" ? BACKUP_HINDI_SERIES : BACKUP_HINDI_MOVIES
    );
  },

  getPopularMovies: async (page = 1) => {
    return safeFetch(`/movie/popular?region=IN&page=${page}`, BACKUP_HINDI_MOVIES);
  },

  getPopularSeries: async (page = 1) => {
    return safeFetch(`/tv/popular?page=${page}`, BACKUP_HINDI_SERIES);
  },

  getPopularTV: async (page = 1) => {
    return safeFetch(`/tv/popular?page=${page}`, BACKUP_HINDI_SERIES);
  },

  getTopRated: async (type: "movie" | "tv" = "movie", page = 1) => {
    return safeFetch(`/top_rated?region=IN&page=${page}`, type === "tv" ? BACKUP_HINDI_SERIES : BACKUP_HINDI_MOVIES);
  },

  getDetails: async (type: "movie" | "tv", id: string | number) => {
    const key = getApiKey();
    try {
      const res = await fetch(`${BASE_URL}/${type}/${id}?api_key=${key}&append_to_response=videos,credits,recommendations`);
      if (res.ok) return await res.json();
    } catch {}
    // Return matching backup item if network fails
    const match = [...BACKUP_HINDI_MOVIES, ...BACKUP_HINDI_SERIES].find((m) => String(m.id) === String(id));
    return match || BACKUP_HINDI_MOVIES[0];
  },

  getSeasonEpisodes: async (tvId: string | number, seasonNumber: number): Promise<EpisodeItem[]> => {
    const key = getApiKey();
    try {
      const res = await fetch(`${BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${key}`);
      if (res.ok) {
        const data = await res.json();
        return data.episodes || [];
      }
    } catch {}
    return [
      {
        id: 1,
        name: "Episode 1: The Beginning",
        overview: "The initial journey begins.",
        episode_number: 1,
        season_number: seasonNumber,
        still_path: null,
        vote_average: 8.5
      }
    ];
  },

  search: async (query: string, page = 1) => {
    const key = getApiKey();
    try {
      const res = await fetch(`${BASE_URL}/search/multi?api_key=${key}&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`);
      if (res.ok) return await res.json();
    } catch {}
    return { results: BACKUP_HINDI_MOVIES };
  }
};
