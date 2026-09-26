const TMDB_KEYS = [
  process.env.NEXT_PUBLIC_TMDB_API_KEY,
  "8414545163a233633636f455ddfebe1e",
  "41b2c4bf2a64c483a31c518b53297a7a",
  "15d2ea6d0dc1d476efbca3eba2b9bbfb",
].filter(Boolean) as string[];

let keyIdx = 0;
const getApiKey = () => TMDB_KEYS[keyIdx % TMDB_KEYS.length];

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

export const BACKUP_HINDI_MOVIES: MediaItem[] = [
  { id: 976573, title: "Jawan", overview: "High-octane action thriller.", poster_path: "/jCdqvdhpj340M1c6R3w2P6uM3wK.jpg", backdrop_path: "/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg", media_type: "movie", vote_average: 8.1, release_date: "2023" },
  { id: 872585, title: "Oppenheimer", overview: "The story of J. Robert Oppenheimer.", poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", backdrop_path: "/rLb2cw69P7FFQ0aTaEg57OJum6X.jpg", media_type: "movie", vote_average: 8.9, release_date: "2023" },
  { id: 579974, title: "RRR", overview: "Legendary revolutionaries revolt.", poster_path: "/wE0Q2pUqfq4Oaoi4w3c1bZpA6U7.jpg", backdrop_path: "/70AV2Xx5FQYj20xlp09Q5h0sw6a.jpg", media_type: "movie", vote_average: 8.6, release_date: "2022" },
  { id: 1072790, title: "Animal", overview: "A path of vengeance and blood.", poster_path: "/hrAWn0EaM3N1n92l9b2xW3x4F9Z.jpg", backdrop_path: "/35rWJm4u81vXbZ3l2a8gq9m3jK1.jpg", media_type: "movie", vote_average: 7.9, release_date: "2023" },
  { id: 693134, title: "Dune: Part Two", overview: "Paul Atreides unites the Fremen.", poster_path: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg", backdrop_path: "/xOMo8BRK7PfcJv9JCnx7s520fff.jpg", media_type: "movie", vote_average: 8.3, release_date: "2024" },
  { id: 533535, title: "Deadpool & Wolverine", overview: "A multiverse tag team rescue mission.", poster_path: "/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg", backdrop_path: "/yDHYTjA3R0jFYba16jBB1jv8vpH.jpg", media_type: "movie", vote_average: 7.8, release_date: "2024" },
];

export const BACKUP_HINDI_SERIES: MediaItem[] = [
  { id: 119051, name: "Wednesday", overview: "Wednesday solves a murder mystery.", poster_path: "/9PFonQ95165agq9uWjWn4U3X3v7.jpg", backdrop_path: "/iHSwvRVsRyxKuXThQFFI502MmJa.jpg", media_type: "tv", vote_average: 8.5, first_air_date: "2022" },
  { id: 76479, name: "The Boys", overview: "Vigilantes battle corrupt heroes.", poster_path: "/7vjaCdMw15FEb9YAcKVTV09umKM.jpg", backdrop_path: "/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg", media_type: "tv", vote_average: 8.8, first_air_date: "2019" },
  { id: 100088, name: "The Last of Us", overview: "Survival across post-pandemic America.", poster_path: "/uKvVjHNqB5VmOrdxqmi2vt70aqq.jpg", backdrop_path: "/2OMG2D3q5w4x0l8K4m1c8P3x0.jpg", media_type: "tv", vote_average: 8.9, first_air_date: "2023" },
  { id: 60625, name: "Rick and Morty", overview: "Sci-fi dimensions with grandson.", poster_path: "/cvhNj9eoRBe5SxjUQapQT5EUmtF.jpg", backdrop_path: "/uGy4DCmM33I7lPQWNIz6Fc2da8O.jpg", media_type: "tv", vote_average: 8.7, first_air_date: "2013" },
  { id: 93405, name: "Squid Game", overview: "Survival prize tournament.", poster_path: "/dDlG9v5u2l8K4m1c8P3x0n2l0K1.jpg", backdrop_path: "/70AV2Xx5FQYj20xlp09Q5h0sw6a.jpg", media_type: "tv", vote_average: 8.6, first_air_date: "2021" },
  { id: 1399, name: "Game of Thrones", overview: "Nine noble families clash.", poster_path: "/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg", backdrop_path: "/suopoADq0k8YZr4dQXcU6p0qYq2.jpg", media_type: "tv", vote_average: 8.4, first_air_date: "2011" },
];

const safeFetch = async (endpoint: string, backup: MediaItem[]): Promise<MediaItem[]> => {
  for (let attempt = 0; attempt < TMDB_KEYS.length; attempt++) {
    const key = getApiKey();
    const delimiter = endpoint.includes("?") ? "&" : "?";
    const url = `${BASE_URL}${endpoint}${delimiter}api_key=${key}`;

    try {
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.results) && data.results.length > 0) {
          const cleaned = data.results.filter((i: any) => i.poster_path && i.poster_path.startsWith("/"));
          return cleaned.length > 0 ? cleaned : backup;
        }
      } else {
        keyIdx++;
      }
    } catch {
      keyIdx++;
    }
  }
  return backup;
};

