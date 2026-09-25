import React from "react";
import { tmdb } from "@/lib/tmdb";
import { HeroCarousel } from "@/components/HeroCarousel";
import { VerticalSectionRow } from "@/components/VerticalSectionRow";

export default async function MoviesPage() {
  const [trending, popular, action, scifi, horror, comedy] = await Promise.all([
    tmdb.getTrending("movie").catch(() => []),
    tmdb.getPopularMovies().catch(() => []),
    tmdb.discoverMedia("movie", 28).catch(() => []),   // Action
    tmdb.discoverMedia("movie", 878).catch(() => []),  // Sci-Fi
    tmdb.discoverMedia("movie", 27).catch(() => []),   // Horror
    tmdb.discoverMedia("movie", 35).catch(() => []),   // Comedy
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 pb-24 space-y-8">
      {/* 1. Top 10 Featured Carousel */}
      <HeroCarousel items={trending} type="movie" />

      {/* 2. Vertically Stacked Content Rows (20 items each) */}
      <div className="space-y-6">
        <VerticalSectionRow
          title="Trending Movies"
          items={trending}
          type="movie"
          seeAllHref="/explore?type=movie&sort=popularity.desc"
        />

        <VerticalSectionRow
          title="Top Rated & Popular"
          items={popular}
          type="movie"
          seeAllHref="/explore?type=movie&sort=vote_average.desc"
        />

        <VerticalSectionRow
          title="Action Blockbusters"
          items={action}
          type="movie"
          seeAllHref="/explore?type=movie&genre=28"
        />

        <VerticalSectionRow
          title="Sci-Fi & Cyberpunk"
          items={scifi}
          type="movie"
          seeAllHref="/explore?type=movie&genre=878"
        />

        <VerticalSectionRow
          title="Horror & Thriller"
          items={horror}
          type="movie"
          seeAllHref="/explore?type=movie&genre=27"
        />

        <VerticalSectionRow
          title="Comedy & Fun"
          items={comedy}
          type="movie"
          seeAllHref="/explore?type=movie&genre=35"
        />
      </div>
    </div>
  );
}
