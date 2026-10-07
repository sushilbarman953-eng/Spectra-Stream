"use client";

import {
  MediaItem,
  BOLLYWOOD_CATALOG,
  SOUTH_INDIAN_CATALOG,
  HOLLYWOOD_CATALOG,
  REGIONAL_CATALOG,
  BACKUP_HINDI_MOVIES,
  BACKUP_HINDI_SERIES,
} from "@/lib/tmdb";
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
  animeHero: MediaItem[];
  hindiDubAnime: MediaItem[];
  topShonen: MediaItem[];
  liveChannels: LiveChannel[];
}

const STORAGE_KEY = "spectra_universal_catalog_v4";

const DEFAULT_ANIME_ITEMS: MediaItem[] = HINDI_DUBBED_ANIME_CATALOG.map((a) => ({
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
  homeHero: BACKUP_HINDI_MOVIES.slice(0, 5),
  trendingMovies: BACKUP_HINDI_MOVIES.slice(0, 10),
  trendingSeries: BACKUP_HINDI_SERIES.slice(0, 8),
  trendingAnime: DEFAULT_ANIME_ITEMS.slice(0, 8),
  moviesHero: [...HOLLYWOOD_CATALOG.slice(0, 3), ...BOLLYWOOD_CATALOG.slice(0, 2)],
  bollywood: BOLLYWOOD_CATALOG,
  south: SOUTH_INDIAN_CATALOG,
  hollywood: HOLLYWOOD_CATALOG,
  regional: REGIONAL_CATALOG,
  franchises: HOLLYWOOD_CATALOG.slice(1, 5),
  indianStars: INDIAN_MOVIE_STARS,
  hollywoodStars: HOLLYWOOD_MOVIE_STARS,
  seriesHero: BACKUP_HINDI_SERIES.slice(0, 5),
  kdrama: BACKUP_HINDI_SERIES.slice(2, 6),
  indianWeb: BACKUP_HINDI_SERIES.slice(0, 4),
  crimeThrillers: BACKUP_HINDI_SERIES.slice(1, 5),
  animeHero: DEFAULT_ANIME_ITEMS.slice(0, 5),
  hindiDubAnime: DEFAULT_ANIME_ITEMS,
  topShonen: DEFAULT_ANIME_ITEMS.slice(0, 4),
  liveChannels: CURATED_CHANNELS,
};

export const catalogManager = {
  get: (): CustomCatalogState => {
    if (typeof window === "undefined") return DEFAULT_CATALOG;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_CATALOG,
          ...parsed,
          settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
          moviesHero: parsed.moviesHero?.length ? parsed.moviesHero : DEFAULT_CATALOG.moviesHero,
        };
      }
    } catch (e) {
      console.error("Failed to load catalog", e);
    }
    return DEFAULT_CATALOG;
  },

  save: (data: CustomCatalogState) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event("spectra_catalog_updated"));
  },

  updateSettings: (newSettings: Partial<WebCustomSettings>) => {
    const current = catalogManager.get();
    current.settings = { ...current.settings, ...newSettings };
    catalogManager.save(current);
  },

  updateSectionItem: (section: keyof Omit<CustomCatalogState, "settings">, index: number, updatedItem: any) => {
    const current = catalogManager.get();
    const list = [...(current[section] as any[])];
    list[index] = { ...list[index], ...updatedItem };
    current[section] = list as any;
    catalogManager.save(current);
  },

  addSectionItem: (section: keyof Omit<CustomCatalogState, "settings">, newItem: any) => {
    const current = catalogManager.get();
    current[section] = [newItem, ...(current[section] as any[])] as any;
    catalogManager.save(current);
  },

  deleteSectionItem: (section: keyof Omit<CustomCatalogState, "settings">, index: number) => {
    const current = catalogManager.get();
    const list = [...(current[section] as any[])];
    list.splice(index, 1);
    current[section] = list as any;
    catalogManager.save(current);
  },

  reset: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("spectra_catalog_updated"));
  },
};
