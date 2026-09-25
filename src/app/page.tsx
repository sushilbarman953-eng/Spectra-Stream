import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Info } from "lucide-react";
import { tmdb, IMAGE_BASE } from "@/lib/tmdb";
import { MediaRow } from "@/components/MediaRow";
import { GlassButton } from "@/components/ui/GlassButton";

export default async function HomePage() {
  const [trending, movies, tvSeries, anime] = await Promise.all([
    tmdb.getTrending("all").catch(() => []),
    tmdb.getPopularMovies().catch(() => []),
    tmdb.getPopularTV().catch(() => []),
    tmdb.getAnime().catch(() => []),
  ]);

  const featured = trending[0] || movies[0];
  const featuredTitle = featured?.title || featured?.name || "Featured Media";
  const featuredBackdrop = featured?.backdrop_path
    ? `${IMAGE_BASE}/original${featured.backdrop_path}`
    : null;

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Spotlight */}
      {featured && (
        <section className="relative w-full h-[60vh] md:h-[75vh] flex items-end p-6 md:p-12 mb-4 overflow-hidden">
          {featuredBackdrop && (
            <div className="absolute inset-0 -z-10">
              <Image
                src={featuredBackdrop}
                alt={featuredTitle}
                fill
                priority
                className="object-cover object-center opacity-40 brightness-75 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent" />
            </div>
          )}

          <div className="max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-white/10 border border-white/20 backdrop-blur-md text-white">
              Trending Spotlight
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
              {featuredTitle}
            </h1>
            <p className="text-xs md:text-sm text-zinc-300 line-clamp-3 leading-relaxed">
              {featured.overview}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Link href={`/watch/${featured.id}?type=${featured.media_type || "movie"}`}>
                <GlassButton variant="primary">
                  <Play className="w-4 h-4 fill-black" />
                  Watch Now
                </GlassButton>
              </Link>
              <Link href={`/details/${featured.id}?type=${featured.media_type || "movie"}`}>
                <GlassButton variant="secondary">
                  <Info className="w-4 h-4" />
                  Details
                </GlassButton>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Glass Media Rails */}
      <MediaRow id="trending" title="Trending Now" items={trending} />
      <MediaRow id="movies" title="Popular Movies" items={movies} type="movie" />
      <MediaRow id="series" title="TV Series" items={tvSeries} type="tv" />
      <MediaRow id="anime" title="Anime Hub" items={anime} type="tv" />
    </div>
  );
}
