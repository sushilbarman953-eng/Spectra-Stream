"use client";

import {
  MediaItem,
  BOLLYWOOD_CATALOG,
  SOUTH_INDIAN_CATALOG,
  HOLLYWOOD_CATALOG,
  REGIONAL_CATALOG,
  BACKUP_HINDI_SERIES,
} from "@/lib/tmdb";
import { INDIAN_MOVIE_STARS, HOLLYWOOD_MOVIE_STARS, StarProfile } from "@/components/StarSpotlightCapsules";

export interface CustomCatalogState {
  hero: MediaItem[];
  bollywood: MediaItem[];
  south: MediaItem[];
  hollywood: MediaItem[];
  regional: MediaItem[];
  series: MediaItem[];
  indianStars: StarProfile[];
  hollywoodStars: StarProfile[];
}

const STORAGE_KEY = "spectra_custom_catalog_v1";

const DEFAULT_CATALOG: CustomCatalogState = {
  hero: [...HOLLYWOOD_CATALOG.slice(0, 3), ...BOLLYWOOD_CATALOG.slice(0, 2)],
  bollywood: BOLLYWOOD_CATALOG,
  south: SOUTH_INDIAN_CATALOG,
  hollywood: HOLLYWOOD_CATALOG,
  regional: REGIONAL_CATALOG,
  series: BACKUP_HINDI_SERIES,
  indianStars: INDIAN_MOVIE_STARS,
  hollywoodStars: HOLLYWOOD_MOVIE_STARS,
};

export const catalogManager = {
  get: (): CustomCatalogState => {
    if (typeof window === "undefined") return DEFAULT_CATALOG;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
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
