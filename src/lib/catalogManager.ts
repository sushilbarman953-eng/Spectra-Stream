"use client";

import { MediaItem } from "@/lib/tmdb";
import { LiveChannel, CURATED_CHANNELS } from "@/lib/iptv";
import { StarProfile } from "@/components/StarSpotlightCapsules";

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
  romanceSeries: MediaItem[];
  historicalEpics: MediaItem[];
  realityTv: MediaItem[];
  pakistaniDramas: MediaItem[];
  westernSeries: MediaItem[];
  asianDramas: MediaItem[];
  scifiFantasy: MediaItem[];
  animeHero: MediaItem[];
  hindiDubAnime: MediaItem[];
  topShonen: MediaItem[];
  liveChannels: LiveChannel[];
}

const REAL_MOVIES: MediaItem[] = [
  {
    id: 974950,
    title: "Jawan",
    poster_path: "https://upload.wikimedia.org/wikipedia/en/3/39/Jawan_film_poster.jpg",
    backdrop_path: "https://upload.wikimedia.org/wikipedia/en/3/39/Jawan_film_poster.jpg",
    vote_average: 8.2,
    media_type: "movie",
    audioLanguages: ["MULTI", "HIN"],
  },
  {
    id: 872906,
    title: "Animal",
    poster_path: "https://upload.wikimedia.org/wikipedia/en/9/90/Animal_%282023_film%29_poster.jpg",
    backdrop_path: "https://upload.wikimedia.org/wikipedia/en/9/90/Animal_%282023_film%29_poster.jpg",
    vote_average: 7.8,
    media_type: "movie",
    audioLanguages: ["MULTI", "HIN"],
  },
  {
    id: 838209,
    title: "Pathaan",
    poster_path: "https://upload.wikimedia.org/wikipedia/en/c/c3/Pathaan_film_poster.jpg",
    backdrop_path: "https://upload.wikimedia.org/wikipedia/en/c/c3/Pathaan_film_poster.jpg",
    vote_average: 7.4,
    media_type: "movie",
    audioLanguages: ["MULTI", "HIN"],
  },
  {
    id: 1072790,
    title: "Dunki",
    poster_path: "https://upload.wikimedia.org/wikipedia/en/f/f3/Dunki_poster.jpg",
    backdrop_path: "https://upload.wikimedia.org/wikipedia/en/f/f3/Dunki_poster.jpg",
    vote_average: 7.1,
    media_type: "movie",
    audioLanguages: ["MULTI", "HIN"],
  },
  {
    id: 111111,
    title: "12th Fail",
    poster_path: "https://upload.wikimedia.org/wikipedia/en/f/f2/12th_Fail_poster.jpeg",
    backdrop_path: "https://upload.wikimedia.org/wikipedia/en/f/f2/12th_Fail_poster.jpeg",
    vote_average: 8.6,
    media_type: "movie",
    audioLanguages: ["MULTI", "HIN"],
  },
  {
    id: 579974,
    title: "RRR",
    poster_path: "https://upload.wikimedia.org/wikipedia/en/d/d7/RRR_Poster.jpg",
    backdrop_path: "https://upload.wikimedia.org/wikipedia/en/d/d7/RRR_Poster.jpg",
    vote_average: 8.6,
    media_type: "movie",
    audioLanguages: ["MULTI", "TEL", "HIN"],
  },
  {
    id: 222222,
    title: "Kalki 2898 AD",
    poster_path: "https://upload.wikimedia.org/wikipedia/en/4/4c/Kalki_2898_AD.jpg",
    backdrop_path: "https://upload.wikimedia.org/wikipedia/en/4/4c/Kalki_2898_AD.jpg",
    vote_average: 8.0,
    media_type: "movie",
    audioLanguages: ["MULTI", "TEL", "HIN"],
  },
  {
    id: 333333,
    title: "Salaar: Part 1 - Ceasefire",
    poster_path: "https://upload.wikimedia.org/wikipedia/en/a/a6/Salaar_Part_1_%E2%80%93_Ceasefire.jpg",
    backdrop_path: "https://upload.wikimedia.org/wikipedia/en/a/a6/Salaar_Part_1_%E2%80%93_Ceasefire.jpg",
    vote_average: 7.7,
    media_type: "movie",
    audioLanguages: ["MULTI", "TEL", "HIN"],
  },
  {
    id: 792307,
    title: "Leo",
    poster_path: "https://upload.wikimedia.org/wikipedia/en/7/77/Leo_%282023_Indian_film%29.jpg",
    backdrop_path: "https://upload.wikimedia.org/wikipedia/en/7/77/Leo_%282023_Indian_film%29.jpg",
    vote_average: 7.5,
    media_type: "movie",
    audioLanguages: ["MULTI", "TAM", "HIN"],
  },
  {
    id: 556574,
    title: "KGF: Chapter 2",
    poster_path: "https://upload.wikimedia.org/wikipedia/en/d/d0/K.G.F_Chapter_2.jpg",
    backdrop_path: "https://upload.wikimedia.org/wikipedia/en/d/d0/K.G.F_Chapter_2.jpg",
    vote_average: 8.4,
    media_type: "movie",
    audioLanguages: ["MULTI", "KAN", "HIN"],
  },
  {
    id: 533535,
    title: "Deadpool & Wolverine",
    poster_path: "https://upload.wikimedia.org/wikipedia/en/4/4d/Deadpool_%26_Wolverine_poster.jpg",
    backdrop_path: "https://upload.wikimedia.org/wikipedia/en/4/4d/Deadpool_%26_Wolverine_poster.jpg",
    vote_average: 8.0,
    media_type: "movie",
    audioLanguages: ["MULTI", "ENG", "HIN"],
  },
  {
    id: 693134,
    title: "Dune: Part Two",
    poster_path: "https://upload.wikimedia.org/wikipedia/en/5/52/Dune_Part_Two_poster.jpeg",
    backdrop_path: "https://upload.wikimedia.org/wikipedia/en/5/52/Dune_Part_Two_poster.jpeg",
    vote_average: 8.3,
    media_type: "movie",
    audioLanguages: ["MULTI", "ENG", "HIN"],
  },
];

