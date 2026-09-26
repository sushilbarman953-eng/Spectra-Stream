"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Download, CheckCircle2 } from "lucide-react";
import { tmdb, EpisodeItem, IMAGE_BASE } from "@/lib/tmdb";
import { downloadManager } from "@/lib/downloadManager";
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
  const initialSeason = parseInt(searchParams.get("season") || "1", 10);

  const [details, setDetails] = useState<any>(null);
  const [currentSeason, setCurrentSeason] = useState(initialSeason);
  const [currentEpisode, setCurrentEpisode] = useState(initialEpisode);
  const [episodes, setEpisodes] = useState<EpisodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const title = details?.title || details?.name || "Loading Title...";
  const isSeriesOrAnime = type === "tv";
  const seasonsCount = details?.number_of_seasons || 1;

  // Check download state
  useEffect(() => {
    const downloadKey = `${id}-${type}-s${currentSeason}-e${currentEpisode}`;
    const all = downloadManager.getAll();
    setIsDownloaded(all.some((d) => d.id === downloadKey));
  }, [id, type, currentSeason, currentEpisode]);

  useEffect(() => {
    let isMounted = true;
    const loadDetails = async () => {
      setLoading(true);
      try {
        const data = await tmdb.getDetails(type, id);
        if (isMounted) setDetails(data);
      } catch (err) {
        console.error("Watch details error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) loadDetails();
    return () => {
      isMounted = false;
    };
  }, [id, type]);

  useEffect(() => {
    if (!isSeriesOrAnime || !id) return;

    let isMounted = true;
    const fetchEpisodes = async () => {
      try {
        const epList = await tmdb.getSeasonEpisodes(id, currentSeason);
        if (isMounted) {
          if (epList && epList.length > 0) {
            setEpisodes(epList);
          } else {
            const total = details?.number_of_episodes || 25;
            const fallbackList: EpisodeItem[] = Array.from({ length: total }).map((_, i) => ({
              id: i + 1,
              episode_number: i + 1,
              name: `Episode ${i + 1}`,
              overview: "Stream this episode on Spectra.",
            }));
            setEpisodes(fallbackList);
          }
        }
      } catch (e) {
        console.error("Episode fetch error:", e);
      }
    };

    fetchEpisodes();
    return () => {
      isMounted = false;
    };
  }, [id, isSeriesOrAnime, currentSeason, details]);

  const handleSelectEpisode = (ep: number) => {
    setCurrentEpisode(ep);
    router.replace(`/watch/${id}?type=${type}&season=${currentSeason}&episode=${ep}`);
  };

  const handleSelectSeason = (s: number) => {
    setCurrentSeason(s);
    setCurrentEpisode(1);
    router.replace(`/watch/${id}?type=${type}&season=${s}&episode=1`);
  };

  const handleNextEpisode = () => {
    const nextEp = currentEpisode + 1;
    handleSelectEpisode(nextEp);
  };

  const handleDownload = () => {
    const downloadKey = `${id}-${type}-s${currentSeason}-e${currentEpisode}`;
    const displayTitle =
      type === "tv"
        ? `${title} - S${currentSeason}:E${currentEpisode}`
        : title;

    downloadManager.startDownload({
      id: downloadKey,
      tmdbId: id,
      title: displayTitle,
      type,
      season: currentSeason,
      episode: currentEpisode,
      posterPath: details?.poster_path,
      fileSizeMb: type === "tv" ? 380 : 920,
      streamUrl: window.location.href,
    });

    setIsDownloaded(true);
  };

  const posterImage = details?.backdrop_path
    ? `${IMAGE_BASE}/w1280${details.backdrop_path}`
    : undefined;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-2 text-zinc-400 text-xs">
        <Loader2 className="w-5 h-5 animate-spin text-white" />
        <span>Loading stream engine...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 pb-28 space-y-6">
      {/* Top Header with Back & One-Tap Download Trigger */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Link href={`/details/${id}?type=${type}`}>
            <GlassButton variant="secondary" className="text-xs py-1.5 px-3">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Details</span>
            </GlassButton>
          </Link>
          <h2 className="text-xs sm:text-sm font-semibold text-zinc-300 truncate max-w-[150px] sm:max-w-md">
            {title}
          </h2>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
            isDownloaded
              ? "bg-white/10 text-emerald-400 border-emerald-400/30"
              : "bg-white/10 text-white border-white/20 hover:bg-white/20 shadow-glow"
          }`}
        >
          {isDownloaded ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Downloaded</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </>
          )}
        </button>
      </div>

      {/* Main Video Stream */}
      {isSeriesOrAnime ? (
        <AnimePlayer
          tmdbId={id}
          animeTitle={title}
          season={currentSeason}
          episode={currentEpisode}
          totalEpisodes={episodes.length || undefined}
          poster={posterImage}
          onNextEpisode={handleNextEpisode}
        />
      ) : (
        <Player
          id={id}
          type={type}
          season={1}
          episode={currentEpisode}
          poster={posterImage}
        />
      )}

      {/* Episode Browser Grid */}
      {isSeriesOrAnime && episodes.length > 0 && (
        <AnimeEpisodeGrid
          episodes={episodes}
          currentEpisode={currentEpisode}
          currentSeason={currentSeason}
          seasonsCount={seasonsCount}
          onSelectEpisode={handleSelectEpisode}
          onSelectSeason={handleSelectSeason}
        />
      )}
    </div>
  );
}
