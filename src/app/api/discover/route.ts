import { NextResponse } from "next/server";
import { tmdb } from "@/lib/tmdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = (searchParams.get("type") as "movie" | "tv") || "movie";
  const genre = searchParams.get("genre");
  const sortBy = searchParams.get("sort_by") || "popularity.desc";
  const page = parseInt(searchParams.get("page") || "1", 10);

  try {
    const genreId = genre ? parseInt(genre, 10) : undefined;
    const results = await tmdb.discoverMedia(type, genreId, sortBy, page);
    return NextResponse.json({ results, page });
  } catch (error) {
    console.error("Discover API error:", error);
    return NextResponse.json({ results: [], page: 1 }, { status: 500 });
  }
}
