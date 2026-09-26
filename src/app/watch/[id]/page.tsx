"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2, Download, Star, Sparkles } from "lucide-react";
import { tmdb, MediaItem, EpisodeItem, IMAGE_BASE } from "@/lib/tmdb";
import { AnimePlayer } from "@/components/AnimePlayer";
import { AnimeEpisodeGrid } from "@/components/AnimeEpisodeGrid";
import { Player } from "@/components/Player";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { BatchDownloadModal } from "@/components/BatchDownloadModal";

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
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  const title = details?.title || details?.name || "Loading Title...";
  const isSeriesOrAnime = type === "tv";
  const seasonsCount = details?.number_of_seasons || 1;

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

  const posterImage = details?.backdrop_path
    ? `${IMAGE_BASE}/w1280${details.backdrop_path}`
    : undefined;

  const relatedItems: MediaItem[] = details?.similar?.results?.slice(0, 10) || [];

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
      {/* Top Header */}
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

        <button
          onClick={() => setDownloadModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 text-white border border-white/20 hover:bg-white/20 shadow-glow"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </button>
      </div>

      {/* Main Video Stream locked to Glass Player */}
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

      {/* Explore More Related Media below player */}
      {relatedItems.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white" />
            <h3 className="text-sm sm:text-base font-bold text-white">Related Titles</h3>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-2">
            {relatedItems.map((item) => {
              const itemTitle = item.title || item.name || "Untitled";
              const itemPoster = item.poster_path ? `${IMAGE_BASE}/w342${item.poster_path}` : null;

              return (
                <Link key={item.id} href={`/details/${item.id}?type=${type}`} className="flex-none w-32 sm:w-36 group">
                  <GlassCard hoverEffect className="overflow-hidden border border-white/10 rounded-2xl h-full flex flex-col justify-between bg-[#0c0c10]">
                    <div className="relative aspect-[2/3] w-full bg-zinc-950">
                      {itemPoster ? (
                        <Image src={itemPoster} alt={itemTitle} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-zinc-600 text-xs">No Poster</div>
                      )}
                      <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/80 px-1.5 py-0.5 rounded text-[9px] text-zinc-200">
                        <Star className="w-2.5 h-2.5 fill-white text-white" />
                        {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
                      </div>
                    </div>
                    <div className="p-2 bg-black/60">
                      <h4 className="text-xs font-semibold text-white truncate">{itemTitle}</h4>
                    </div>
                  </GlassCard>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Batch Download Modal */}
      <BatchDownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        tmdbId={id}
        title={title}
        type={type}
        season={currentSeason}
        episodes={episodes}
        posterPath={details?.poster_path}
      />
    </div>
  );
}
