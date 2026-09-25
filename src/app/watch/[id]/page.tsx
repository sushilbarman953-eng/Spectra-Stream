import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Player } from "@/components/Player";
import { tmdb } from "@/lib/tmdb";
import { GlassButton } from "@/components/ui/GlassButton";

interface WatchPageProps {
  params: { id: string };
  searchParams: {
    type?: "movie" | "tv";
    s?: string;
    e?: string;
    url?: string;
  };
}

export default async function WatchPage({ params, searchParams }: WatchPageProps) {
  const type = searchParams.type || "movie";
  const season = searchParams.s ? parseInt(searchParams.s) : 1;
  const episode = searchParams.e ? parseInt(searchParams.e) : 1;
  const m3u8Url = searchParams.url;

  let title = "Stream";
  try {
    const details = await tmdb.getDetails(type, params.id);
    title = details.title || details.name || "Stream";
  } catch (err) {
    console.error("Could not fetch title:", err);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <Link href={`/details/${params.id}?type=${type}`}>
          <GlassButton variant="secondary" className="text-xs">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Details
          </GlassButton>
        </Link>

        <h1 className="text-sm md:text-base font-semibold text-zinc-300 truncate max-w-md">
          {title} {type === "tv" && `• Season ${season} Episode ${episode}`}
        </h1>
      </div>

      {/* Primary Video Player Component */}
      <Player
        id={params.id}
        type={type}
        season={season}
        episode={episode}
        m3u8Url={m3u8Url}
      />
    </div>
  );
}
