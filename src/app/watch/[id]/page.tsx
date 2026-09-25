"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, Film, Loader2 } from "lucide-react";
import { tmdb, MediaItem, IMAGE_BASE } from "@/lib/tmdb";
import { jikan, AnimeEpisode } from "@/lib/jikan";
import { AnimePlayer } from "@/components/AnimePlayer";
import { AnimeEpisodeGrid } from "@/components/AnimeEpisodeGrid";
import { Player } from "@/components/Player";
import { GlassButton } from "@/components/ui/GlassButton";

export default function WatchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params?.id as string;
  const type = (searchParams.get("type") as "movie" | "tv") || "movie";
  const initialEpisode = parseInt(searchParams.get("episode") || "1", 10);

  const [details, setDetails] = useState<any>(null);
  const [currentEpisode, setCurrentEpisode] = useState(initialEpisode);
  const [animeEpisodes, setAnimeEpisodes] = useState<AnimeEpisode[]>([]);
  const [loading, setLoading] = useState(true);

  const title = details?.title || details?.name || "Loading Title...";
  const isAnime =
    details?.genres?.some((g: any) => g.id === 16) ||
    details?.original_language === "ja";

  useEffect(() => {
    let isMounted = true;
    const loadMediaData = async () => {
      setLoading(true);
      try {
        const data = await tmdb.getDetails(type, id);
        if (isMounted) setDetails(data);

        // Fetch MAL / Jikan episodic metadata for anime
        const animeCheck =
          data?.genres?.some((g: any) => g.id === 16) ||
          data?.original_language === "ja";

        if (animeCheck && type === "tv") {
          const malSearch = await jikan.searchAnime(data.name || data.title);
          if (malSearch?.mal_id) {
            const episodes = await jikan.getEpisodes(malSearch.mal_id);
            if (isMounted) setAnimeEpisodes(episodes);
          }
        }
      } catch (err) {
        console.error("Watch load error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) loadMediaData();
    return () => {
      isMounted = false;
    };
  }, [id, type]);

  const handleSelectEpisode = (ep: number) => {
    setCurrentEpisode(ep);
    router.replace(`/watch/${id}?type=${type}&episode=${ep}`);
  };

  const handleNextEpisode = () => {
    const nextEp = currentEpisode + 1;
    handleSelectEpisode(nextEp);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-2 text-zinc-400 text-xs">
        <Loader2 className="w-5 h-5 animate-spin text-white" />
        <span>Loading stream engine...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 pb-24 space-y-6">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link href={`/details/${id}?type=${type}`}>
          <GlassButton variant="secondary" className="text-xs py-1.5 px-3">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Details</span>
          </GlassButton>
        </Link>

        <h2 className="text-sm font-semibold text-zinc-300 truncate max-w-[200px] sm:max-w-md">
          {title}
        </h2>
      </div>

      {/* Primary Video Player Area */}
      {isAnime && type === "tv" ? (
        <AnimePlayer
          tmdbId={id}
          animeTitle={title}
          episode={currentEpisode}
          totalEpisodes={animeEpisodes.length || undefined}
          onNextEpisode={handleNextEpisode}
        />
      ) : (
        <Player
          id={id}
          type={type}
          season={1}
          episode={currentEpisode}
          poster={
            details?.backdrop_path
              ? `${IMAGE_BASE}/w1280${details.backdrop_path}`
              : undefined
          }
        />
      )}

      {/* Anime Episodic Browser Grid */}
      {isAnime && animeEpisodes.length > 0 && (
        <AnimeEpisodeGrid
          episodes={animeEpisodes}
          currentEpisode={currentEpisode}
          onSelectEpisode={handleSelectEpisode}
        />
      )}
    </div>
  );
}
