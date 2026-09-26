import React from "react";
import { tmdb } from "@/lib/tmdb";
import { HeroCarousel } from "@/components/HeroCarousel";
import { VerticalSectionRow } from "@/components/VerticalSectionRow";
import { ContinueWatchingRow } from "@/components/ContinueWatchingRow";

export default async function HomePage() {
  const [trendingAll, popularMovies, popularShows, trendingAnime] = await Promise.all([
    tmdb.getTrending("all").catch(() => []),
    tmdb.getPopularMovies().catch(() => []),
    tmdb.getPopularTV().catch(() => []),
    tmdb.getAnime().catch(() => []),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 pb-24 space-y-6">
      <HeroCarousel items={trendingAll} type="movie" />

      {/* Continue Watching Section */}
      <ContinueWatchingRow />

      <div className="space-y-6">
        <VerticalSectionRow
          title="Trending Today"
          items={trendingAll}
          type="movie"
          seeAllHref="/explore?type=movie&sort=popularity.desc"
        />

        <VerticalSectionRow
          title="Popular Blockbuster Movies"
          items={popularMovies}
          type="movie"
          seeAllHref="/movies"
        />

        <VerticalSectionRow
          title="Binge-Worthy Series"
          items={popularShows}
          type="tv"
          seeAllHref="/series"
        />

        <VerticalSectionRow
          title="Top Trending Anime"
          items={trendingAnime}
          type="tv"
          seeAllHref="/anime"
        />
      </div>
    </div>
  );
}
