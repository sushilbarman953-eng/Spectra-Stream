import React from "react";
import { tmdb } from "@/lib/tmdb";
import { MediaRow } from "@/components/MediaRow";

export default async function AnimePage() {
  const anime = await tmdb.getAnime().catch(() => []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-4">
      <h1 className="text-2xl font-bold tracking-tight text-white">Anime Lounge</h1>
      <MediaRow title="Top Airing & Popular Anime" items={anime} type="tv" />
    </div>
  );
}
