import React from "react";
import { tmdb, MOVIE_GENRES } from "@/lib/tmdb";
import { MediaCatalog } from "@/components/MediaCatalog";

export default async function MoviesPage() {
  const initialMovies = await tmdb.discoverMedia("movie", undefined, "popularity.desc").catch(() => []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 pb-20">
      <MediaCatalog
        type="movie"
        title="Movies Catalog"
        genres={MOVIE_GENRES}
        initialItems={initialMovies}
      />
    </div>
  );
}
