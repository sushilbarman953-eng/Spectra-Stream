import { NextResponse } from "next/server";
import { HINDI_DUBBED_ANIME_CATALOG } from "@/lib/animeService";
import { CURATED_CHANNELS } from "@/lib/iptv";

const TMDB_KEYS = [
  process.env.NEXT_PUBLIC_TMDB_API_KEY,
  "8414545163a233633636f455ddfebe1e",
  "41b2c4bf2a64c483a31c518b53297a7a",
  "15d2ea6d0dc1d476efbca3eba2b9bbfb",
].filter(Boolean) as string[];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get("q");

  if (!rawQuery || !rawQuery.trim()) {
    return NextResponse.json({ results: [] });
  }

  const query = rawQuery.trim().toLowerCase();
  const matchedResults: any[] = [];

  // 1. Instant match Live TV Channels
  const matchedChannels = CURATED_CHANNELS.filter((ch) =>
    ch.name.toLowerCase().includes(query) || ch.category.toLowerCase().includes(query)
  ).map((ch) => ({
    id: ch.id,
    title: ch.name,
    media_type: "live_tv",
    category: ch.category,
    poster_path: null,
  }));
  matchedResults.push(...matchedChannels);

  // 2. Instant match Anime Catalog
  const matchedAnime = HINDI_DUBBED_ANIME_CATALOG.filter(
    (a) =>
      a.title.toLowerCase().includes(query) ||
      (a.title_english && a.title_english.toLowerCase().includes(query))
  ).map((a) => ({
    id: a.mal_id,
    title: a.title_english || a.title,
    media_type: "anime",
    poster_path: a.images.jpg.image_url,
    vote_average: a.score,
  }));
  matchedResults.push(...matchedAnime);

  // 3. Online TMDB Multi-Search for Movies & TV Series
  const apiKey = TMDB_KEYS[0];
  if (apiKey) {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(
          query
        )}&include_adult=false`,
        { next: { revalidate: 60 } }
      );
      if (res.ok) {
        const data = await res.json();
        const filteredTmdb = (data.results || [])
          .filter(
            (item: any) =>
              (item.media_type === "movie" || item.media_type === "tv") &&
              (item.poster_path || item.backdrop_path)
          )
          .map((item: any) => ({
            id: item.id,
            title: item.title || item.name,
            media_type: item.media_type,
            poster_path: item.poster_path,
            release_date: item.release_date || item.first_air_date,
            vote_average: item.vote_average,
          }));
        matchedResults.push(...filteredTmdb);
      }
    } catch (e) {
      console.error("TMDB search error:", e);
    }
  }

  // De-duplicate results by title and limit to top 8 fast matches
  const seen = new Set<string>();
  const unique = matchedResults.filter((item) => {
    const key = `${item.media_type}-${item.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return NextResponse.json({ results: unique.slice(0, 8) });
}
