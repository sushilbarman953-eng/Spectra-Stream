export interface MediaItem {
  id: number | string;
  title?: string;
  name?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  overview?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: "movie" | "tv";
  genre_ids?: number[];
  audioLanguages?: string[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface EpisodeItem {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  vote_average?: number;
}

export const IMAGE_BASE = "https://image.tmdb.org/t/p";

export const DEFAULT_CREDITS = {
  cast: [
    { id: 1, name: "Lead Performer", character: "Protagonist", profile_path: null },
    { id: 2, name: "Co-Star", character: "Antagonist", profile_path: null },
  ],
  crew: [
    { id: 3, name: "Director", job: "Director", profile_path: null },
    { id: 4, name: "Executive Producer", job: "Producer", profile_path: null },
  ],
};

export const BACKUP_HINDI_MOVIES: MediaItem[] = [
  {
    id: 974950,
    title: "Jawan",
    poster_path: "/jFt1g94utjj2YK4aeapSaW012tp.jpg",
    backdrop_path: "/8pjWz2lt29KyVGoVRUmZG5STKXG.jpg",
    vote_average: 8.2,
    media_type: "movie",
    audioLanguages: ["MULTI", "HIN"],
  },
  {
    id: 872906,
    title: "Animal",
    poster_path: "/hr95ooB6b6hk32T799WYbh993LO.jpg",
    backdrop_path: "/ugS5xLGMt8x7gy7Q16vX3G1r79q.jpg",
    vote_average: 7.8,
    media_type: "movie",
    audioLanguages: ["MULTI", "HIN"],
  },
  {
    id: 838209,
    title: "Pathaan",
    poster_path: "/m1b9ToAbG17b73z91r03aK3k8lH.jpg",
    backdrop_path: "/7eSpBwAadkL2wzJbJ1v5m8bM0x.jpg",
    vote_average: 7.4,
    media_type: "movie",
    audioLanguages: ["MULTI", "HIN"],
  },
  {
    id: 1072790,
    title: "Dunki",
    poster_path: "/zsqJ6n5K2aU6a07E4d9n1mJ0j9h.jpg",
    backdrop_path: "/87xM0bL2q1Pj0F3W2Y7k0d1a4C9.jpg",
    vote_average: 7.1,
    media_type: "movie",
    audioLanguages: ["MULTI", "HIN"],
  },
  {
    id: 579974,
    title: "RRR",
    poster_path: "/nEu44fX3W8zQ0Z0L8yv4cO1q2X3.jpg",
    backdrop_path: "/22z44LPkMyf5nyCHneWW37t9OUM.jpg",
    vote_average: 8.6,
    media_type: "movie",
    audioLanguages: ["MULTI", "TEL", "HIN"],
  },
  {
    id: 533535,
    title: "Deadpool & Wolverine",
    poster_path: "/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    backdrop_path: "/yDHYTfA3R0jFYba16jBB1jv8vEU.jpg",
    vote_average: 8.0,
    media_type: "movie",
    audioLanguages: ["MULTI", "HIN", "ENG"],
  },
  {
    id: 693134,
    title: "Dune: Part Two",
    poster_path: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdrop_path: "/xOMo8BRK7PfcJv9JCnx7s520DRq.jpg",
    vote_average: 8.3,
    media_type: "movie",
    audioLanguages: ["MULTI", "HIN", "ENG"],
  },
];

export const BACKUP_HINDI_SERIES: MediaItem[] = [
  {
    id: 119051,
    title: "Wednesday",
    name: "Wednesday",
    poster_path: "/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
    backdrop_path: "/iHSwvRVsRyxKuOCzgEcBmNg9F0P.jpg",
    vote_average: 8.5,
    media_type: "tv",
    audioLanguages: ["MULTI", "HIN", "ENG"],
  },
  {
    id: 76479,
    title: "The Boys",
    name: "The Boys",
    poster_path: "/2ZmQuiupcW2Yf4RJwh2Q5S1r44T.jpg",
    backdrop_path: "/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg",
    vote_average: 8.4,
    media_type: "tv",
    audioLanguages: ["MULTI", "HIN", "ENG"],
  },
  {
    id: 100088,
    title: "The Last of Us",
    name: "The Last of Us",
    poster_path: "/uKvVjK19uDUUQ2ebK5d1mqq0m1f.jpg",
    backdrop_path: "/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg",
    vote_average: 8.6,
    media_type: "tv",
    audioLanguages: ["MULTI", "HIN", "ENG"],
  },
  {
    id: 66732,
    title: "Stranger Things",
    name: "Stranger Things",
    poster_path: "/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    backdrop_path: "/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
    vote_average: 8.6,
    media_type: "tv",
    audioLanguages: ["MULTI", "HIN", "ENG"],
  },
];

export const BOLLYWOOD_CATALOG: MediaItem[] = [
  BACKUP_HINDI_MOVIES[0],
  BACKUP_HINDI_MOVIES[1],
  BACKUP_HINDI_MOVIES[2],
  BACKUP_HINDI_MOVIES[3],
];

export const SOUTH_INDIAN_CATALOG: MediaItem[] = [
  BACKUP_HINDI_MOVIES[4],
  {
    id: 556574,
    title: "KGF: Chapter 2",
    poster_path: "/khSV2tH9kYk1d2zJ7wZk21bM1.jpg",
    backdrop_path: "/fOy2Jurz9K62QytLqvym8IOqGq2.jpg",
    vote_average: 8.4,
    media_type: "movie",
    audioLanguages: ["MULTI", "KAN", "HIN"],
  },
  {
    id: 792307,
    title: "Leo",
    poster_path: "/pD6sL4v7aB5oN4X8yF1u2X3yK.jpg",
    backdrop_path: "/t5zCBSB5xMOMZap7rNkbJ7t2B2w.jpg",
    vote_average: 7.5,
    media_type: "movie",
    audioLanguages: ["MULTI", "TAM", "HIN"],
  },
];

export const HOLLYWOOD_CATALOG: MediaItem[] = [
  BACKUP_HINDI_MOVIES[6],
  BACKUP_HINDI_MOVIES[5],
  {
    id: 157336,
    title: "Interstellar",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "/rAiYTsqAlinmh6AcKBiAHZKQx8y.jpg",
    vote_average: 8.4,
    media_type: "movie",
    audioLanguages: ["MULTI", "HIN", "ENG"],
  },
];

export const REGIONAL_CATALOG: MediaItem[] = [...BOLLYWOOD_CATALOG, ...SOUTH_INDIAN_CATALOG];
export const EXTENDED_MOVIES_CATALOG = [...BOLLYWOOD_CATALOG, ...HOLLYWOOD_CATALOG, ...SOUTH_INDIAN_CATALOG];
export const EXTENDED_SERIES_CATALOG = [...BACKUP_HINDI_SERIES];

export const tmdb = {
  getTrending: async (type: "movie" | "tv" = "movie"): Promise<MediaItem[]> => {
    return type === "tv" ? BACKUP_HINDI_SERIES : BACKUP_HINDI_MOVIES;
  },
  getTopRated: async (type: "movie" | "tv" = "movie"): Promise<MediaItem[]> => {
    return type === "tv" ? BACKUP_HINDI_SERIES : BACKUP_HINDI_MOVIES;
  },
  getPopular: async (type: "movie" | "tv" = "movie"): Promise<MediaItem[]> => {
    return type === "tv" ? BACKUP_HINDI_SERIES : BACKUP_HINDI_MOVIES;
  },
  discoverMedia: async (type: "movie" | "tv"): Promise<MediaItem[]> => {
    return type === "tv" ? BACKUP_HINDI_SERIES : BACKUP_HINDI_MOVIES;
  },
  getDetails: async (type: "movie" | "tv", id: string | number) => {
    const pool = type === "tv" ? BACKUP_HINDI_SERIES : BACKUP_HINDI_MOVIES;
    return pool.find((i) => String(i.id) === String(id)) || pool[0];
  },
  getSeasonEpisodes: async (): Promise<EpisodeItem[]> => [],
  searchMulti: async (): Promise<MediaItem[]> => [...BACKUP_HINDI_MOVIES, ...BACKUP_HINDI_SERIES],
};
