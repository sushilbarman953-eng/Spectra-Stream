const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL || "https://api.themoviedb.org/3";
export const IMAGE_BASE = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE || "https://image.tmdb.org/t/p";

export interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  media_type?: "movie" | "tv";
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
}

async function fetchFromTMDB(endpoint: string, params: Record<string, string> = {}) {
  if (!API_KEY) {
    console.warn("TMDB API key is missing. Set NEXT_PUBLIC_TMDB_API_KEY in .env.local");
    return null;
  }

  const query = new URLSearchParams({
    api_key: API_KEY,
    language: "en-US",
    ...params,
  });

  try {
    const res = await fetch(`${BASE_URL}${endpoint}?${query.toString()}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`TMDB ${endpoint} responded with status: ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error(`TMDB fetch error at ${endpoint}:`, error);
    return null;
  }
}

export const tmdb = {
  getTrending: async (type: "all" | "movie" | "tv" = "all"): Promise<MediaItem[]> => {
    const data = await fetchFromTMDB(`/trending/${type}/day`);
    return data?.results || [];
  },
  getPopularMovies: async (): Promise<MediaItem[]> => {
    const data = await fetchFromTMDB("/movie/popular");
    return data?.results || [];
  },
  getPopularTV: async (): Promise<MediaItem[]> => {
    const data = await fetchFromTMDB("/tv/popular");
    return data?.results || [];
  },
  getAnime: async (): Promise<MediaItem[]> => {
    const data = await fetchFromTMDB("/discover/tv", {
      with_genres: "16",
      with_original_language: "ja",
      sort_by: "popularity.desc",
    });
    return data?.results || [];
  },
  getDetails: async (type: "movie" | "tv", id: string) => {
    // Attempt requested type first
    let data = await fetchFromTMDB(`/${type}/${id}`, {
      append_to_response: "videos,credits,similar",
    });

    // If 404, fallback to checking the alternative media type
    if (!data) {
      const fallbackType = type === "movie" ? "tv" : "movie";
      data = await fetchFromTMDB(`/${fallbackType}/${id}`, {
        append_to_response: "videos,credits,similar",
      });
    }

    return data;
  },
};
