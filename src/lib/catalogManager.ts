"use client";

import { MediaItem } from "@/lib/tmdb";
import { LiveChannel, CURATED_CHANNELS } from "@/lib/iptv";
import { StarProfile } from "@/components/StarSpotlightCapsules";

// Universal SVG poster generator (100% offline, zero network requests, zero blocking)
const makePosterSvg = (title: string, color1: string, color2: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${color1}"/>
        <stop offset="50%" stop-color="${color2}"/>
        <stop offset="100%" stop-color="#050508"/>
      </linearGradient>
    </defs>
    <rect width="300" height="450" fill="url(#g)"/>
    <circle cx="150" cy="180" r="48" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
    <polygon points="144,164 164,180 144,196" fill="#ffffff"/>
    <text x="150" y="270" font-family="system-ui,-apple-system,sans-serif" font-weight="900" font-size="20" fill="#ffffff" text-anchor="middle" letter-spacing="1">${title.toUpperCase()}</text>
    <text x="150" y="295" font-family="monospace" font-weight="700" font-size="11" fill="rgba(255,255,255,0.5)" text-anchor="middle" letter-spacing="2">4K ULTRA HD</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

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

const GUARANTEED_MOVIES: MediaItem[] = [
  { id: 974950, title: "Jawan", poster_path: makePosterSvg("Jawan", "#1e3a8a", "#b91c1c"), vote_average: 8.2, media_type: "movie", audioLanguages: ["MULTI", "HIN"] },
  { id: 872906, title: "Animal", poster_path: makePosterSvg("Animal", "#450a0a", "#18181b"), vote_average: 7.8, media_type: "movie", audioLanguages: ["MULTI", "HIN"] },
  { id: 838209, title: "Pathaan", poster_path: makePosterSvg("Pathaan", "#0f172a", "#ea580c"), vote_average: 7.4, media_type: "movie", audioLanguages: ["MULTI", "HIN"] },
  { id: 1072790, title: "Dunki", poster_path: makePosterSvg("Dunki", "#713f12", "#1c1917"), vote_average: 7.1, media_type: "movie", audioLanguages: ["MULTI", "HIN"] },
  { id: 111111, title: "12th Fail", poster_path: makePosterSvg("12th Fail", "#14532d", "#1c1917"), vote_average: 8.6, media_type: "movie", audioLanguages: ["MULTI", "HIN"] },
  { id: 579974, title: "RRR", poster_path: makePosterSvg("RRR", "#7c2d12", "#1e293b"), vote_average: 8.6, media_type: "movie", audioLanguages: ["MULTI", "TEL", "HIN"] },
  { id: 222222, title: "Kalki 2898 AD", poster_path: makePosterSvg("Kalki 2898", "#581c87", "#1e1b4b"), vote_average: 8.0, media_type: "movie", audioLanguages: ["MULTI", "TEL", "HIN"] },
  { id: 333333, title: "Salaar", poster_path: makePosterSvg("Salaar", "#27272a", "#09090b"), vote_average: 7.7, media_type: "movie", audioLanguages: ["MULTI", "TEL", "HIN"] },
  { id: 792307, title: "Leo", poster_path: makePosterSvg("Leo", "#831843", "#18181b"), vote_average: 7.5, media_type: "movie", audioLanguages: ["MULTI", "TAM", "HIN"] },
  { id: 533535, title: "Deadpool", poster_path: makePosterSvg("Deadpool", "#991b1b", "#18181b"), vote_average: 8.0, media_type: "movie", audioLanguages: ["MULTI", "ENG", "HIN"] },
  { id: 693134, title: "Dune 2", poster_path: makePosterSvg("Dune 2", "#854d0e", "#1c1917"), vote_average: 8.3, media_type: "movie", audioLanguages: ["MULTI", "ENG"] },
  { id: 157336, title: "Interstellar", poster_path: makePosterSvg("Interstellar", "#1e3a8a", "#020617"), vote_average: 8.4, media_type: "movie", audioLanguages: ["MULTI", "ENG"] },
];

const GUARANTEED_SERIES: MediaItem[] = [
  { id: 119051, title: "Wednesday", name: "Wednesday", poster_path: makePosterSvg("Wednesday", "#3b0764", "#09090b"), vote_average: 8.5, media_type: "tv", audioLanguages: ["MULTI", "HIN", "ENG"] },
  { id: 76479, title: "The Boys", name: "The Boys", poster_path: makePosterSvg("The Boys", "#991b1b", "#0f172a"), vote_average: 8.4, media_type: "tv", audioLanguages: ["MULTI", "HIN", "ENG"] },
  { id: 100088, title: "The Last of Us", name: "The Last of Us", poster_path: makePosterSvg("Last of Us", "#365314", "#0c0a09"), vote_average: 8.6, media_type: "tv", audioLanguages: ["MULTI", "HIN", "ENG"] },
  { id: 66732, title: "Stranger Things", name: "Stranger Things", poster_path: makePosterSvg("Stranger", "#831843", "#18181b"), vote_average: 8.6, media_type: "tv", audioLanguages: ["MULTI", "HIN", "ENG"] },
  { id: 93405, title: "Squid Game", name: "Squid Game", poster_path: makePosterSvg("Squid Game", "#be185d", "#111827"), vote_average: 7.8, media_type: "tv", audioLanguages: ["MULTI", "HIN", "KOR"] },
  { id: 1399, title: "Game of Thrones", name: "Game of Thrones", poster_path: makePosterSvg("GoT", "#1e293b", "#020617"), vote_average: 8.4, media_type: "tv", audioLanguages: ["MULTI", "HIN", "ENG"] },
];

const GUARANTEED_ANIME: MediaItem[] = [
  { id: 38000, title: "Demon Slayer", poster_path: makePosterSvg("Demon Slayer", "#065f46", "#111827"), vote_average: 8.5, media_type: "tv", audioLanguages: ["HIN", "JAP"] },
  { id: 40748, title: "Jujutsu Kaisen", poster_path: makePosterSvg("Jujutsu Kaisen", "#1e1b4b", "#312e81"), vote_average: 8.6, media_type: "tv", audioLanguages: ["HIN", "JAP"] },
  { id: 52299, title: "Solo Leveling", poster_path: makePosterSvg("Solo Leveling", "#1e3a8a", "#020617"), vote_average: 8.4, media_type: "tv", audioLanguages: ["HIN", "JAP"] },
  { id: 20, title: "Naruto", poster_path: makePosterSvg("Naruto", "#ea580c", "#18181b"), vote_average: 8.0, media_type: "tv", audioLanguages: ["HIN", "JAP"] },
  { id: 21, title: "One Piece", poster_path: makePosterSvg("One Piece", "#dc2626", "#1e3a8a"), vote_average: 8.7, media_type: "tv", audioLanguages: ["HIN", "JAP"] },
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
  homeHero: GUARANTEED_MOVIES.slice(0, 5),
  trendingMovies: GUARANTEED_MOVIES,
  trendingSeries: GUARANTEED_SERIES,
  trendingAnime: GUARANTEED_ANIME,
  moviesHero: GUARANTEED_MOVIES.slice(8).concat(GUARANTEED_MOVIES.slice(0, 2)),
  bollywood: GUARANTEED_MOVIES.slice(0, 5),
  south: GUARANTEED_MOVIES.slice(5, 9),
  hollywood: GUARANTEED_MOVIES.slice(9),
  regional: GUARANTEED_MOVIES.slice(0, 9),
  franchises: GUARANTEED_MOVIES.slice(9),
  indianStars: [
    { id: "srk", name: "Shah Rukh Khan", role: "King Khan", imageUrl: makePosterSvg("SRK", "#b45309", "#1c1917"), gradient: "bg-gradient-to-tr from-amber-500 to-red-600" },
    { id: "prabhas", name: "Prabhas", role: "Rebel Star", imageUrl: makePosterSvg("Prabhas", "#b91c1c", "#1c1917"), gradient: "bg-gradient-to-tr from-red-600 to-orange-500" },
    { id: "deepika", name: "Deepika Padukone", role: "Leading Actress", imageUrl: makePosterSvg("Deepika", "#be185d", "#1c1917"), gradient: "bg-gradient-to-tr from-pink-500 to-purple-600" },
    { id: "jr_ntr", name: "Jr. NTR", role: "Man of Masses", imageUrl: makePosterSvg("Jr NTR", "#047857", "#1c1917"), gradient: "bg-gradient-to-tr from-emerald-500 to-teal-500" },
  ],
  hollywoodStars: [
    { id: "cruise", name: "Tom Cruise", role: "Action Icon", imageUrl: makePosterSvg("Cruise", "#0284c7", "#0f172a"), gradient: "bg-gradient-to-tr from-cyan-500 to-blue-600" }
  ],
  seriesHero: GUARANTEED_SERIES.slice(0, 4),
  kdrama: GUARANTEED_SERIES,
  indianWeb: GUARANTEED_SERIES.slice(0, 3),
  crimeThrillers: GUARANTEED_SERIES.slice(1, 5),
  romanceSeries: GUARANTEED_SERIES,
  historicalEpics: GUARANTEED_SERIES,
  realityTv: GUARANTEED_SERIES,
  pakistaniDramas: GUARANTEED_SERIES,
  westernSeries: GUARANTEED_SERIES,
  asianDramas: GUARANTEED_SERIES,
  scifiFantasy: GUARANTEED_SERIES,
  animeHero: GUARANTEED_ANIME,
  hindiDubAnime: GUARANTEED_ANIME,
  topShonen: GUARANTEED_ANIME,
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