const REAL_SERIES: MediaItem[] = [
  {
    id: 119051,
    title: "Wednesday",
    name: "Wednesday",
    poster_path: "https://upload.wikimedia.org/wikipedia/en/8/87/Wednesday_Addams_2022.jpg",
    backdrop_path: "https://upload.wikimedia.org/wikipedia/en/8/87/Wednesday_Addams_2022.jpg",
    vote_average: 8.5,
    media_type: "tv",
    audioLanguages: ["MULTI", "HIN", "ENG"],
  },
  {
    id: 76479,
    title: "The Boys",
    name: "The Boys",
    poster_path: "https://upload.wikimedia.org/wikipedia/en/2/29/The_Boys_Season_4_poster.jpg",
    backdrop_path: "https://upload.wikimedia.org/wikipedia/en/2/29/The_Boys_Season_4_poster.jpg",
    vote_average: 8.4,
    media_type: "tv",
    audioLanguages: ["MULTI", "HIN", "ENG"],
  },
  {
    id: 100088,
    title: "The Last of Us",
    name: "The Last of Us",
    poster_path: "https://upload.wikimedia.org/wikipedia/en/4/46/The_Last_of_Us_season_1_poster.png",
    backdrop_path: "https://upload.wikimedia.org/wikipedia/en/4/46/The_Last_of_Us_season_1_poster.png",
    vote_average: 8.6,
    media_type: "tv",
    audioLanguages: ["MULTI", "HIN", "ENG"],
  },
  {
    id: 66732,
    title: "Stranger Things",
    name: "Stranger Things",
    poster_path: "https://upload.wikimedia.org/wikipedia/en/7/78/Stranger_Things_season_4.jpg",
    backdrop_path: "https://upload.wikimedia.org/wikipedia/en/7/78/Stranger_Things_season_4.jpg",
    vote_average: 8.6,
    media_type: "tv",
    audioLanguages: ["MULTI", "HIN", "ENG"],
  },
  {
    id: 93405,
    title: "Squid Game",
    name: "Squid Game",
    poster_path: "https://upload.wikimedia.org/wikipedia/en/d/dd/Squid_Game_season_1_poster.jpg",
    backdrop_path: "https://upload.wikimedia.org/wikipedia/en/d/dd/Squid_Game_season_1_poster.jpg",
    vote_average: 7.8,
    media_type: "tv",
    audioLanguages: ["MULTI", "HIN", "KOR"],
  },
  {
    id: 60574,
    title: "Peaky Blinders",
    name: "Peaky Blinders",
    poster_path: "https://upload.wikimedia.org/wikipedia/en/3/36/Peaky_Blinders_series_5.jpg",
    backdrop_path: "https://upload.wikimedia.org/wikipedia/en/3/36/Peaky_Blinders_series_5.jpg",
    vote_average: 8.6,
    media_type: "tv",
    audioLanguages: ["MULTI", "HIN", "ENG"],
  },
];

