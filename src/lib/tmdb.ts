const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "41b2c4bf2a64c483a31c518b53297a7a";
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

export const tmdb = {
  // 1. Trending (Universal & Legacy Support)
  getTrending: async (type: "all" | "movie" | "tv" = "all", timeWindow: "day" | "week" = "day") => {
    const res = await fetch(
      `${BASE_URL}/trending/${type}/${timeWindow}?api_key=${TMDB_API_KEY}&region=IN`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    return data.results || [];
  },

  // 2. Discover Media by Genre
  discoverMedia: async (type: "movie" | "tv", genreId?: number, page = 1) => {
    const genreParam = genreId ? `&with_genres=${genreId}` : "";
    const res = await fetch(
      `${BASE_URL}/discover/${type}?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&include_adult=false&page=${page}&region=IN${genreParam}`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    return data.results || [];
  },

  // 3. Indian & Hindi Region Specials
  getTrendingIndia: async (page = 1) => {
    const res = await fetch(
      `${BASE_URL}/trending/all/day?api_key=${TMDB_API_KEY}&region=IN&page=${page}`,
      { next: { revalidate: 3600 } }
    );
    return res.json();
  },

  getHindiCinema: async (page = 1) => {
    const res = await fetch(
      `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_original_language=hi&region=IN&sort_by=popularity.desc&page=${page}`,
      { next: { revalidate: 3600 } }
    );
    return res.json();
  },

  getHindiSeries: async (page = 1) => {
    const res = await fetch(
      `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_original_language=hi&sort_by=popularity.desc&page=${page}`,
      { next: { revalidate: 3600 } }
    );
    return res.json();
  },

  // 4. Popular & Top Rated Catalogs (Both getPopularSeries & getPopularTV supported)
  getPopularMovies: async (page = 1) => {
    const res = await fetch(
      `${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&region=IN&page=${page}`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    return data.results || [];
  },

  getPopularSeries: async (page = 1) => {
    const res = await fetch(
      `${BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&page=${page}`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    return data.results || [];
  },

  // Alias for legacy pages calling getPopularTV
  getPopularTV: async (page = 1) => {
    const res = await fetch(
      `${BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&page=${page}`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    return data.results || [];
  },

  getTopRated: async (type: "movie" | "tv" = "movie", page = 1) => {
    const res = await fetch(
      `${BASE_URL}/${type}/top_rated?api_key=${TMDB_API_KEY}&page=${page}&region=IN`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    return data.results || [];
  },

  // 5. Details & Seasons
  getDetails: async (type: "movie" | "tv", id: string | number) => {
    const res = await fetch(
      `${BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits,recommendations`,
      { next: { revalidate: 3600 } }
    );
    return res.json();
  },

  getSeasonEpisodes: async (tvId: string | number, seasonNumber: number): Promise<EpisodeItem[]> => {
    const res = await fetch(
      `${BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    return data.episodes || [];
  },

  // 6. Multi-Search
  search: async (query: string, page = 1) => {
    const res = await fetch(
      `${BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`,
      { next: { revalidate: 1800 } }
    );
    return res.json();
  }
};
