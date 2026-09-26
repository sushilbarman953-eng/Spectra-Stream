"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Play,
  RotateCcw,
  Volume2,
  Maximize2,
  LayoutGrid,
  List,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { tmdb, EpisodeItem, IMAGE_BASE } from "@/lib/tmdb";
import { STREAM_SERVERS } from "@/lib/streamingSources";
import { playbackHistory } from "@/lib/playbackHistory";
import { downloadManager } from "@/lib/downloadManager";
import { soundFx } from "@/lib/soundFx";

export default function WatchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params?.id as string;
  const type = (searchParams.get("type") as "movie" | "tv") || "movie";
  const season = parseInt(searchParams.get("season") || "1", 10);
  const episode = parseInt(searchParams.get("episode") || "1", 10);

  // Streaming & Server HUD state
  const [activeServerKey, setActiveServerKey] = useState<string>("Frosted Glass");
  const [subDubMode, setSubDubMode] = useState<"SUB" | "DUB">("SUB");
  const [details, setDetails] = useState<any>(null);
  const [episodes, setEpisodes] = useState<EpisodeItem[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number>(season);
  const [episodeViewMode, setEpisodeViewMode] = useState<"grid" | "list">("grid");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Server definitions matching Screenshot 3
  const SERVER_LIST = [
    { key: "Frosted Glass", name: "Frosted Glass", url: (t: string, i: string, s: number, e: number) => t === "movie" ? `https://vidsrc.to/embed/movie/${i}` : `https://vidsrc.to/embed/tv/${i}/${s}/${e}` },
    { key: "VidLink", name: "VidLink", url: (t: string, i: string, s: number, e: number) => t === "movie" ? `https://multiembed.mov/?video_id=${i}&tmdb=1` : `https://multiembed.mov/?video_id=${i}&tmdb=1&s=${s}&e=${e}` },
    { key: "VidSrc", name: "VidSrc", url: (t: string, i: string, s: number, e: number) => t === "movie" ? `https://vidsrc.me/embed/movie?tmdb=${i}` : `https://vidsrc.me/embed/tv?tmdb=${i}&season=${s}&episode=${e}` },
    { key: "2Embed", name: "2Embed", url: (t: string, i: string, s: number, e: number) => t === "movie" ? `https://autoembed.to/movie/tmdb/${i}` : `https://autoembed.to/tv/tmdb/${i}-${s}-${e}` },
    { key: "AutoEmbed", name: "AutoEmbed", url: (t: string, i: string, s: number, e: number) => t === "movie" ? `https://autoembed.co/movie/tmdb/${i}` : `https://autoembed.co/tv/tmdb/${i}/${s}/${e}` },
  ];

  const currentServer = SERVER_LIST.find((s) => s.key === activeServerKey) || SERVER_LIST[0];
  const streamUrl = currentServer.url(type, id, selectedSeason, episode);

  useEffect(() => {
    let isMounted = true;
    const fetchInfo = async () => {
      try {
        const data = await tmdb.getDetails(type, id);
        if (isMounted && data) {
          setDetails(data);
          if (type === "tv") {
            const epList = await tmdb.getSeasonEpisodes(id, selectedSeason);
            setEpisodes(epList);
          }
        }
      } catch (e) {
        console.error("Watch fetch error:", e);
      }
    };

    fetchInfo();

    // Track playback history
    playbackHistory.save({
      id: `${id}_${type}_${selectedSeason}_${episode}`,
      tmdbId: id,
      title: details?.title || details?.name || `Episode ${episode}`,
      type,
      season: selectedSeason,
      episode,
      currentTime: 180,
      duration: 3600,
      progressPercent: 24,
      lastWatched: Date.now(),
    });

    return () => { isMounted = false; };
  }, [id, type, selectedSeason, episode]);

  const handleDownload = () => {
    soundFx.playCinematicPop();
    if (!details) return;
    downloadManager.add({
      id: String(details.id),
      title: details.title || details.name,
      type: type,
      posterPath: details.poster_path,
      sizeBytes: 1024 * 1024 * 480,
    });
  };

  const title = details?.title || details?.name || "Player";

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-2 pb-28 space-y-4">
      {/* Top Bar with Details & Download (Screenshot 3) */}
      <div className="flex items-center justify-between">
        <Link
          href={`/details/${id}?type=${type}`}
          onClick={() => soundFx.playCinematicPop()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white backdrop-blur-xl transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Details</span>
        </Link>

        <span className="text-xs font-bold text-white truncate max-w-[200px] text-center">
          {title}
        </span>

        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white backdrop-blur-xl transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </button>
      </div>

      {/* Main Video Frame & Embed (Screenshot 3) */}
      <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-black border border-white/15 shadow-2xl">
        <iframe
          src={streamUrl}
          className="w-full h-full border-0"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Server & SUB/DUB HUD Controls (Screenshot 3) */}
      <div className="p-3 rounded-2xl bg-[#0c0c14]/85 border border-white/15 space-y-2.5 shadow-xl">
        {/* Sub/Dub Pill & Episode Status Counter */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-white/10 border border-white/15">
            <button
              onClick={() => {
                soundFx.playMechanicalTick();
                setSubDubMode("SUB");
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black transition ${
                subDubMode === "SUB"
                  ? "bg-white text-black shadow-glow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              SUB
            </button>
            <button
              onClick={() => {
                soundFx.playMechanicalTick();
                setSubDubMode("DUB");
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black transition ${
                subDubMode === "DUB"
                  ? "bg-white text-black shadow-glow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              DUB
            </button>
          </div>

          {type === "tv" && (
            <span className="text-xs font-mono font-bold text-zinc-300 px-3 py-1 rounded-xl bg-white/5 border border-white/10">
              S{selectedSeason} : Ep {episode} / {episodes.length || 22}
            </span>
          )}
        </div>

        {/* Horizontal Server Switcher Pill Buttons (Screenshot 3) */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pt-1">
          {SERVER_LIST.map((srv) => {
            const isSelected = activeServerKey === srv.key;
            return (
              <button
                key={srv.key}
                onClick={() => {
                  soundFx.playCinematicPop();
                  setActiveServerKey(srv.key);
                }}
                className={`flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                  isSelected
                    ? "bg-white text-black border-white shadow-glow font-black"
                    : "bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300"
                }`}
              >
                {srv.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Episodes Navigation Shelf (Screenshot 3) */}
      {type === "tv" && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Episodes ({episodes.length})</h3>
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-300">
                <span>Season {selectedSeason}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Layout Toggle: Grid vs List */}
            <div className="flex items-center p-0.5 rounded-xl bg-white/5 border border-white/10">
              <button
                onClick={() => setEpisodeViewMode("grid")}
                className={`p-1 rounded-lg transition ${
                  episodeViewMode === "grid" ? "bg-white text-black" : "text-zinc-400 hover:text-white"
                }`}
              >
                <LayoutGrid className="w-3 h-3" />
              </button>
              <button
                onClick={() => setEpisodeViewMode("list")}
                className={`p-1 rounded-lg transition ${
                  episodeViewMode === "list" ? "bg-white text-black" : "text-zinc-400 hover:text-white"
                }`}
              >
                <List className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Episode Cards (Screenshot 3) */}
          <div
            className={
              episodeViewMode === "grid"
                ? "grid grid-cols-2 sm:grid-cols-3 gap-3"
                : "flex flex-col gap-2"
            }
          >
            {episodes.map((ep) => {
              const stillUrl = ep.still_path ? `${IMAGE_BASE}/w300${ep.still_path}` : null;
              const isCurrent = ep.episode_number === episode;

              return (
                <Link
                  key={`ep-${ep.id}`}
                  href={`/watch/${id}?type=tv&season=${selectedSeason}&episode=${ep.episode_number}`}
                  onClick={() => soundFx.playCinematicSwell()}
                  className={`group rounded-2xl overflow-hidden border transition relative bg-[#0c0c14]/80 shadow-md ${
                    isCurrent ? "border-emerald-400 ring-1 ring-emerald-400" : "border-white/10 hover:border-white/25"
                  }`}
                >
                  <div className="relative aspect-video w-full bg-zinc-950">
                    {stillUrl ? (
                      <Image
                        src={stillUrl}
                        alt={ep.name}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <Play className="w-5 h-5" />
                      </div>
                    )}
                    <span className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-mono font-bold text-white border border-white/15">
                      EP {ep.episode_number}
                    </span>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 fill-white text-white" />
                    </div>
                  </div>

                  <div className="p-2 space-y-0.5">
                    <h5 className="text-[11px] font-bold text-white truncate group-hover:text-emerald-300 transition">
                      {ep.name || `Episode ${ep.episode_number}`}
                    </h5>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