const REAL_ANIME: MediaItem[] = [
  {
    id: 38000,
    title: "Demon Slayer",
    poster_path: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
    backdrop_path: "https://cdn.myanimelist.net/images/anime/1286/99889l.jpg",
    vote_average: 8.5,
    media_type: "tv",
    audioLanguages: ["HIN", "JAP"],
  },
  {
    id: 40748,
    title: "Jujutsu Kaisen",
    poster_path: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
    backdrop_path: "https://cdn.myanimelist.net/images/anime/1171/109222l.jpg",
    vote_average: 8.6,
    media_type: "tv",
    audioLanguages: ["HIN", "JAP"],
  },
  {
    id: 52299,
    title: "Solo Leveling",
    poster_path: "https://cdn.myanimelist.net/images/anime/1096/142999.jpg",
    backdrop_path: "https://cdn.myanimelist.net/images/anime/1096/142999l.jpg",
    vote_average: 8.4,
    media_type: "tv",
    audioLanguages: ["HIN", "JAP"],
  },
  {
    id: 20,
    title: "Naruto",
    poster_path: "https://cdn.myanimelist.net/images/anime/13/17405.jpg",
    backdrop_path: "https://cdn.myanimelist.net/images/anime/13/17405l.jpg",
    vote_average: 8.0,
    media_type: "tv",
    audioLanguages: ["HIN", "JAP"],
  },
  {
    id: 21,
    title: "One Piece",
    poster_path: "https://cdn.myanimelist.net/images/anime/6/73245.jpg",
    backdrop_path: "https://cdn.myanimelist.net/images/anime/6/73245l.jpg",
    vote_average: 8.7,
    media_type: "tv",
    audioLanguages: ["HIN", "JAP"],
  },
];

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
  homeHero: REAL_MOVIES.slice(0, 5),
  trendingMovies: REAL_MOVIES,
  trendingSeries: REAL_SERIES,
  trendingAnime: REAL_ANIME,
  moviesHero: REAL_MOVIES.slice(8).concat(REAL_MOVIES.slice(0, 2)),
  bollywood: REAL_MOVIES.slice(0, 5),
  south: REAL_MOVIES.slice(5, 10),
  hollywood: REAL_MOVIES.slice(10),
  regional: REAL_MOVIES.slice(0, 9),
  franchises: REAL_MOVIES.slice(10),
  indianStars: [
    {
      id: "srk",
      name: "Shah Rukh Khan",
      role: "King Khan",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Shah_Rukh_Khan_graces_the_launch_of_the_new_Santro.jpg",
      gradient: "bg-gradient-to-tr from-amber-500 to-red-600",
    },
    {
      id: "prabhas",
      name: "Prabhas",
      role: "Rebel Star",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/23/Prabhas_at_Saaho_Interview.png",
      gradient: "bg-gradient-to-tr from-red-600 to-orange-500",
    },
    {
      id: "deepika",
      name: "Deepika Padukone",
      role: "Leading Actress",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Deepika_Padukone_Cannes_2018_%28cropped%29.jpg",
      gradient: "bg-gradient-to-tr from-pink-500 to-purple-600",
    },
    {
      id: "jr_ntr",
      name: "Jr. NTR",
      role: "Man of Masses",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Jr_NTR_at_RRR_Promotions.jpg",
      gradient: "bg-gradient-to-tr from-emerald-500 to-teal-500",
    },
  ],
  hollywoodStars: [
    {
      id: "cruise",
      name: "Tom Cruise",
      role: "Action Icon",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/33/Tom_Cruise_by_Gage_Skidmore_2.jpg",
      gradient: "bg-gradient-to-tr from-cyan-500 to-blue-600",
    },
  ],
  seriesHero: REAL_SERIES.slice(0, 4),
  kdrama: REAL_SERIES.filter((s) => s.id === 93405 || s.id === 119051),
  indianWeb: REAL_SERIES.slice(0, 3),
  crimeThrillers: REAL_SERIES.slice(1, 5),
  romanceSeries: REAL_SERIES,
  historicalEpics: REAL_SERIES,
  realityTv: REAL_SERIES,
  pakistaniDramas: REAL_SERIES,
  westernSeries: REAL_SERIES,
  asianDramas: REAL_SERIES,
  scifiFantasy: REAL_SERIES,
  animeHero: REAL_ANIME,
  hindiDubAnime: REAL_ANIME,
  topShonen: REAL_ANIME,
  liveChannels: CURATED_CHANNELS,
};

export const catalogManager = {
  get: (): CustomCatalogState => DEFAULT_CATALOG,
  save: () => {},
  updateSettings: () => {},
  updateSectionItem: () => {},
  addSectionItem: () => {},
  deleteSectionItem: () => {},
  reset: () => {},
};
