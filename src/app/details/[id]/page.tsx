"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Play,
  Bookmark,
  BookmarkCheck,
  Download,
  Star,
  Clock,
  Calendar,
  Volume2,
  Tv,
  Film,
  Sparkles,
  Share2,
} from "lucide-react";
import { tmdb, MediaItem, EpisodeItem, IMAGE_BASE } from "@/lib/tmdb";
import { animeService } from "@/lib/animeService";
import { watchlistManager } from "@/lib/watchlistManager";
import { downloadManager } from "@/lib/downloadManager";
import { OttShelf } from "@/components/OttShelf";
import { soundFx } from "@/lib/soundFx";

export default function DetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params?.id as string;
  const type = (searchParams.get("type") as "movie" | "tv") || "movie";
  const source = searchParams.get("source");

  const [details, setDetails] = useState<any>(null);
  const [episodes, setEpisodes] = useState<EpisodeItem[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [inWatchlist, setInWatchlist] = useState<boolean>(false);
  const [downloaded, setDownloaded] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const loadDetails = async () => {
      try {
        if (source === "anime") {
          const results = await animeService.getHindiDubbedPopular();
          const match = results.find((a) => String(a.mal_id) === String(id));
          if (match && isMounted) {
            setDetails({
              id: match.mal_id,
              title: match.title_english || match.title,
              name: match.title_english || match.title,
              overview: match.synopsis || "Anime streaming with original Japanese and Hindi dub tracks.",
              poster_path: match.images?.jpg?.image_url,
              backdrop_path: match.images?.jpg?.large_image_url,
              vote_average: match.score,
              first_air_date: "Anime Series",
              number_of_seasons: 1,
              genres: [{ name: "Anime" }, { name: "Animation" }, { name: "Action" }],
            });
            // Generate episodes list
            const totalEps = match.episodes || 12;
            const eps: EpisodeItem[] = [];
            for (let i = 1; i <= Math.min(totalEps, 24); i++) {
              eps.push({
                id: i,
                name: `Episode ${i}`,
                overview: `Chapter ${i} of the adventure with dual audio tracks.`,
                episode_number: i,
                season_number: 1,
                still_path: null,
                vote_average: match.score,
              });
            }
            setEpisodes(eps);
          }
        } else {
          const data = await tmdb.getDetails(type, id);
          if (isMounted && data) {
            setDetails(data);
            setRecommendations(data.recommendations?.results?.slice(0, 10) || []);

            if (type === "tv") {
              const eps = await tmdb.getSeasonEpisodes(id, 1);
              setEpisodes(eps);
            }
          }
        }
      } catch (e) {
        console.error("Details fetch error:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDetails();
    setInWatchlist(watchlistManager.has(id));
    setDownloaded(downloadManager.has(id));

    return () => { isMounted = false; };
  }, [id, type, source]);

  const toggleWatchlist = () => {
    soundFx.playCinematicPop();
    if (!details) return;
    if (inWatchlist) {
      watchlistManager.remove(id);
      setInWatchlist(false);
    } else {
      watchlistManager.add({
        id: String(details.id),
        title: details.title || details.name,
        type: type,
        posterPath: details.poster_path,
        voteAverage: details.vote_average,
        addedAt: Date.now(),
      });
      setInWatchlist(true);
    }
  };

  const handleDownload = () => {
    soundFx.playCinematicPop();
    if (!details) return;
    downloadManager.add({
      id: String(details.id),
      title: details.title || details.name,
      type: type,
      posterPath: details.poster_path,
      sizeBytes: 1024 * 1024 * 480, // ~480MB
    });
    setDownloaded(true);
  };

  if (loading || !details) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Sparkles className="w-6 h-6 text-white animate-spin" />
      </div>
    );
  }

  const title = details.title || details.name;
  const isTv = type === "tv" || source === "anime";

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-3 pb-28 space-y-6">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            soundFx.playCinematicWhoosh();
            router.back();
          }}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleWatchlist}
            className={`p-2 rounded-xl border backdrop-blur-xl transition ${
              inWatchlist
                ? "bg-emerald-400 text-black border-emerald-400 font-bold"
                : "bg-white/10 hover:bg-white/20 border-white/20 text-white"
            }`}
            title="Watchlist"
          >
            {inWatchlist ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>

          <button
            onClick={handleDownload}
            className={`p-2 rounded-xl border backdrop-blur-xl transition ${
              downloaded
                ? "bg-white text-black border-white font-bold"
                : "bg-white/10 hover:bg-white/20 border-white/20 text-white"
            }`}
            title="Download Offline"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Dossier Banner */}
      <div className="relative aspect-[16/10] sm:aspect-[21/9] w-full rounded-3xl overflow-hidden border border-white/15 bg-black shadow-2xl">
        {details.backdrop_path || details.poster_path ? (
          <Image
            src={`${IMAGE_BASE}/w1280${details.backdrop_path || details.poster_path}`}
            alt={title}
            fill
            priority
            unoptimized
            className="object-cover object-top"
          />
        ) : (
          <div className="w-full h-full bg-zinc-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-black/40 to-transparent" />

        <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 max-w-2xl space-y-2 z-10">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-black font-black text-[9px] uppercase tracking-wider">
              {isTv ? "Series Dossier" : "Feature Film"}
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-white font-mono text-[9px] border border-white/20 flex items-center gap-1">
              <Volume2 className="w-2.5 h-2.5 text-emerald-400" />
              <span>Multi-Audio (Hindi • Tamil • Telugu • English)</span>
            </span>
            {details.vote_average ? (
              <span className="px-1.5 py-0.5 rounded-full bg-black/60 text-white font-bold text-[9px] border border-white/15 flex items-center gap-0.5">
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                <span>{details.vote_average.toFixed(1)}</span>
              </span>
            ) : null}
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow">
            {title}
          </h1>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {details.genres?.map((g: any) => (
              <span key={g.name} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-zinc-300 font-semibold">
                {g.name}
              </span>
            ))}
          </div>

          <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed pt-1 max-w-xl">
            {details.overview}
          </p>

          {/* Launch Streaming Button */}
          <div className="pt-2">
            <Link
              href={
                isTv
                  ? `/watch/${id}?type=tv&season=${selectedSeason}&episode=1`
                  : `/watch/${id}?type=movie`
              }
              onClick={() => soundFx.playCinematicSwell()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white text-black font-black text-xs shadow-glow hover:bg-zinc-200 active:scale-95 transition"
            >
              <Play className="w-4 h-4 fill-black text-black" />
              <span>Stream {isTv ? "Episode 1" : "Full Movie"}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Episode Navigation Drawer (for TV / Anime) */}
      {isTv && episodes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <Tv className="w-4 h-4 text-emerald-400" />
              <span>Episodes (Season {selectedSeason})</span>
            </h3>
            <span className="text-[10px] text-zinc-400 font-mono">{episodes.length} Episodes</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {episodes.map((ep) => (
              <Link
                key={`ep-${ep.id}`}
                href={`/watch/${id}?type=tv&season=${selectedSeason}&episode=${ep.episode_number}`}
                onClick={() => soundFx.playCinematicSwell()}
                className="p-3 rounded-2xl bg-[#0c0c14]/80 border border-white/10 hover:border-white/30 transition group flex items-start gap-3 shadow-md"
              >
                <div className="w-8 h-8 rounded-xl bg-white/10 text-white flex items-center justify-center font-black text-xs flex-none group-hover:bg-white group-hover:text-black transition">
                  {ep.episode_number}
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-emerald-300 transition">
                    {ep.name || `Episode ${ep.episode_number}`}
                  </h4>
                  <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {ep.overview || "Stream this episode with multi-server failover."}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Titles Shelf */}
      {recommendations.length > 0 && (
        <OttShelf
          title="More Like This"
          subtitle="Related titles from the catalog"
          items={recommendations}
          type={type}
        />
      )}
    </div>
  );
}
