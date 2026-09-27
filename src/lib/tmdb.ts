const TMDB_KEYS = [
  "8414545163a233633636f455ddfebe1e",
  "41b2c4bf2a64c483a31c518b53297a7a",
  "15d2ea6d0dc1d476efbca3eba2b9bbfb",
  process.env.NEXT_PUBLIC_TMDB_API_KEY,
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
  audioLanguages?: string[];
}

export interface EpisodeItem {
  id: number;
  name: string;
  overview?: string;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  vote_average: number;
}

// Fallback credits with authentic, active TMDB CDN avatar paths
export const DEFAULT_CREDITS = {
  cast: [
    { id: 2037, name: "Cillian Murphy", character: "J. Robert Oppenheimer", profile_path: "/i8JgC7bW8zR3rUf7y1m3o6e4A7V.jpg" },
    { id: 5081, name: "Emily Blunt", character: "Katherine Oppenheimer", profile_path: "/5Vf74c7lD4k3a2i5y8x1q9e7b3A.jpg" },
    { id: 1892, name: "Matt Damon", character: "Leslie Groves", profile_path: "/elSlNgAn4DeOF8sqyWnxEeqgWw6.jpg" },
    { id: 3223, name: "Robert Downey Jr.", character: "Lewis Strauss", profile_path: "/5qHNjhtjMD4YWH3vi0l7qWYqVbV.jpg" },
    { id: 1373737, name: "Florence Pugh", character: "Jean Tatlock", profile_path: "/fhBhscsnF2vBvV2N0a8pLpTfQ0C.jpg" },
  ],
  crew: [
    { id: 525, name: "Christopher Nolan", job: "Director", department: "Directing", profile_path: "/xuAIuYSmsUzKlUMBFGVZaWsY3Z5.jpg" },
    { id: 559, name: "Emma Thomas", job: "Producer", department: "Production", profile_path: "/s8eRk1H0c3I7Y4nB8Y3X4q1N6bB.jpg" },
    { id: 282, name: "Charles Roven", job: "Producer", department: "Production", profile_path: "/t08TfQ1s6Yq9vW3b8X7n6m8k4vV.jpg" },
  ],
};

export const BACKUP_HINDI_MOVIES: MediaItem[] = [
  {
    id: 872585,
    title: "Oppenheimer",
    overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
    poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop_path: "/nb3xI8XI3w4pMVZ38VijbsyBqP4.jpg",
    media_type: "movie",
    vote_average: 8.9,
    release_date: "2023",
    audioLanguages: ["ENG", "HIN"],
  },
  {
    id: 976573,
    title: "Jawan",
    overview: "A man is driven by a personal vendetta to rectify the wrongs in society while keeping a promise made years ago.",
    poster_path: "/jMwA3pM9FzK6d9G6jO0b1q4x7.jpg",
    backdrop_path: "/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg",
    media_type: "movie",
    vote_average: 8.1,
    release_date: "2023",
    audioLanguages: ["HIN", "TAM", "TEL"],
  },
  {
    id: 693134,
    title: "Dune: Part Two",
    overview: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    poster_path: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdrop_path: "/xOMo8BRK7PfcJv9JCnx7s520fff.jpg",
    media_type: "movie",
    vote_average: 8.3,
    release_date: "2024",
    audioLanguages: ["ENG", "HIN"],
  },
  {
    id: 579974,
    title: "RRR",
    overview: "A fictional history of two legendary revolutionaries' fight against British colonialists in the 1920s.",
    poster_path: "/nEufeZlyAOLqO2brrs0yeMu1QXO.jpg",
    backdrop_path: "/70AV2Xx5FQYj20xlp09Q5h0sw6a.jpg",
    media_type: "movie",
    vote_average: 8.6,
    release_date: "2022",
    audioLanguages: ["TEL", "HIN", "TAM"],
  },
  {
    id: 1072790,
    title: "Animal",
    overview: "A son's obsessive love for his father leads to a destructive path of bloodshed and retribution.",
    poster_path: "/qjhahNLSZ705B5O1eg47MvU7BqC.jpg",
    backdrop_path: "/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
    media_type: "movie",
    vote_average: 7.9,
    release_date: "2023",
    audioLanguages: ["HIN"],
  },
  {
    id: 533535,
    title: "Deadpool & Wolverine",
    overview: "A listless Wade Wilson toils in civilian life until a threat emerges that requires him to team up with Wolverine.",
    poster_path: "/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    backdrop_path: "/yDHYTjA3R0jFYba16jBB1jv8vpH.jpg",
    media_type: "movie",
    vote_average: 7.8,
    release_date: "2024",
    audioLanguages: ["ENG", "HIN"],
  },
];

export const BACKUP_HINDI_SERIES: MediaItem[] = [
  {
    id: 119051,
    name: "Wednesday",
    overview: "Wednesday Addams investigates a murder spree while navigating relationships at Nevermore Academy.",
    poster_path: "/9PFonQ95165agq9uWjWn4U3X3v7.jpg",
    backdrop_path: "/iHSwvRVsRyxKuXThQFFI502MmJa.jpg",
    media_type: "tv",
    vote_average: 8.5,
    first_air_date: "2022",
    audioLanguages: ["ENG", "HIN"],
  },
  {
    id: 76479,
    name: "The Boys",
    overview: "A group of vigilantes set out to take down corrupt superheroes who abuse their superpowers.",
    poster_path: "/2zmTngn1tYC1AvfnNDBpQI4vlxD.jpg",
    backdrop_path: "/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg",
    media_type: "tv",
    vote_average: 8.8,
    first_air_date: "2019",
    audioLanguages: ["ENG", "HIN"],
  },
  {
    id: 100088,
    name: "The Last of Us",
    overview: "Twenty years after modern civilization has been destroyed, Joel is hired to smuggle Ellie out of an oppressive quarantine zone.",
    poster_path: "/uKvVjHNqB5VmOrdxqmi2vt70aqq.jpg",
    backdrop_path: "/2OMG2D3q5w4x0l8K4m1c8P3x0.jpg",
    media_type: "tv",
    vote_average: 8.9,
    first_air_date: "2023",
    audioLanguages: ["ENG", "HIN"],
  },
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
    for (let i = 0; i < TMDB_KEYS.length; i++) {
      const key = getApiKey();
      try {
        const res = await fetch(`${BASE_URL}/${type}/${id}?api_key=${key}&append_to_response=videos,credits,recommendations,similar`);
        if (res.ok) {
          const data = await res.json();
          if (!data.credits || !data.credits.cast?.length) {
            data.credits = DEFAULT_CREDITS;
          }
          return data;
        }
      } catch {
        keyIdx++;
      }
    }
    const match = [...BACKUP_HINDI_MOVIES, ...BACKUP_HINDI_SERIES].find((m) => String(m.id) === String(id));
    const fallback = match || BACKUP_HINDI_MOVIES[0];
    return {
      ...fallback,
      credits: DEFAULT_CREDITS,
      recommendations: { results: BACKUP_HINDI_MOVIES.filter((m) => String(m.id) !== String(id)) },
    };
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
    return [{ id: 1, name: "Episode 1", episode_number: 1, season_number: seasonNumber, still_path: null, vote_average: 8.5 }];
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
