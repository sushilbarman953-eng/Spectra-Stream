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
import { HINDI_DUBBED_ANIME_CATALOG, AnimeItem } from "@/lib/animeService";
import { CURATED_CHANNELS, LiveChannel } from "@/lib/iptv";
import { INDIAN_MOVIE_STARS, HOLLYWOOD_MOVIE_STARS, StarProfile } from "@/components/StarSpotlightCapsules";

export interface CustomCatalogState {
  // Home Tab
  homeHero: MediaItem[];
  trendingMovies: MediaItem[];
  trendingSeries: MediaItem[];
  trendingAnime: MediaItem[];
  
  // Movies Tab
  moviesHero: MediaItem[];
  bollywood: MediaItem[];
  south: MediaItem[];
  hollywood: MediaItem[];
  regional: MediaItem[];
  franchises: MediaItem[];
  indianStars: StarProfile[];
  hollywoodStars: StarProfile[];
  
  // Series Tab
  seriesHero: MediaItem[];
  kdrama: MediaItem[];
  indianWeb: MediaItem[];
  crimeThrillers: MediaItem[];
  
  // Anime Tab
  animeHero: MediaItem[];
  hindiDubAnime: MediaItem[];
  topShonen: MediaItem[];
  
  // Live TV Tab
  liveChannels: LiveChannel[];
}

const STORAGE_KEY = "spectra_universal_catalog_v2";

const DEFAULT_ANIME_ITEMS: MediaItem[] = HINDI_DUBBED_ANIME_CATALOG.map((a) => ({
  id: a.mal_id,
  title: a.title_english || a.title,
  poster_path: a.images.jpg.image_url,
  backdrop_path: a.images.jpg.large_image_url || a.images.jpg.image_url,
  vote_average: a.score,
  media_type: "tv" as const,
  audioLanguages: ["HIN", "JAP"],
}));

const DEFAULT_CATALOG: CustomCatalogState = {
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
      if (stored) return { ...DEFAULT_CATALOG, ...JSON.parse(stored) };
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

  updateSectionItem: (section: keyof CustomCatalogState, index: number, updatedItem: any) => {
    const current = catalogManager.get();
    const list = [...(current[section] as any[])];
    list[index] = { ...list[index], ...updatedItem };
    current[section] = list as any;
    catalogManager.save(current);
  },

  addSectionItem: (section: keyof CustomCatalogState, newItem: any) => {
    const current = catalogManager.get();
    current[section] = [newItem, ...(current[section] as any[])] as any;
    catalogManager.save(current);
  },

  deleteSectionItem: (section: keyof CustomCatalogState, index: number) => {
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