export const tmdb = {
  getTrendingIndia: async (page = 1) => safeFetch(`/trending/all/day?region=IN&page=${page}`, BACKUP_HINDI_MOVIES),
  getHindiCinema: async (page = 1) => safeFetch(`/discover/movie?with_original_language=hi&region=IN&sort_by=popularity.desc&page=${page}`, BACKUP_HINDI_MOVIES),
  getHindiSeries: async (page = 1) => safeFetch(`/discover/tv?with_original_language=hi&sort_by=popularity.desc&page=${page}`, BACKUP_HINDI_SERIES),
  getTrending: async (type: "all" | "movie" | "tv" = "all") => safeFetch(`/trending/${type}/day?region=IN`, type === "tv" ? BACKUP_HINDI_SERIES : BACKUP_HINDI_MOVIES),
  
  discoverMedia: async (type: "movie" | "tv", genreId?: number, extraParams = "") => {
    const genreParam = genreId ? `&with_genres=${genreId}` : "";
    return safeFetch(`/discover/${type}?sort_by=popularity.desc&include_adult=false&region=IN${genreParam}${extraParams}`, type === "tv" ? BACKUP_HINDI_SERIES : BACKUP_HINDI_MOVIES);
  },

  getPopularMovies: async () => safeFetch(`/movie/popular?region=IN`, BACKUP_HINDI_MOVIES),
  getPopularTV: async () => safeFetch(`/tv/popular?region=IN`, BACKUP_HINDI_SERIES),
  getTopRated: async (type: "movie" | "tv" = "movie") => safeFetch(`/${type}/top_rated?region=IN`, type === "tv" ? BACKUP_HINDI_SERIES : BACKUP_HINDI_MOVIES),
  
  getDetails: async (type: "movie" | "tv", id: string | number) => {
    const key = getApiKey();
    try {
      const res = await fetch(`${BASE_URL}/${type}/${id}?api_key=${key}&append_to_response=videos,credits`);
      if (res.ok) return await res.json();
    } catch {}
    const match = [...BACKUP_HINDI_MOVIES, ...BACKUP_HINDI_SERIES].find((m) => String(m.id) === String(id));
    return match || BACKUP_HINDI_MOVIES[0];
  },
  
  getSeasonEpisodes: async (tvId: string | number, seasonNumber: number) => {
    const key = getApiKey();
    try {
      const res = await fetch(`${BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${key}`);
      if (res.ok) {
        const data = await res.json();
        return data.episodes || [];
      }
    } catch {}
    return [{ id: 1, name: "Episode 1: Pilot", episode_number: 1, season_number: seasonNumber, still_path: null, vote_average: 8.5 }];
  },
  
  search: async (query: string) => {
    const key = getApiKey();
    try {
      const res = await fetch(`${BASE_URL}/search/multi?api_key=${key}&query=${encodeURIComponent(query)}`);
      if (res.ok) return await res.json();
    } catch {}
    return { results: BACKUP_HINDI_MOVIES };
  }
};
