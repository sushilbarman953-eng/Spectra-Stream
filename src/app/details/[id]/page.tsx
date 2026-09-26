"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Plus,
  Check,
  Star,
  Film,
  Calendar,
  Clock,
  Sparkles,
  Download,
  Share2,
  Tv,
  ArrowLeft,
  X,
} from "lucide-react";
import { tmdb, IMAGE_BASE, EpisodeItem } from "@/lib/tmdb";
import { watchlistManager } from "@/lib/watchlistManager";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { soundFx } from "@/lib/soundFx";

export default function DetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params?.id as string;
  const type = (searchParams.get("type") as "movie" | "tv") || "movie";

  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inList, setInList] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState<EpisodeItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchDetails = async () => {
      try {
        const data = await tmdb.getDetails(type, id);
        if (isMounted) {
          setDetails(data);
          setInList(watchlistManager.isInList(id));
        }
      } catch (err) {
        console.error("Details error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) fetchDetails();
    return () => {
      isMounted = false;
    };
  }, [id, type]);

  useEffect(() => {
    if (type !== "tv" || !id) return;
    let isMounted = true;
    const fetchEps = async () => {
      try {
        const epData = await tmdb.getSeasonEpisodes(id, selectedSeason);
        if (isMounted && epData) setEpisodes(epData);
      } catch (e) {
        console.error("Season episodes fetch error:", e);
      }
    };
    fetchEps();
    return () => {
      isMounted = false;
    };
  }, [id, type, selectedSeason]);

  const handleToggleWatchlist = () => {
    if (!details) return;
    soundFx.playCinematicPop();
    const itemTitle = details.title || details.name || "Untitled";
    const added = watchlistManager.toggle({
      id: details.id,
      title: itemTitle,
      type,
      posterPath: details.poster_path,
      backdropPath: details.backdrop_path,
      voteAverage: details.vote_average,
      overview: details.overview,
    });
    setInList(added);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-2 text-zinc-400 text-xs">
        <Sparkles className="w-5 h-5 animate-spin text-white" />
        <span>Loading title dossier...</span>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="text-center py-20 text-white space-y-2">
        <p className="text-sm font-semibold">Title details unavailable</p>
        <Link href="/" className="text-xs text-zinc-400 underline">Return to Home</Link>
      </div>
    );
  }

  const title = details.title || details.name || "Untitled";
  const releaseYear = (details.release_date || details.first_air_date || "").slice(0, 4);
  const runtime = details.runtime ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` : null;
  const backdropUrl = details.backdrop_path ? `${IMAGE_BASE}/w1280${details.backdrop_path}` : null;
  const posterUrl = details.poster_path ? `${IMAGE_BASE}/w342${details.poster_path}` : null;
  const trailerVideo = details.videos?.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube");
  const castList = details.credits?.cast?.slice(0, 12) || [];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 pb-28 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            soundFx.playCinematicWhoosh();
            router.back();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-zinc-300 hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundFx.playCinematicPop();
              if (navigator.share) {
                navigator.share({ title, url: window.location.href }).catch(() => {});
              }
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-300 hover:text-white transition"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative aspect-[16/10] sm:aspect-[21/9] w-full rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-black">
        {backdropUrl && (
          <Image
            src={backdropUrl}
            alt={title}
            fill
            priority
            sizes="1200px"
            className="object-cover object-top"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-black/40 to-transparent" />

        <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 flex flex-wrap items-end justify-between gap-3 z-10">
          <div className="space-y-1.5 max-w-xl">
            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
              {title}
            </h1>
            <div className="flex items-center flex-wrap gap-2 text-[11px] text-zinc-300 font-medium">
              {details.vote_average > 0 && (
                <span className="flex items-center gap-0.5 px-2 py-0.5 rounded bg-black/60 border border-white/20 text-white font-bold">
                  <Star className="w-2.5 h-2.5 fill-white text-white" />
                  {details.vote_average.toFixed(1)}
                </span>
              )}
              {releaseYear && <span>{releaseYear}</span>}
              {runtime && <span>• {runtime}</span>}
              <span className="px-1.5 py-0.2 rounded bg-white/15 text-white font-bold uppercase text-[9px]">
                {details.adult ? "18+" : "PG-13"}
              </span>
              <span className="px-1.5 py-0.2 rounded border border-white/20 text-zinc-300 uppercase text-[9px] font-bold">
                4K HDR
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {trailerVideo && (
              <button
                onClick={() => {
                  soundFx.playCinematicSwell();
                  setShowTrailer(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition backdrop-blur-xl"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Trailer</span>
              </button>
            )}

            <button
              onClick={handleToggleWatchlist}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition border backdrop-blur-xl ${
                inList
                  ? "bg-white text-black border-white shadow-glow"
                  : "bg-white/10 hover:bg-white/20 text-white border-white/20"
              }`}
            >
              {inList ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{inList ? "In List" : "Add to List"}</span>
            </button>

            <Link
              href={`/watch/${id}?type=${type}`}
              onClick={() => soundFx.playCinematicSwell()}
            >
              <GlassButton variant="primary" className="text-xs px-5 py-2 font-bold flex items-center gap-1.5 shadow-glow">
                <Play className="w-3.5 h-3.5 fill-black text-black" />
                <span>Play</span>
              </GlassButton>
            </Link>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailerVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-2xl p-4">
          <div className="relative aspect-video w-full max-w-3xl rounded-3xl overflow-hidden border border-white/20 bg-black shadow-2xl">
            <button
              onClick={() => {
                soundFx.playCinematicWhoosh();
                setShowTrailer(false);
              }}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/70 hover:bg-black text-white border border-white/15"
            >
              <X className="w-4 h-4" />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${trailerVideo.key}?autoplay=1`}
              title="Official Trailer"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}

      {/* TV Series Season & Episode Selector */}
      {type === "tv" && details.number_of_seasons && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Tv className="w-4 h-4 text-white" />
              <span>Episodes</span>
            </h3>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {Array.from({ length: details.number_of_seasons }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => {
                    soundFx.playMechanicalTick();
                    setSelectedSeason(i + 1);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition border ${
                    selectedSeason === i + 1
                      ? "bg-white text-black border-white shadow-glow"
                      : "bg-white/5 text-zinc-400 border-white/10 hover:text-white"
                  }`}
                >
                  Season {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {episodes.map((ep) => (
              <Link
                key={ep.id}
                href={`/watch/${id}?type=tv&season=${selectedSeason}&episode=${ep.episode_number}`}
                onClick={() => soundFx.playCinematicSwell()}
                className="flex items-center gap-3 p-2 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition group"
              >
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span className="truncate">{ep.episode_number}. {ep.name}</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {ep.overview || "Watch this episode on Spectra."}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
