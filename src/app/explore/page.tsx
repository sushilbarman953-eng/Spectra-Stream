import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { tmdb, MOVIE_GENRES, TV_GENRES } from "@/lib/tmdb";
import { MediaCatalog } from "@/components/MediaCatalog";
import { GlassButton } from "@/components/ui/GlassButton";

interface ExplorePageProps {
  searchParams: Promise<{
    type?: "movie" | "tv";
    genre?: string;
    sort?: string;
  }>;
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const resolved = await searchParams;
  const type = resolved.type || "movie";
  const genreId = resolved.genre ? parseInt(resolved.genre, 10) : undefined;
  const sort = resolved.sort || "popularity.desc";

  const initialItems = await tmdb.discoverMedia(type, genreId, sort, 1).catch(() => []);
  const genres = type === "movie" ? MOVIE_GENRES : TV_GENRES;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 pb-24 space-y-4">
      <Link href={type === "movie" ? "/movies" : "/series"}>
        <GlassButton variant="secondary" className="text-xs py-1.5 px-3">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to {type === "movie" ? "Movies" : "Series"}
        </GlassButton>
      </Link>

      <MediaCatalog
        type={type}
        title={type === "movie" ? "Full Movie Catalog" : "Full Series Catalog"}
        genres={genres}
        initialItems={initialItems}
      />
    </div>
  );
}
