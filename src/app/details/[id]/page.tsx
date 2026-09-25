import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Star, Calendar, Clock } from "lucide-react";
import { tmdb, IMAGE_BASE } from "@/lib/tmdb";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { BookmarkButton } from "@/components/BookmarkButton";

interface DetailsPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: "movie" | "tv" }>;
}

export default async function DetailsPage({ params, searchParams }: DetailsPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const type = resolvedSearchParams.type || "movie";
  const id = resolvedParams.id;

  const details = await tmdb.getDetails(type, id);

  if (!details || details.success === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-xl font-bold text-white">Media Not Found</h2>
        <Link href="/">
          <GlassButton variant="secondary">Back to Browse</GlassButton>
        </Link>
      </div>
    );
  }

  const title = details.title || details.name || "Untitled";
  const backdrop = details.backdrop_path ? `${IMAGE_BASE}/original${details.backdrop_path}` : null;
  const poster = details.poster_path ? `${IMAGE_BASE}/w500${details.poster_path}` : null;
  const releaseYear = (details.release_date || details.first_air_date || "").slice(0, 4);

  return (
    <div className="relative min-h-screen px-4 md:px-12 pt-4 pb-20">
      {backdrop && (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-25">
          <Image
            src={backdrop}
            alt={title}
            fill
            className="object-cover object-center blur-3xl scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/80 to-transparent" />
        </div>
      )}

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-start pt-6">
        <div className="w-48 sm:w-60 md:w-72 flex-none mx-auto md:mx-0">
          <GlassCard className="p-1.5 overflow-hidden rounded-2xl border-white/20 shadow-2xl">
            <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-zinc-900">
              {poster ? (
                <Image src={poster} alt={title} fill priority className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-zinc-600">No Image</div>
              )}
            </div>
          </GlassCard>
        </div>

        <div className="flex-1 space-y-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest bg-white/10 border border-white/20 text-white">
                {type === "movie" ? "Movie" : "Series"}
              </span>
              {details.genres?.map((g: any) => (
                <span
                  key={g.id}
                  className="px-2.5 py-0.5 rounded-full text-[10px] text-zinc-400 border border-white/5 bg-white/[0.02]"
                >
                  {g.name}
                </span>
              ))}
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-4 text-xs text-zinc-300">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-white text-white" />
              <span className="font-semibold text-white">{details.vote_average?.toFixed(1)}</span>
            </div>
            {releaseYear && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>{releaseYear}</span>
              </div>
            )}
            {details.runtime && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>{details.runtime}m</span>
              </div>
            )}
          </div>

          <p className="text-zinc-300 text-sm leading-relaxed max-w-2xl">{details.overview}</p>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href={`/watch/${id}?type=${type}&s=1&e=1`}>
              <GlassButton variant="primary">
                <Play className="w-4 h-4 fill-black" />
                {type === "movie" ? "Play Movie" : "Start Watching S1 E1"}
              </GlassButton>
            </Link>

            <BookmarkButton
              item={{
                id,
                type,
                title,
                poster: poster || "",
              }}
            />
          </div>

          {type === "tv" && details.seasons && (
            <div className="pt-6 border-t border-white/10">
              <h2 className="text-sm font-semibold tracking-wider uppercase text-zinc-400 mb-3">
                Seasons
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {details.seasons
                  .filter((s: any) => s.season_number > 0)
                  .map((s: any) => (
                    <Link
                      key={s.id}
                      href={`/watch/${id}?type=tv&s=${s.season_number}&e=1`}
                    >
                      <GlassCard
                        hoverEffect
                        className="p-3 text-center border-white/10 hover:border-white/30"
                      >
                        <p className="text-xs font-semibold text-white">{s.name}</p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{s.episode_count} Episodes</p>
                      </GlassCard>
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
