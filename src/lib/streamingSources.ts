export interface StreamSource {
  id: string;
  name: string;
  region: "IN-West (Mumbai)" | "IN-North (Delhi)" | "Asia-South" | "Global";
  latency: string;
  hasHindi: boolean;
  buildUrl: (params: {
    tmdbId: string | number;
    type: "movie" | "tv";
    season?: number;
    episode?: number;
    audio?: "hindi" | "original";
  }) => string;
}

export const STREAM_SERVERS: StreamSource[] = [
  {
    id: "in-mumbai-speed",
    name: "Server 1 (Mumbai Ultra)",
    region: "IN-West (Mumbai)",
    latency: "18ms",
    hasHindi: true,
    buildUrl: ({ tmdbId, type, season = 1, episode = 1, audio = "hindi" }) => {
      const langParam = audio === "hindi" ? "&ds_lang=hi" : "";
      if (type === "movie") {
        return `https://vidsrc.to/embed/movie/${tmdbId}?autoPlay=1${langParam}`;
      }
      return `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}?autoPlay=1${langParam}`;
    },
  },
  {
    id: "in-delhi-cloud",
    name: "Server 2 (Delhi FastRoute)",
    region: "IN-North (Delhi)",
    latency: "24ms",
    hasHindi: true,
    buildUrl: ({ tmdbId, type, season = 1, episode = 1, audio = "hindi" }) => {
      const subDub = audio === "hindi" ? "dub" : "sub";
      if (type === "movie") {
        return `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&lang=hindi`;
      }
      return `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}&lang=hindi`;
    },
  },
  {
    id: "asia-superembed",
    name: "Server 3 (SuperEmbed Asia)",
    region: "Asia-South",
    latency: "42ms",
    hasHindi: true,
    buildUrl: ({ tmdbId, type, season = 1, episode = 1 }) => {
      if (type === "movie") {
        return `https://autoembed.to/movie/tmdb/${tmdbId}`;
      }
      return `https://autoembed.to/tv/tmdb/${tmdbId}-${season}-${episode}`;
    },
  },
  {
    id: "global-fallback",
    name: "Server 4 (Global Core Mirror)",
    region: "Global",
    latency: "98ms",
    hasHindi: false,
    buildUrl: ({ tmdbId, type, season = 1, episode = 1 }) => {
      if (type === "movie") {
        return `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`;
      }
      return `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`;
    },
  },
];
