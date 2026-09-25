import React from "react";
import { tmdb, TV_GENRES } from "@/lib/tmdb";
import { MediaCatalog } from "@/components/MediaCatalog";

export default async function SeriesPage() {
  const initialSeries = await tmdb.discoverMedia("tv", undefined, "popularity.desc").catch(() => []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 pb-20">
      <MediaCatalog
        type="tv"
        title="Series & Shows Catalog"
        genres={TV_GENRES}
        initialItems={initialSeries}
      />
    </div>
  );
}
