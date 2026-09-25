import React from "react";
import { tmdb } from "@/lib/tmdb";
import { HeroCarousel } from "@/components/HeroCarousel";
import { VerticalSectionRow } from "@/components/VerticalSectionRow";

export default async function SeriesPage() {
  const [trending, popular, drama, scifi, comedy, crime] = await Promise.all([
    tmdb.getTrending("tv").catch(() => []),
    tmdb.getPopularTV().catch(() => []),
    tmdb.discoverMedia("tv", 18).catch(() => []),     // Drama
    tmdb.discoverMedia("tv", 10765).catch(() => []),  // Sci-Fi & Fantasy
    tmdb.discoverMedia("tv", 35).catch(() => []),     // Comedy
    tmdb.discoverMedia("tv", 80).catch(() => []),     // Crime
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 pb-24 space-y-8">
      {/* 1. Top 10 Featured Carousel */}
      <HeroCarousel items={trending} type="tv" />

      {/* 2. Vertically Stacked Content Rows (20 items each) */}
      <div className="space-y-6">
        <VerticalSectionRow
          title="Trending TV Shows"
          items={trending}
          type="tv"
          seeAllHref="/explore?type=tv&sort=popularity.desc"
        />

        <VerticalSectionRow
          title="Popular Across Spectra"
          items={popular}
          type="tv"
          seeAllHref="/explore?type=tv&sort=vote_average.desc"
        />

        <VerticalSectionRow
          title="Gripping Drama Series"
          items={drama}
          type="tv"
          seeAllHref="/explore?type=tv&genre=18"
        />

        <VerticalSectionRow
          title="Sci-Fi & Fantasy Universes"
          items={scifi}
          type="tv"
          seeAllHref="/explore?type=tv&genre=10765"
        />

        <VerticalSectionRow
          title="Crime & Mystery Investigations"
          items={crime}
          type="tv"
          seeAllHref="/explore?type=tv&genre=80"
        />

        <VerticalSectionRow
          title="Binge-Worthy Comedies"
          items={comedy}
          type="tv"
          seeAllHref="/explore?type=tv&genre=35"
        />
      </div>
    </div>
  );
}
