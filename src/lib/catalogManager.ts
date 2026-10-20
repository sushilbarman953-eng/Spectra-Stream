"use client";

import { MediaItem } from "@/lib/tmdb";
import { HINDI_DUBBED_ANIME_CATALOG } from "@/lib/animeService";
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

const GLOBAL_MOVIES: MediaItem[] = [
  { id: 974950, title: "Jawan", poster_path: "/jFt1g94utjj2YK4aeapSaW012tp.jpg", vote_average: 8.2, media_type: "movie", audioLanguages: ["MULTI", "HIN"] },
  { id: 872906, title: "Animal", poster_path: "/hr95ooB6b6hk32T799WYbh993LO.jpg", vote_average: 7.8, media_type: "movie", audioLanguages: ["MULTI", "HIN"] },
  { id: 838209, title: "Pathaan", poster_path: "/m1b9ToAbG17b73z91r03aK3k8lH.jpg", vote_average: 7.4, media_type: "movie", audioLanguages: ["MULTI", "HIN"] },
  { id: 1072790, title: "Dunki", poster_path: "/zsqJ6n5K2aU6a07E4d9n1mJ0j9h.jpg", vote_average: 7.1, media_type: "movie", audioLanguages: ["MULTI", "HIN"] },
  { id: 111111, title: "12th Fail", poster_path: "/2qkW8PqJ0c6rOq4K7s2d5F8x1A3.jpg", vote_average: 8.6, media_type: "movie", audioLanguages: ["MULTI", "HIN"] },
  { id: 579974, title: "RRR", poster_path: "/nEu44fX3W8zQ0Z0L8yv4cO1q2X3.jpg", vote_average: 8.6, media_type: "movie", audioLanguages: ["MULTI", "TEL", "HIN"] },
  { id: 222222, title: "Kalki 2898 AD", poster_path: "/r174783q5f4k7s2d5F8x1A3y8U4.jpg", vote_average: 8.0, media_type: "movie", audioLanguages: ["MULTI", "TEL", "HIN"] },
  { id: 333333, title: "Salaar: Part 1 - Ceasefire", poster_path: "/a6S2r1a1a7s8d9f0g1h2j3k4l5m.jpg", vote_average: 7.7, media_type: "movie", audioLanguages: ["MULTI", "TEL", "HIN"] },
  { id: 792307, title: "Leo", poster_path: "/pD6sL4v7aB5oN4X8yF1u2X3yK.jpg", vote_average: 7.5, media_type: "movie", audioLanguages: ["MULTI", "TAM", "HIN"] },
  { id: 533535, title: "Deadpool & Wolverine", poster_path: "/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg", backdrop_path: "/yDHYTfA3R0jFYba16jBB1jv8vEU.jpg", vote_average: 8.0, media_type: "movie", audioLanguages: ["MULTI", "HIN", "ENG"] },
  { id: 693134, title: "Dune: Part Two", poster_path: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg", backdrop_path: "/xOMo8BRK7PfcJv9JCnx7s520DRq.jpg", vote_average: 8.3, media_type: "movie", audioLanguages: ["MULTI", "HIN", "ENG"] },
  { id: 157336, title: "Interstellar", poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", backdrop_path: "/rAiYTsqAlinmh6AcKBiAHZKQx8y.jpg", vote_average: 8.4, media_type: "movie", audioLanguages: ["MULTI", "HIN", "ENG"] },
];

const GLOBAL_SERIES: MediaItem[] = [
  { id: 119051, title: "Wednesday", name: "Wednesday", poster_path: "/9PFonBhy4cQy7Jz20NpMygczOkv.jpg", backdrop_path: "/iHSwvRVsRyxKuOCzgEcBmNg9F0P.jpg", vote_average: 8.5, media_type: "tv", audioLanguages: ["MULTI", "HIN", "ENG"] },
  { id: 76479, title: "The Boys", name: "The Boys", poster_path: "/2ZmQuiupcW2Yf4RJwh2Q5S1r44T.jpg", backdrop_path: "/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg", vote_average: 8.4, media_type: "tv", audioLanguages: ["MULTI", "HIN", "ENG"] },
  { id: 100088, title: "The Last of Us", name: "The Last of Us", poster_path: "/uKvVjK19uDUUQ2ebK5d1mqq0m1f.jpg", backdrop_path: "/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg", vote_average: 8.6, media_type: "tv", audioLanguages: ["MULTI", "HIN", "ENG"] },
  { id: 66732, title: "Stranger Things", name: "Stranger Things", poster_path: "/49WJfeN0moxb9IPfGn8AIqMGskD.jpg", backdrop_path: "/56v2KjBlU4XaOv9rVYEQypROD7P.jpg", vote_average: 8.6, media_type: "tv", audioLanguages: ["MULTI", "HIN", "ENG"] },
  { id: 93405, title: "Squid Game", name: "Squid Game", poster_path: "/dDlG1TzUfI8J8mCj5f8p7d2E2kG.jpg", backdrop_path: "/oaGvjB0DvdNDWhPtQ9Ys2z0F1kH.jpg", vote_average: 7.8, media_type: "tv", audioLanguages: ["MULTI", "HIN", "KOR"] },
  { id: 60574, title: "Peaky Blinders", name: "Peaky Blinders", poster_path: "/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg", backdrop_path: "/2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg", vote_average: 8.6, media_type: "tv", audioLanguages: ["MULTI", "HIN", "ENG"] },
  { id: 1399, title: "Game of Thrones", name: "Game of Thrones", poster_path: "/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg", backdrop_path: "/2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg", vote_average: 8.4, media_type: "tv", audioLanguages: ["MULTI", "HIN", "ENG"] },
  { id: 70523, title: "Dark", name: "Dark", poster_path: "/apbrkG8q9qY76xV4cO645bJ9UoQ.jpg", backdrop_path: "/3lBDg3i6nn5R2NK7iVpKsj9o5lA.jpg", vote_average: 8.5, media_type: "tv", audioLanguages: ["MULTI", "HIN", "GER"] },
];

const GLOBAL_ANIME: MediaItem[] = HINDI_DUBBED_ANIME_CATALOG.map((a) => ({
  id: a.mal_id,
  title: a.title_english || a.title,
  poster_path: a.images.jpg.image_url,
  backdrop_path: a.images.jpg.large_image_url || a.images.jpg.image_url,
  vote_average: a.score,
  media_type: "tv" as const,
  audioLanguages: ["HIN", "JAP"],
}));

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
  homeHero: GLOBAL_MOVIES.slice(0, 5),
  trendingMovies: GLOBAL_MOVIES,
  trendingSeries: GLOBAL_SERIES,
  trendingAnime: GLOBAL_ANIME,
  moviesHero: GLOBAL_MOVIES.slice(9, 12).concat(GLOBAL_MOVIES.slice(0, 2)),
  bollywood: GLOBAL_MOVIES.slice(0, 5),
  south: GLOBAL_MOVIES.slice(5, 9),
  hollywood: GLOBAL_MOVIES.slice(9),
  regional: GLOBAL_MOVIES.slice(0, 9),
  franchises: GLOBAL_MOVIES.slice(9),
  indianStars: INDIAN_MOVIE_STARS,
  hollywoodStars: HOLLYWOOD_MOVIE_STARS,
  seriesHero: GLOBAL_SERIES.slice(0, 4),
  kdrama: GLOBAL_SERIES.filter((s) => s.id === 93405 || s.id === 119051),
  indianWeb: GLOBAL_SERIES.slice(0, 3),
  crimeThrillers: GLOBAL_SERIES.slice(1, 6),
  romanceSeries: GLOBAL_SERIES.slice(2, 5),
  historicalEpics: GLOBAL_SERIES.slice(5),
  realityTv: GLOBAL_SERIES.slice(3, 7),
  pakistaniDramas: GLOBAL_SERIES.slice(0, 4),
  westernSeries: GLOBAL_SERIES.slice(0, 5),
  asianDramas: GLOBAL_SERIES.slice(2, 6),
  scifiFantasy: GLOBAL_SERIES.slice(1, 6),
  animeHero: GLOBAL_ANIME.slice(0, 4),
  hindiDubAnime: GLOBAL_ANIME,
  topShonen: GLOBAL_ANIME.slice(0, 4),
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
