import React from "react";
import { tmdb } from "@/lib/tmdb";
import { MediaRow } from "@/components/MediaRow";

export default async function MoviesPage() {
  const [popular, trending] = await Promise.all([
    tmdb.getPopularMovies().catch(() => []),
    tmdb.getTrending("movie").catch(() => []),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-4">
      <h1 className="text-2xl font-bold tracking-tight text-white">Movies</h1>
      <MediaRow title="Trending Movies" items={trending} type="movie" />
      <MediaRow title="Popular Movies" items={popular} type="movie" />
    </div>
  );
}
