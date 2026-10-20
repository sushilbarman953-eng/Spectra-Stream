"use client";

import { MediaItem } from "@/lib/tmdb";
import { CURATED_CHANNELS, LiveChannel } from "@/lib/iptv";
import { INDIAN_MOVIE_STARS, HOLLYWOOD_MOVIE_STARS, StarProfile } from "@/components/StarSpotlightCapsules";

export interface WebCustomSettings {
  siteTitle: string;
  tagline: string;
  announcementText: string;
  showAnnouncement: boolean;
  accentColor: "white" | "red" | "blue" | "emerald" | "amber";
  glassBlur: "low" | "medium" | "ultra";
  showHeroCarousel: boolean;
  showKeepWatching: boolean;
  showTrendingMovies: boolean;
  showTrendingSeries: boolean;
  showTrendingAnime: boolean;
  showIndianStars: boolean;
  showHollywoodStars: boolean;
  showFranchises: boolean;
  defaultServer: "vidlink" | "vidsrc" | "2embed" | "autoembed";
}

export interface CustomCatalogState {
  settings: WebCustomSettings;
  homeHero: MediaItem[];
  trendingMovies: MediaItem[];
  trendingSeries: MediaItem[];
  trendingAnime: MediaItem[];
  moviesHero: MediaItem[];
  bollywood: MediaItem[];
  south: MediaItem[];
  hollywood: MediaItem[];
  regional: MediaItem[];
  franchises: MediaItem[];
  indianStars: StarProfile[];
  hollywoodStars: StarProfile[];
  seriesHero: MediaItem[];
  kdrama: MediaItem[];
  indianWeb: MediaItem[];
  crimeThrillers: MediaItem[];
  romanceSeries: MediaItem[];
  historicalEpics: MediaItem[];
  realityTv: MediaItem[];
  pakistaniDramas: MediaItem[];
  westernSeries: MediaItem[];
  asianDramas: MediaItem[];
  scifiFantasy: MediaItem[];
  animeHero: MediaItem[];
  hindiDubAnime: MediaItem[];
  topShonen: MediaItem[];
  liveChannels: LiveChannel[];
}

const ALL_WORKING_MOVIES: MediaItem[] = [
  {
    id: 974950,
    title: "Jawan",
    poster_path: "https://upload.wikimedia.org/wikipedia/en/3/39/Jawan_film_poster.jpg",
    backdrop_path: "https://upload.wikimedia.org/wikipedia/en/3/39/Jawan_film_poster.jpg",
    vote_average: 8.2,
    media_type: "movie",
    audioLanguages: ["MULTI", "HIN"],
  },
  {
    id: 872906,
    title: "Animal",
    poster_path: "https://upload.wikimedia.org/wikipedia/en/9/90/Animal_%282023_film%29_poster.jpg",
    backdrop_path: "https://upload.wikimedia.org/wikipedia/en/9/90/Animal_%282023_film%29_poster.jpg",
    vote_average: 7.8,
    media_type: "movie",
    audioLanguages: ["MULTI", "HIN"],
  },
  {
    id: 838209,
    title: "Pathaan",
    poster_path: "https://upload.wikimedia.org/wikipedia/en/c/c3/Pathaan_film_poster.jpg",
    backdrop_path: "https://upload.wikimedia.org/wikipedia/en/c/c3/Pathaan_film_poster.jpg",
    vote_average: 7.4,
    media_type: "movie",
    audioLanguages: ["MULTI", "HIN"],
  },
  {
    id: 1072790,
    title: "Dunki",
    poster_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&q=80",
    vote_average: 7.1,
    media_type: "movie",
    audioLanguages: ["MULTI", "HIN"],
  },
  {
    id: 111111,
    title: "12th Fail",
    poster_path: "https://upload.wikimedia.org/wikipedia/en/f/f2/12th_Fail_poster.jpeg",
    backdrop_path: "https://upload.wikimedia.org/wikipedia/en/f/f2/12th_Fail_poster.jpeg",
    vote_average: 8.6,
    media_type: "movie",
    audioLanguages: ["MULTI", "HIN"],
  },
  {
    id: 579974,
    title: "RRR",
    poster_path: "https://upload.wikimedia.org/wikipedia/en/d/d7/RRR_Poster.jpg",
    backdrop_path: "https://upload.wikimedia.org/wikipedia/en/d/d7/RRR_Poster.jpg",
    vote_average: 8.6,
    media_type: "movie",
    audioLanguages: ["MULTI", "TEL", "HIN"],
  },
  {
    id: 222222,
    title: "Kalki 2898 AD",
    poster_path: "https://upload.wikimedia.org/wikipedia/en/4/4c/Kalki_2898_AD.jpg",
    backdrop_path: "https://upload.wikimedia.org/wikipedia/en/4/4c/Kalki_2898_AD.jpg",
    vote_average: 8.0,
    media_type: "movie",
    audioLanguages: ["MULTI", "TEL", "HIN"],
  },
  {
    id: 333333,
    title: "Salaar: Part 1 – Ceasefire",
    poster_path: "https://upload.wikimedia.org/wikipedia/en/a/a6/Salaar_Part_1_%E2%80%93_Ceasefire.jpg",
    backdrop_path: "https://upload.wikimedia.org/wikipedia/en/a/a6/Salaar_Part_1_%E2%80%93_Ceasefire.jpg",
    vote_average: 7.7,
    media_type: "movie",
    audioLanguages: ["MULTI", "TEL", "HIN"],
  },
  {
    id: 792307,
    title: "Leo",
    poster_path: "https://upload.wikimedia.org/wikipedia/en/7/77/Leo_%282023_Indian_film%29.jpg",
    backdrop_path: "https://upload.wikimedia.org/wikipedia/en/7/77/Leo_%282023_Indian_film%29.jpg",
    vote_average: 7.5,
    media_type: "movie",
    audioLanguages: ["MULTI", "TAM", "HIN"],
  },
];

