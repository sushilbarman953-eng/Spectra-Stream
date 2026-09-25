import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || !query.trim()) {
    return NextResponse.json({ results: [] });
  }

  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_TMDB_BASE_URL || "https://api.themoviedb.org/3";

  if (!apiKey) {
    console.warn("TMDB API key is missing for search route.");
    return NextResponse.json({ results: [] });
  }

  try {
    const res = await fetch(
      `${baseUrl}/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&include_adult=false`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      return NextResponse.json({ results: [] });
    }

    const data = await res.json();
    const filtered = (data.results || []).filter(
      (item: any) =>
        (item.media_type === "movie" || item.media_type === "tv") &&
        (item.poster_path || item.backdrop_path)
    );

    return NextResponse.json({ results: filtered });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ results: [] });
  }
}
