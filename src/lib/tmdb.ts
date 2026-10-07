export interface MediaItem {
  id: number | string;
  title?: string;
  name?: string;
  overview?: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  vote_average: number;
  media_type?: "movie" | "tv";
  release_date?: string;
  first_air_date?: string;
  audioLanguages?: string[];
  genre_ids?: number[];
  runtime?: number;
}

export interface Genre {
  id: number;
  name: string;
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

export const IMAGE_BASE = "https://image.tmdb.org/t/p";

// 1. BOLLYWOOD (Both 9:16 Poster + 16:9 Backdrop)
export const BOLLYWOOD_CATALOG: MediaItem[] = [
  {
    id: 872906,
    title: "Jawan",
    poster_path: "https://image.tmdb.org/t/p/w500/jYW3g8Q9qY76xV4cO645bJ9UoQ9.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/yF1xTrentcIS5o99ZpHrP3Xeo2.jpg",
    vote_average: 7.4,
    media_type: "movie",
    audioLanguages: ["HIN"],
    release_date: "2023",
  },
  {
    id: 781732,
    title: "Animal",
    poster_path: "https://image.tmdb.org/t/p/w500/hrNm2gTsk8o6R4j9n1t5lO0xQ8A.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/o72R2eGuhYfV1a8x9x7F0L9W0X.jpg",
    vote_average: 6.8,
    media_type: "movie",
    audioLanguages: ["HIN"],
    release_date: "2023",
  },
  {
    id: 866398,
    title: "Dunki",
    poster_path: "https://image.tmdb.org/t/p/w500/tLpA0bA5X9WJk5uF9C7oM3sH1eA.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
    vote_average: 7.1,
    media_type: "movie",
    audioLanguages: ["HIN"],
    release_date: "2023",
  },
  {
    id: 872585,
    title: "Pathaan",
    poster_path: "https://image.tmdb.org/t/p/w500/m1b9ToB5xO0f9GqT8yK4c3eQ0f9.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    vote_average: 6.9,
    media_type: "movie",
    audioLanguages: ["HIN"],
    release_date: "2023",
  },
  {
    id: 976573,
    title: "12th Fail",
    poster_path: "https://image.tmdb.org/t/p/w500/yA0t7c4U5L9Wf8k2J1e4v6M8xQ9.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    vote_average: 8.6,
    media_type: "movie",
    audioLanguages: ["HIN"],
    release_date: "2023",
  },
];

// 2. SOUTH INDIAN (Both 9:16 Poster + 16:9 Backdrop)
export const SOUTH_INDIAN_CATALOG: MediaItem[] = [
  {
    id: 579974,
    title: "RRR",
    poster_path: "https://image.tmdb.org/t/p/w500/wE0noMt2q9ELvlCGQMSvW4gu0vL.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/bQ2ywkchIiaKLSEaMrcT6e29f91.jpg",
    vote_average: 8.6,
    media_type: "movie",
    audioLanguages: ["TEL", "HIN"],
    release_date: "2022",
  },
  {
    id: 801688,
    title: "Kalki 2898 AD",
    poster_path: "https://image.tmdb.org/t/p/w500/x7fB6F5bQ1yK4j9n1t5lO0xQ8A9.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/yF1xTrentcIS5o99ZpHrP3Xeo2.jpg",
    vote_average: 8.0,
    media_type: "movie",
    audioLanguages: ["TEL", "HIN"],
    release_date: "2024",
  },
  {
    id: 872906,
    title: "Salaar: Part 1 – Ceasefire",
    poster_path: "https://image.tmdb.org/t/p/w500/mI5f0qL3n7U9K5wY8t2v6b4c1eA.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
    vote_average: 7.7,
    media_type: "movie",
    audioLanguages: ["TEL", "HIN"],
    release_date: "2023",
  },
  {
    id: 792307,
    title: "Leo",
    poster_path: "https://image.tmdb.org/t/p/w500/p15w8b5jM3t7iF1G8Q4rQ8n5Y7K.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    vote_average: 7.5,
    media_type: "movie",
    audioLanguages: ["TAM", "HIN"],
    release_date: "2023",
  },
];

// 3. HOLLYWOOD DUAL AUDIO (Both 9:16 Poster + 16:9 Backdrop)
export const HOLLYWOOD_CATALOG: MediaItem[] = [
  {
    id: 693134,
    title: "Dune: Part Two",
    poster_path: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5hj0x2.jpg",
    vote_average: 8.3,
    media_type: "movie",
    audioLanguages: ["MULTI", "HIN", "ENG"],
    release_date: "2024",
  },
  {
    id: 533535,
    title: "Deadpool & Wolverine",
    poster_path: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/yDHYTfA3R0jFYba16jBB12R8GNT.jpg",
    vote_average: 7.8,
    media_type: "movie",
    audioLanguages: ["MULTI", "HIN", "ENG"],
    release_date: "2024",
  },
  {
    id: 157336,
    title: "Interstellar",
    poster_path: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/rAiYTsqhk0ND1mOXzP3qY98uk83.jpg",
    vote_average: 8.4,
    media_type: "movie",
    audioLanguages: ["MULTI", "HIN", "ENG"],
    release_date: "2014",
  },
  {
    id: 872585,
    title: "Oppenheimer",
    poster_path: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg",
    vote_average: 8.1,
    media_type: "movie",
    audioLanguages: ["MULTI", "HIN", "ENG"],
    release_date: "2023",
  },
];

// 4. REGIONAL HIT RELEASES
export const REGIONAL_CATALOG: MediaItem[] = [
  {
    id: 853036,
    title: "Carry On Jatta 3",
    poster_path: "https://image.tmdb.org/t/p/w500/d2PqL46aX1j43kG2qDq74X9y0K.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5hj0x2.jpg",
    vote_average: 8.0,
    media_type: "movie",
    audioLanguages: ["PUN", "HIN"],
    release_date: "2023",
  },
  {
    id: 1111101,
    title: "Baap Manus",
    poster_path: "https://image.tmdb.org/t/p/w500/yDHYTfA3R0jFYba16jBB12R8GNT.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg",
    vote_average: 8.4,
    media_type: "movie",
    audioLanguages: ["MAR", "HIN"],
    release_date: "2023",
  },
  {
    id: 1111102,
    title: "Bhooter Bhabishyat",
    poster_path: "https://image.tmdb.org/t/p/w500/7I6VUdPj6tQECNHdviJkUHD2f89.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/rAiYTsqhk0ND1mOXzP3qY98uk83.jpg",
    vote_average: 8.2,
    media_type: "movie",
    audioLanguages: ["BEN", "HIN"],
    release_date: "2012",
  },
  {
    id: 1111103,
    title: "Jatt & Juliet 3",
    poster_path: "https://image.tmdb.org/t/p/w500/wuMc08IPKEatv9rnMNXvIDxqP4W.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/yF1xTrentcIS5o99ZpHrP3Xeo2.jpg",
    vote_average: 7.8,
    media_type: "movie",
    audioLanguages: ["PUN", "HIN"],
    release_date: "2024",
  },
];

export const BACKUP_HINDI_MOVIES: MediaItem[] = [
  ...BOLLYWOOD_CATALOG,
  ...SOUTH_INDIAN_CATALOG,
  ...HOLLYWOOD_CATALOG,
];

// 5. SERIES (Both 9:16 Poster + 16:9 Backdrop)
export const BACKUP_HINDI_SERIES: MediaItem[] = [
  {
    id: 119051,
    name: "Wednesday",
    title: "Wednesday",
    poster_path: "https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg",
    vote_average: 8.5,
    media_type: "tv",
    audioLanguages: ["MULTI", "HIN"],
    first_air_date: "2022",
  },
  {
    id: 76479,
    name: "The Boys",
    title: "The Boys",
    poster_path: "https://image.tmdb.org/t/p/w500/2zmTngn1tYC1AvfnNDBpQIavBk8.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg",
    vote_average: 8.4,
    media_type: "tv",
    audioLanguages: ["MULTI", "HIN"],
    first_air_date: "2019",
  },
  {
    id: 100088,
    name: "The Last of Us",
    title: "The Last of Us",
    poster_path: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2V7JMrHG.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg",
    vote_average: 8.6,
    media_type: "tv",
    audioLanguages: ["MULTI", "HIN"],
    first_air_date: "2023",
  },
  {
    id: 66732,
    name: "Stranger Things",
    title: "Stranger Things",
    poster_path: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
    vote_average: 8.6,
    media_type: "tv",
    audioLanguages: ["MULTI", "HIN"],
    first_air_date: "2016",
  },
];

export const EXTENDED_MOVIES_CATALOG = BACKUP_HINDI_MOVIES;
export const EXTENDED_SERIES_CATALOG = BACKUP_HINDI_SERIES;

export const DEFAULT_CREDITS = {
  cast: [
    { id: 1, name: "Shah Rukh Khan", character: "Lead", profile_path: "https://image.tmdb.org/t/p/w185/A8kW5XORq44SgnYnILR7zp9G2zP.jpg" },
    { id: 2, name: "Deepika Padukone", character: "Lead", profile_path: "https://image.tmdb.org/t/p/w185/kZ09j8mY1e4u6Z9qB3t1Q2M5c7X.jpg" },
    { id: 3, name: "Cillian Murphy", character: "Lead", profile_path: "https://image.tmdb.org/t/p/w185/360Rz7dZ0U575n009kQ2jX8rL1e.jpg" },
  ],
  crew: [
    { id: 10, name: "Christopher Nolan", job: "Director", profile_path: "https://image.tmdb.org/t/p/w185/xuAIuYSmsUzKlUMBFGVZaWsY3Z5.jpg" },
  ],
};

export const tmdb = {
  getTrending: async (type: "movie" | "tv"): Promise<MediaItem[]> => {
    return type === "movie" ? BACKUP_HINDI_MOVIES : BACKUP_HINDI_SERIES;
  },
  getHindiCinema: async (): Promise<MediaItem[]> => BOLLYWOOD_CATALOG,
  getHindiSeries: async (): Promise<MediaItem[]> => BACKUP_HINDI_SERIES,
  getPopular: async (type: "movie" | "tv"): Promise<MediaItem[]> => {
    return type === "movie" ? BOLLYWOOD_CATALOG : BACKUP_HINDI_SERIES;
  },
  getTopRated: async (type: "movie" | "tv"): Promise<MediaItem[]> => {
    return type === "movie" ? SOUTH_INDIAN_CATALOG : BACKUP_HINDI_SERIES;
  },
  discoverMedia: async (type: "movie" | "tv"): Promise<MediaItem[]> => {
    return type === "movie" ? BACKUP_HINDI_MOVIES : BACKUP_HINDI_SERIES;
  },
  getDetails: async (type: "movie" | "tv", id: string | number): Promise<any> => {
    const pool = type === "movie" ? BACKUP_HINDI_MOVIES : BACKUP_HINDI_SERIES;
    const found = pool.find((item) => String(item.id) === String(id)) || pool[0];
    return {
      ...found,
      runtime: 148,
      credits: DEFAULT_CREDITS,
      overview: found?.overview || "Streaming in HD Multi-Audio on Spectra.",
      recommendations: { results: pool.slice(1, 8) },
    };
  },
  getSeasonEpisodes: async (_id: string | number, season: number = 1): Promise<EpisodeItem[]> => {
    return Array.from({ length: 8 }).map((_, idx) => ({
      id: idx + 1,
      name: `Episode ${idx + 1}`,
      overview: `Season ${season} Episode ${idx + 1}`,
      episode_number: idx + 1,
      season_number: season,
      still_path: "https://image.tmdb.org/t/p/w300/uKvVjHNqB5VmOrdxqAt2V7JMrHG.jpg",
      vote_average: 8.5,
    }));
  },
};

export const getRealtimeTrending = async (type: "movie" | "tv" = "movie"): Promise<MediaItem[]> => {
  return type === "movie" ? BACKUP_HINDI_MOVIES : BACKUP_HINDI_SERIES;
};

export const getRealtimeComingSoon = async (): Promise<any[]> => {
  return [
    {
      id: "cs1",
      title: "Devara: Part 1",
      releaseDateText: "Oct 10",
      bookedCount: 16420,
      posterUrl: "https://image.tmdb.org/t/p/w500/wE0noMt2q9ELvlCGQMSvW4gu0vL.jpg",
      type: "movie",
    },
    {
      id: "cs2",
      title: "Kanguva",
      releaseDateText: "Oct 18",
      bookedCount: 12200,
      posterUrl: "https://image.tmdb.org/t/p/w500/p15w8b5jM3t7iF1G8Q4rQ8n5Y7K.jpg",
      type: "movie",
    },
  ];
};
