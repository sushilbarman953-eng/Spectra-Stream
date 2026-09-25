export interface LiveChannel {
  id: string;
  name: string;
  logo: string;
  category: string;
  streamUrl: string;
  country?: string;
}

// Curated active, legal, high-uptime public HLS channels
export const CURATED_CHANNELS: LiveChannel[] = [
  {
    id: "redbull-tv",
    name: "Red Bull TV",
    logo: "https://images.redbull.com/image/upload/c_fill,w_360/q_auto,f_auto/v1580226875/brand-center/brand-assets/redbull-logo.png",
    category: "Sports",
    streamUrl: "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8",
    country: "INT",
  },
  {
    id: "nasa-tv",
    name: "NASA HD",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg",
    category: "Science",
    streamUrl: "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8",
    country: "USA",
  },
  {
    id: "al-jazeera-en",
    name: "Al Jazeera English",
    logo: "https://www.aljazeera.com/images/logo.png",
    category: "News",
    streamUrl: "https://live-hls-web-aje.getaj.net/AJE/03.m3u8",
    country: "INT",
  },
  {
    id: "euronews-en",
    name: "Euronews",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/02/Euronews_2016_logo.svg",
    category: "News",
    streamUrl: "https://euronews-euronews-world-1-au.samsung.wurl.tv/manifest/playlist.m3u8",
    country: "EU",
  },
  {
    id: "bloomberg-quicktake",
    name: "Bloomberg Quicktake",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Bloomberg_Quicktake_logo.svg",
    category: "News",
    streamUrl: "https://bloomberg-quicktake-1-us.samsung.wurl.tv/manifest/playlist.m3u8",
    country: "USA",
  },
  {
    id: "anime-stream-demo",
    name: "Retro Toons & Anime",
    logo: "https://cdn-icons-png.flxml.com/512/3135/3135715.png",
    category: "Anime",
    streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    country: "INT",
  },
];
