export interface LiveChannel {
  id: string;
  name: string;
  category: string;
  streamUrl: string;
}

export const CURATED_CHANNELS: LiveChannel[] = [
  {
    id: "bloomberg",
    name: "Bloomberg TV",
    category: "News",
    streamUrl: "https://bloomberg-quicktake-1-us.samsung.wurl.tv/manifest/playlist.m3u8",
  },
  {
    id: "euronews",
    name: "Euronews World",
    category: "News",
    streamUrl: "https://euronews-euronews-world-1-au.samsung.wurl.tv/manifest/playlist.m3u8",
  },
  {
    id: "mux-demo",
    name: "Cinema Stream 24/7",
    category: "Movies",
    streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  },
  {
    id: "tears-of-steel",
    name: "Sci-Fi HD",
    category: "Sci-Fi",
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  },
  {
    id: "big-buck-bunny",
    name: "Animation Hub",
    category: "Anime",
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
];
