import React from "react";
import { tmdb } from "@/lib/tmdb";
import { MediaRow } from "@/components/MediaRow";

export default async function SeriesPage() {
  const [popular, trending] = await Promise.all([
    tmdb.getPopularTV().catch(() => []),
    tmdb.getTrending("tv").catch(() => []),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-4">
      <h1 className="text-2xl font-bold tracking-tight text-white">TV Shows & Series</h1>
      <MediaRow title="Trending Shows" items={trending} type="tv" />
      <MediaRow title="Popular TV Series" items={popular} type="tv" />
    </div>
  );
}
