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
  genre_ids: number[];
}

async function fetchFromTMDB(endpoint: string, params: Record<string, string> = {}) {
  if (!API_KEY) {
    console.warn("TMDB API key is missing. Set NEXT_PUBLIC_TMDB_API_KEY in .env.local");
    return { results: [] };
  }

  const query = new URLSearchParams({
    api_key: API_KEY,
    language: "en-US",
    ...params,
  });

  const res = await fetch(`${BASE_URL}${endpoint}?${query.toString()}`, {
    next: { revalidate: 3600 }, // Cache TMDB response for 1 hour
  });

  if (!res.ok) {
    throw new Error(`TMDB Request failed with status ${res.status}`);
  }

  return res.json();
}

export const tmdb = {
  getTrending: async (type: "all" | "movie" | "tv" = "all"): Promise<MediaItem[]> => {
    const data = await fetchFromTMDB(`/trending/${type}/day`);
    return data.results || [];
  },
  getPopularMovies: async (): Promise<MediaItem[]> => {
    const data = await fetchFromTMDB("/movie/popular");
    return data.results || [];
  },
  getPopularTV: async (): Promise<MediaItem[]> => {
    const data = await fetchFromTMDB("/tv/popular");
    return data.results || [];
  },
  getAnime: async (): Promise<MediaItem[]> => {
    // TMDB genre 16 is Animation, with original language Japanese ('ja')
    const data = await fetchFromTMDB("/discover/tv", {
      with_genres: "16",
      with_original_language: "ja",
      sort_by: "popularity.desc",
    });
    return data.results || [];
  },
  getDetails: async (type: "movie" | "tv", id: string) => {
    return fetchFromTMDB(`/${type}/${id}`, { append_to_response: "videos,credits,similar" });
  },
};
