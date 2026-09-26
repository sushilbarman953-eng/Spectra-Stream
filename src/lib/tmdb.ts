export const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "4ef342f0b9bb36bb339e083c276a1421";
export const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const IMAGE_BASE = "https://image.tmdb.org/t/p";

export interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  media_type?: "movie" | "tv";
}

export interface EpisodeItem {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path?: string;
  air_date?: string;
  vote_average?: number;
}

const fetchTMDB = async (endpoint: string, params: Record<string, string> = {}) => {
  try {
    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
    url.searchParams.set("api_key", TMDB_API_KEY);
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        url.searchParams.set(key, val);
      }
    });

    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`TMDB fetch failed for ${endpoint}: ${res.statusText}`);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error(`TMDB Network Error for ${endpoint}:`, err);
    return null;
  }
};

export const tmdb = {
  getTrending: async (type: "all" | "movie" | "tv" = "all", timeWindow: "day" | "week" = "day"): Promise<MediaItem[]> => {
    const data = await fetchTMDB(`/trending/${type}/${timeWindow}`);
    return (data?.results || []).map((item: any) => ({
      ...item,
      media_type: item.media_type || (type === "all" ? (item.title ? "movie" : "tv") : type),
    }));
  },

  getMovies: async (category: "popular" | "top_rated" | "upcoming" | "now_playing" = "popular", page = 1): Promise<MediaItem[]> => {
    const data = await fetchTMDB(`/movie/${category}`, { page: String(page) });
    return (data?.results || []).map((m: any) => ({ ...m, media_type: "movie" }));
  },

  getTVShows: async (category: "popular" | "top_rated" | "airing_today" | "on_the_air" = "popular", page = 1): Promise<MediaItem[]> => {
    const data = await fetchTMDB(`/tv/${category}`, { page: String(page) });
    return (data?.results || []).map((t: any) => ({ ...t, media_type: "tv" }));
  },

  // Aliases used across /movies and /series pages
  getPopularMovies: async (page = 1): Promise<MediaItem[]> => {
    return tmdb.getMovies("popular", page);
  },

  getTopRatedMovies: async (page = 1): Promise<MediaItem[]> => {
    return tmdb.getMovies("top_rated", page);
  },

  getPopularTV: async (page = 1): Promise<MediaItem[]> => {
    return tmdb.getTVShows("popular", page);
  },

  getTopRatedTV: async (page = 1): Promise<MediaItem[]> => {
    return tmdb.getTVShows("top_rated", page);
  },

  // Anime helper method
  getAnime: async (page = 1): Promise<MediaItem[]> => {
    const data = await fetchTMDB("/discover/tv", {
      page: String(page),
      with_genres: "16",
      with_original_language: "ja",
      sort_by: "popularity.desc",
    });
    return (data?.results || []).map((item: any) => ({ ...item, media_type: "tv" }));
  },

  discoverMedia: async (
    type: "movie" | "tv",
    genreId?: string | number,
    sortBy: string = "popularity.desc",
    page = 1
  ): Promise<MediaItem[]> => {
    const params: Record<string, string> = { page: String(page), sort_by: sortBy };
    if (genreId) params.with_genres = String(genreId);
    if (genreId === 16) params.with_original_language = "ja";
    const data = await fetchTMDB(`/discover/${type}`, params);
    return (data?.results || []).map((item: any) => ({ ...item, media_type: type }));
  },

  discover: async (type: "movie" | "tv", genreId?: string | number, page = 1): Promise<MediaItem[]> => {
    return tmdb.discoverMedia(type, genreId, "popularity.desc", page);
  },

  getDetails: async (type: "movie" | "tv", id: string | number) => {
    return await fetchTMDB(`/${type}/${id}`, {
      append_to_response: "credits,similar,recommendations,videos",
    });
  },

  getSeasonEpisodes: async (tvId: string | number, seasonNumber: number = 1): Promise<EpisodeItem[]> => {
    const data = await fetchTMDB(`/tv/${tvId}/season/${seasonNumber}`);
    return data?.episodes || [];
  },

  search: async (query: string, page = 1): Promise<MediaItem[]> => {
    const data = await fetchTMDB("/search/multi", {
      query,
      page: String(page),
      include_adult: "false",
    });
    return data?.results || [];
  },
};
