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
    poster_path: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&q=80",
    vote_average: 8.2,
    media_type: "movie",
    audioLanguages: ["MULTI", "HIN"],
  },
  {
    id: 872906,
    title: "Animal",
    poster_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1280&q=80",
    vote_average: 7.8,
    media_type: "movie",
    audioLanguages: ["MULTI", "HIN"],
  },
  {
    id: 838209,
    title: "Pathaan",
    poster_path: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1280&q=80",
    vote_average: 7.4,
    media_type: "movie",
    audioLanguages: ["MULTI", "HIN"],
  },
  {
    id: 579974,
    title: "RRR",
    poster_path: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=500&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&q=80",
    vote_average: 8.6,
    media_type: "movie",
    audioLanguages: ["MULTI", "TEL", "HIN"],
  },
  {
    id: 533535,
    title: "Deadpool & Wolverine",
    poster_path: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/yDHYTfA3R0jFYba16jBB1jv8vEU.jpg",
    vote_average: 8.0,
    media_type: "movie",
    audioLanguages: ["MULTI", "HIN", "ENG"],
  },
];

export const BACKUP_HINDI_SERIES: MediaItem[] = [
  {
    id: 119051,
    title: "Wednesday",
    name: "Wednesday",
    poster_path: "https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/iHSwvRVsRyxKuOCzgEcBmNg9F0P.jpg",
    vote_average: 8.5,
    media_type: "tv",
    audioLanguages: ["MULTI", "HIN", "ENG"],
  },
  {
    id: 76479,
    title: "The Boys",
    name: "The Boys",
    poster_path: "https://image.tmdb.org/t/p/w500/2ZmQuiupcW2Yf4RJwh2Q5S1r44T.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg",
    vote_average: 8.4,
    media_type: "tv",
    audioLanguages: ["MULTI", "HIN", "ENG"],
  },
  {
    id: 100088,
    title: "The Last of Us",
    name: "The Last of Us",
    poster_path: "https://image.tmdb.org/t/p/w500/uKvVjK19uDUUQ2ebK5d1mqq0m1f.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg",
    vote_average: 8.6,
    media_type: "tv",
    audioLanguages: ["MULTI", "HIN", "ENG"],
  },
  {
    id: 66732,
    title: "Stranger Things",
    name: "Stranger Things",
    poster_path: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
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
  BACKUP_HINDI_MOVIES[3],
  {
    id: 556574,
    title: "KGF: Chapter 2",
    poster_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1280&q=80",
    vote_average: 8.4,
    media_type: "movie",
    audioLanguages: ["MULTI", "KAN", "HIN"],
  },
  {
    id: 792307,
    title: "Leo",
    poster_path: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1280&q=80",
    vote_average: 7.5,
    media_type: "movie",
    audioLanguages: ["MULTI", "TAM", "HIN"],
  },
];

export const HOLLYWOOD_CATALOG: MediaItem[] = [
  {
    id: 693134,
    title: "Dune: Part Two",
    poster_path: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s520DRq.jpg",
    vote_average: 8.3,
    media_type: "movie",
    audioLanguages: ["MULTI", "HIN", "ENG"],
  },
  BACKUP_HINDI_MOVIES[4],
  {
    id: 157336,
    title: "Interstellar",
    poster_path: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/rAiYTsqAlinmh6AcKBiAHZKQx8y.jpg",
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
