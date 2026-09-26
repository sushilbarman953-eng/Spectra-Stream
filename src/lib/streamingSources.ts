export interface StreamSource {
  id: string;
  name: string;
  region: "IN-West (Mumbai)" | "IN-North (Delhi)" | "Asia-South (Bangalore)" | "Global (Core)";
  latency: string;
  supportedAudio: string[];
  buildUrl: (params: {
    tmdbId: string | number;
    type: "movie" | "tv";
    season?: number;
    episode?: number;
    lang?: string;
  }) => string;
}

export const STREAM_SERVERS: StreamSource[] = [
  {
    id: "in-mumbai-speed",
    name: "Server 1 (Mumbai Ultra)",
    region: "IN-West (Mumbai)",
    latency: "14ms",
    supportedAudio: ["hi", "ta", "te", "ml", "kn", "bn", "en", "ja"],
    buildUrl: ({ tmdbId, type, season = 1, episode = 1, lang = "hi" }) => {
      const audioFlag = lang ? `&lang=${lang}&audio=${lang}` : "";
      if (type === "movie") {
        return `https://vidsrc.to/embed/movie/${tmdbId}?autoPlay=1${audioFlag}`;
      }
      return `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}?autoPlay=1${audioFlag}`;
    },
  },
  {
    id: "in-delhi-fastroute",
    name: "Server 2 (Delhi FastRoute)",
    region: "IN-North (Delhi)",
    latency: "21ms",
    supportedAudio: ["hi", "ta", "te", "en", "ja"],
    buildUrl: ({ tmdbId, type, season = 1, episode = 1, lang = "hi" }) => {
      const audioParam = lang === "ja" ? "japanese" : lang;
      if (type === "movie") {
        return `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&lang=${audioParam}`;
      }
      return `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}&lang=${audioParam}`;
    },
  },
  {
    id: "in-bangalore-cloud",
    name: "Server 3 (South Asia Bangalore)",
    region: "Asia-South (Bangalore)",
    latency: "28ms",
    supportedAudio: ["hi", "ta", "te", "ml", "kn", "en"],
    buildUrl: ({ tmdbId, type, season = 1, episode = 1 }) => {
      if (type === "movie") {
        return `https://autoembed.to/movie/tmdb/${tmdbId}`;
      }
      return `https://autoembed.to/tv/tmdb/${tmdbId}-${season}-${episode}`;
    },
  },
  {
    id: "global-core",
    name: "Server 4 (Global Core)",
    region: "Global (Core)",
    latency: "82ms",
    supportedAudio: ["en", "ja"],
    buildUrl: ({ tmdbId, type, season = 1, episode = 1 }) => {
      if (type === "movie") {
        return `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`;
      }
      return `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`;
    },
  },
];
