import { NextResponse } from "next/server";
import { HINDI_DUBBED_ANIME_CATALOG } from "@/lib/animeService";
import { CURATED_CHANNELS } from "@/lib/iptv";
import { BACKUP_HINDI_MOVIES, BACKUP_HINDI_SERIES } from "@/lib/tmdb";

const TMDB_KEYS = [
  "8414545163a233633636f455ddfebe1e",
  "41b2c4bf2a64c483a31c518b53297a7a",
  "15d2ea6d0dc1d476efbca3eba2b9bbfb",
  process.env.NEXT_PUBLIC_TMDB_API_KEY,
].filter(Boolean) as string[];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get("q");

  if (!rawQuery || !rawQuery.trim()) {
    return NextResponse.json({ results: [] });
  }

  const query = rawQuery.trim().toLowerCase();
  const matchedResults: any[] = [];

  // 1. Live TV Channels check
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

  // 2. Anime Catalog check
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

  // 3. Online TMDB Search across all available API keys
  let tmdbFetched = false;
  for (const apiKey of TMDB_KEYS) {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(
          query
        )}&include_adult=false`,
        { next: { revalidate: 60 } }
      );
      if (res.ok) {
        const data = await res.json();
        const results = (data.results || [])
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

        if (results.length > 0) {
          matchedResults.push(...results);
          tmdbFetched = true;
          break;
        }
      }
    } catch {
      // Key failed or rate-limited, continue to next key
    }
  }

  // 4. Fallback search on local mock cache if network search yielded zero results
  if (!tmdbFetched || matchedResults.length === 0) {
    const localPool = [...BACKUP_HINDI_MOVIES, ...BACKUP_HINDI_SERIES];
    const localMatches = localPool.filter((m) =>
      (m.title || m.name || "").toLowerCase().includes(query)
    );
    matchedResults.push(...localMatches);
  }

  // De-duplicate items
  const seen = new Set<string>();
  const unique = matchedResults.filter((item) => {
    const key = `${item.media_type}-${item.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return NextResponse.json({ results: unique.slice(0, 8) });
}
