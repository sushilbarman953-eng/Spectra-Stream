import { NextResponse } from "next/server";
import { tmdb } from "@/lib/tmdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = (searchParams.get("type") as "movie" | "tv") || "movie";
  const genre = searchParams.get("genre");
  const sortBy = searchParams.get("sort_by") || "popularity.desc";

  try {
    const genreId = genre ? parseInt(genre) : undefined;
    const results = await tmdb.discoverMedia(type, genreId, sortBy);
    return NextResponse.json({ results });
  } catch (error) {
    console.error("Discover API error:", error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
