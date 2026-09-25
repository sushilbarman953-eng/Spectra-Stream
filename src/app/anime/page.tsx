import React from "react";
import { tmdb } from "@/lib/tmdb";
import { HeroCarousel } from "@/components/HeroCarousel";
import { VerticalSectionRow } from "@/components/VerticalSectionRow";

export default async function AnimePage() {
  const [topAiring, popularAnime, actionAnime, fantasyAnime] = await Promise.all([
    tmdb.getAnime().catch(() => []),
    tmdb.discoverMedia("tv", 16, "vote_average.desc").catch(() => []),
    tmdb.discoverMedia("tv", 10759).catch(() => []), // Action & Adventure
    tmdb.discoverMedia("tv", 10765).catch(() => []), // Sci-Fi & Fantasy
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 pb-24 space-y-8">
      {/* 1. Top 10 Featured Anime Carousel */}
      <HeroCarousel items={topAiring} type="tv" />

      {/* 2. Vertically Stacked Content Rows */}
      <div className="space-y-6">
        <VerticalSectionRow
          title="Top Airing & Trending Anime"
          items={topAiring}
          type="tv"
          seeAllHref="/explore?type=tv&genre=16"
        />

        <VerticalSectionRow
          title="Highest Rated Masterpieces"
          items={popularAnime}
          type="tv"
          seeAllHref="/explore?type=tv&genre=16&sort=vote_average.desc"
        />

        <VerticalSectionRow
          title="Shonen & Action Adventures"
          items={actionAnime}
          type="tv"
          seeAllHref="/explore?type=tv&genre=10759"
        />

        <VerticalSectionRow
          title="Fantasy & Supernatural Worlds"
          items={fantasyAnime}
          type="tv"
          seeAllHref="/explore?type=tv&genre=10765"
        />
      </div>
    </div>
  );
}
