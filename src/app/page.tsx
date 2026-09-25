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
    <div className="flex flex-col gap-2 pb-8">
      {/* Hero Spotlight */}
      {featured && (
        <section className="relative w-full h-[52vh] md:h-[65vh] flex items-end p-5 md:p-10 mb-2 overflow-hidden">
          {featuredBackdrop && (
            <div className="absolute inset-0 -z-10">
              <Image
                src={featuredBackdrop}
                alt={featuredTitle}
                fill
                priority
                className="object-cover object-center opacity-40 brightness-75 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#08080a] via-transparent to-transparent" />
            </div>
          )}

          <div className="max-w-xl space-y-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-white/10 border border-white/20 backdrop-blur-md text-white">
              Trending Spotlight
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
              {featuredTitle}
            </h1>
            <p className="text-xs text-zinc-300 line-clamp-2 md:line-clamp-3 leading-relaxed">
              {featured.overview}
            </p>

            <div className="flex items-center gap-2.5 pt-1">
              <Link href={`/watch/${featured.id}?type=${featured.media_type || "movie"}`}>
                <GlassButton variant="primary">
                  <Play className="w-3.5 h-3.5 fill-black" />
                  Watch Now
                </GlassButton>
              </Link>
              <Link href={`/details/${featured.id}?type=${featured.media_type || "movie"}`}>
                <GlassButton variant="secondary">
                  <Info className="w-3.5 h-3.5" />
                  Details
                </GlassButton>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Tightly Nested Media Rows */}
      <MediaRow id="trending" title="Trending Now" items={trending} />
      <MediaRow id="movies" title="Popular Movies" items={movies} type="movie" />
      <MediaRow id="series" title="TV Series" items={tvSeries} type="tv" />
      <MediaRow id="anime" title="Anime Hub" items={anime} type="tv" />
    </div>
  );
}
