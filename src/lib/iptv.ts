export interface LiveChannel {
  id: string;
  name: string;
  category: string;
  streamUrl: string;
}

export const CURATED_CHANNELS: LiveChannel[] = [
  {
    id: "aajtak",
    name: "Aaj Tak HD",
    category: "News",
    streamUrl: "https://feeds.intoday.in/aajtak/api/aajtakhd/master.m3u8",
  },
  {
    id: "9xm",
    name: "9XM Music",
    category: "Music",
    streamUrl: "https://9xjio.wiseplayout.com/9XM/master.m3u8",
  },
  {
    id: "al-jazeera",
    name: "Al Jazeera English",
    category: "News",
    streamUrl: "https://live-hls-web-aje.getaj.net/AJE/03.m3u8",
  },
  {
    id: "mux-demo",
    name: "Cinema 24/7 (Global)",
    category: "Movies",
    streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  },
  {
    id: "sci-fi-hub",
    name: "Sci-Fi Channel",
    category: "Movies",
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  },
  {
    id: "animation-tv",
    name: "Toon & Anime 24/7",
    category: "Anime",
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
];
