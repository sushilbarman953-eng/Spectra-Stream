import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Player } from "@/components/Player";
import { ProgressRecorder } from "@/components/ProgressRecorder";
import { tmdb, IMAGE_BASE } from "@/lib/tmdb";
import { GlassButton } from "@/components/ui/GlassButton";

interface WatchPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    type?: "movie" | "tv";
    s?: string;
    e?: string;
    url?: string;
  }>;
}

export default async function WatchPage({ params, searchParams }: WatchPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const id = resolvedParams.id;
  const type = resolvedSearchParams.type || "movie";
  const season = resolvedSearchParams.s ? parseInt(resolvedSearchParams.s) : 1;
  const episode = resolvedSearchParams.e ? parseInt(resolvedSearchParams.e) : 1;
  const m3u8Url = resolvedSearchParams.url;

  const details = await tmdb.getDetails(type, id);
  const title = details?.title || details?.name || "Stream";
  const poster = details?.backdrop_path
    ? `${IMAGE_BASE}/w780${details.backdrop_path}`
    : details?.poster_path
    ? `${IMAGE_BASE}/w342${details.poster_path}`
    : "";

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 space-y-4">
      <ProgressRecorder
        id={id}
        type={type}
        title={title}
        poster={poster}
        season={season}
        episode={episode}
      />

      <div className="flex items-center justify-between">
        <Link href={`/details/${id}?type=${type}`}>
          <GlassButton variant="secondary" className="text-xs">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Details
          </GlassButton>
        </Link>

        <h1 className="text-sm md:text-base font-semibold text-zinc-300 truncate max-w-md">
          {title} {type === "tv" && `• S${season} E${episode}`}
        </h1>
      </div>

      <Player
        id={id}
        type={type}
        season={season}
        episode={episode}
        m3u8Url={m3u8Url}
      />
    </div>
  );
}