const ALL_WORKING_SERIES: MediaItem[] = [
  {
    id: 119051,
    title: "Wednesday",
    name: "Wednesday",
    poster_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1280&q=80",
    vote_average: 8.5,
    media_type: "tv",
    audioLanguages: ["MULTI", "HIN", "ENG"],
  },
  {
    id: 76479,
    title: "The Boys",
    name: "The Boys",
    poster_path: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1280&q=80",
    vote_average: 8.4,
    media_type: "tv",
    audioLanguages: ["MULTI", "HIN", "ENG"],
  },
  {
    id: 100088,
    title: "The Last of Us",
    name: "The Last of Us",
    poster_path: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=500&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1280&q=80",
    vote_average: 8.6,
    media_type: "tv",
    audioLanguages: ["MULTI", "HIN", "ENG"],
  },
  {
    id: 66732,
    title: "Stranger Things",
    name: "Stranger Things",
    poster_path: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1280&q=80",
    vote_average: 8.6,
    media_type: "tv",
    audioLanguages: ["MULTI", "HIN", "ENG"],
  },
];

const WORKING_ANIME_ITEMS: MediaItem[] = [
  {
    id: 38000,
    title: "Demon Slayer",
    poster_path: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
    backdrop_path: "https://cdn.myanimelist.net/images/anime/1286/99889l.jpg",
    vote_average: 8.5,
    media_type: "tv",
    audioLanguages: ["HIN", "JAP"],
  },
  {
    id: 40748,
    title: "Jujutsu Kaisen",
    poster_path: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
    backdrop_path: "https://cdn.myanimelist.net/images/anime/1171/109222l.jpg",
    vote_average: 8.6,
    media_type: "tv",
    audioLanguages: ["HIN", "JAP"],
  },
  {
    id: 52299,
    title: "Solo Leveling",
    poster_path: "https://cdn.myanimelist.net/images/anime/1096/142999.jpg",
    backdrop_path: "https://cdn.myanimelist.net/images/anime/1096/142999l.jpg",
    vote_average: 8.4,
    media_type: "tv",
    audioLanguages: ["HIN", "JAP"],
  },
  {
    id: 20,
    title: "Naruto",
    poster_path: "https://cdn.myanimelist.net/images/anime/13/17405.jpg",
    backdrop_path: "https://cdn.myanimelist.net/images/anime/13/17405l.jpg",
    vote_average: 8.0,
    media_type: "tv",
    audioLanguages: ["HIN", "JAP"],
  },
];

const DEFAULT_SETTINGS: WebCustomSettings = {
  siteTitle: "SPECTRA",
  tagline: "High-contrast monochrome glassmorphism streaming platform",
  announcementText: "🚀 Spectra Engine 2026 Live: Fast Multi-Audio 4K Streaming Active!",
  showAnnouncement: true,
  accentColor: "red",
  glassBlur: "ultra",
  showHeroCarousel: true,
  showKeepWatching: true,
  showTrendingMovies: true,
  showTrendingSeries: true,
  showTrendingAnime: true,
  showIndianStars: true,
  showHollywoodStars: true,
  showFranchises: true,
  defaultServer: "vidlink",
};

const DEFAULT_CATALOG: CustomCatalogState = {
  settings: DEFAULT_SETTINGS,
  homeHero: ALL_WORKING_MOVIES.slice(0, 5),
  trendingMovies: ALL_WORKING_MOVIES,
  trendingSeries: ALL_WORKING_SERIES,
  trendingAnime: WORKING_ANIME_ITEMS,
  moviesHero: ALL_WORKING_MOVIES.slice(0, 4),
  bollywood: ALL_WORKING_MOVIES.slice(0, 5),
  south: ALL_WORKING_MOVIES.slice(5),
  hollywood: ALL_WORKING_MOVIES.slice(0, 4),
  regional: ALL_WORKING_MOVIES,
  franchises: ALL_WORKING_MOVIES.slice(0, 4),
  indianStars: INDIAN_MOVIE_STARS,
  hollywoodStars: HOLLYWOOD_MOVIE_STARS,
  seriesHero: ALL_WORKING_SERIES,
  kdrama: ALL_WORKING_SERIES,
  indianWeb: ALL_WORKING_SERIES,
  crimeThrillers: ALL_WORKING_SERIES,
  romanceSeries: ALL_WORKING_SERIES,
  historicalEpics: ALL_WORKING_SERIES,
  realityTv: ALL_WORKING_SERIES,
  pakistaniDramas: ALL_WORKING_SERIES,
  westernSeries: ALL_WORKING_SERIES,
  asianDramas: ALL_WORKING_SERIES,
  scifiFantasy: ALL_WORKING_SERIES,
  animeHero: WORKING_ANIME_ITEMS,
  hindiDubAnime: WORKING_ANIME_ITEMS,
  topShonen: WORKING_ANIME_ITEMS,
  liveChannels: CURATED_CHANNELS,
};

export const catalogManager = {
  get: (): CustomCatalogState => DEFAULT_CATALOG,
  save: () => {},
  updateSettings: () => {},
  updateSectionItem: () => {},
  addSectionItem: () => {},
  deleteSectionItem: () => {},
  reset: () => {},
};
