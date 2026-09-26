"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Settings,
  Maximize2,
  Minimize2,
  LayoutGrid,
  List,
  Sparkles,
  ChevronDown,
  Check,
} from "lucide-react";
import { tmdb, EpisodeItem, IMAGE_BASE } from "@/lib/tmdb";
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

  // Active server key: Frosted Glass is the active default, hidden from button row
  const [activeServerKey, setActiveServerKey] = useState<string>("Frosted Glass");
  const [subDubMode, setSubDubMode] = useState<"SUB" | "DUB">("SUB");
  const [details, setDetails] = useState<any>(null);
  const [episodes, setEpisodes] = useState<EpisodeItem[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number>(season);
  const [episodeViewMode, setEpisodeViewMode] = useState<"grid" | "list">("grid");

  // Player state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(260); // 04:20
  const [duration, setDuration] = useState<number>(2700); // 45:00
  const [isHudVisible, setIsHudVisible] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [streamQuality, setStreamQuality] = useState<string>("1080p Ultra");

  const playerContainerRef = useRef<HTMLDivElement>(null);

  const FAILOVER_SERVERS = [
    { key: "VidLink", name: "VidLink", url: (t: string, i: string, s: number, e: number) => t === "movie" ? `https://multiembed.mov/?video_id=${i}&tmdb=1` : `https://multiembed.mov/?video_id=${i}&tmdb=1&s=${s}&e=${e}` },
    { key: "VidSrc", name: "VidSrc", url: (t: string, i: string, s: number, e: number) => t === "movie" ? `https://vidsrc.me/embed/movie?tmdb=${i}` : `https://vidsrc.me/embed/tv?tmdb=${i}&season=${s}&episode=${e}` },
    { key: "2Embed", name: "2Embed", url: (t: string, i: string, s: number, e: number) => t === "movie" ? `https://autoembed.to/movie/tmdb/${i}` : `https://autoembed.to/tv/tmdb/${i}-${s}-${e}` },
    { key: "AutoEmbed", name: "AutoEmbed", url: (t: string, i: string, s: number, e: number) => t === "movie" ? `https://autoembed.co/movie/tmdb/${i}` : `https://autoembed.co/tv/tmdb/${i}/${s}/${e}` },
  ];

  const getStreamUrl = () => {
    if (activeServerKey === "Frosted Glass") {
      return type === "movie"
        ? `https://vidsrc.to/embed/movie/${id}?autoPlay=1`
        : `https://vidsrc.to/embed/tv/${id}/${selectedSeason}/${episode}?autoPlay=1`;
    }
    const found = FAILOVER_SERVERS.find((s) => s.key === activeServerKey);
    return found ? found.url(type, id, selectedSeason, episode) : FAILOVER_SERVERS[0].url(type, id, selectedSeason, episode);
  };

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
        console.error("Watch details error:", e);
      }
    };

    fetchInfo();

    // Persist playback history
    playbackHistory.save({
      id: `${id}_${type}_${selectedSeason}_${episode}`,
      tmdbId: id,
      title: details?.title || details?.name || `Episode ${episode}`,
      type,
      season: selectedSeason,
      episode,
      currentTime,
      duration,
      progressPercent: Math.round((currentTime / duration) * 100),
      lastWatched: Date.now(),
    });

    return () => { isMounted = false; };
  }, [id, type, selectedSeason, episode]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, "0")}:${remSecs.toString().padStart(2, "0")}`;
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const title = details?.title || details?.name || "The Lost World";

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-2 pb-28 space-y-4">
      {/* 1. Header Bar */}
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
          onClick={() => {
            soundFx.playCinematicPop();
            downloadManager.add({
              id: String(id),
              title,
              type,
              posterPath: details?.poster_path,
              sizeBytes: 1024 * 1024 * 480,
            });
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white backdrop-blur-xl transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </button>
      </div>

      {/* 2. Frosted Glass Media Canvas */}
      <div
        ref={playerContainerRef}
        onMouseEnter={() => setIsHudVisible(true)}
        className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-black border border-white/15 shadow-2xl group select-none"
      >
        <iframe
          src={getStreamUrl()}
          className="w-full h-full border-0"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
        />

        {/* Ambient Acrylic Overlay HUD */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
            isHudVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Center Circular Glowing Play/Pause Button */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <button
              onClick={() => {
                soundFx.playCinematicPop();
                setIsPlaying(!isPlaying);
              }}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-2xl flex items-center justify-center text-white shadow-glow transition transform active:scale-95"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-white text-white" />
              ) : (
                <Play className="w-6 h-6 fill-white text-white ml-0.5" />
              )}
            </button>
          </div>

          {/* Acrylic Controller Bar */}
          <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-2.5 sm:p-3 rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/15 space-y-2 pointer-events-auto shadow-2xl">
            {/* Interactive Scrub Line */}
            <div className="relative w-full h-1.5 bg-white/20 rounded-full cursor-pointer overflow-hidden">
              <div
                className="h-full bg-white rounded-full relative"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>

            {/* Controller Controls Row */}
            <div className="flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-3">
                <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-emerald-400 transition">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <button onClick={() => setCurrentTime(Math.max(0, currentTime - 10))} className="hover:text-emerald-400 transition">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))} className="hover:text-emerald-400 transition">
                  <RotateCw className="w-3.5 h-3.5" />
                </button>

                <span className="text-[10px] font-mono text-zinc-300">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => setIsMuted(!isMuted)} className="hover:text-emerald-400 transition">
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* Functional Setting Icon & Popover */}
                <div className="relative">
                  <button
                    onClick={() => setShowSettingsModal(!showSettingsModal)}
                    className="hover:text-emerald-400 transition"
                  >
                    <Settings className="w-4 h-4" />
                  </button>

                  {showSettingsModal && (
                    <div className="absolute bottom-8 right-0 w-48 p-2.5 rounded-2xl bg-[#0c0c14]/95 border border-white/20 shadow-2xl backdrop-blur-3xl space-y-2 z-50 text-[11px]">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-mono block mb-1">Speed</span>
                        <div className="flex gap-1">
                          {[0.75, 1, 1.25, 1.5].map((spd) => (
                            <button
                              key={spd}
                              onClick={() => {
                                setPlaybackSpeed(spd);
                                setShowSettingsModal(false);
                              }}
                              className={`flex-1 py-0.5 rounded text-[10px] font-mono font-bold ${
                                playbackSpeed === spd ? "bg-white text-black" : "bg-white/10 text-white"
                              }`}
                            >
                              {spd}x
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-mono block mb-1">Quality</span>
                        {["1080p Ultra", "720p HD", "Auto (CDN)"].map((q) => (
                          <button
                            key={q}
                            onClick={() => {
                              setStreamQuality(q);
                              setShowSettingsModal(false);
                            }}
                            className="w-full text-left px-1.5 py-1 rounded hover:bg-white/10 flex items-center justify-between text-[10px]"
                          >
                            <span>{q}</span>
                            {streamQuality === q && <Check className="w-3 h-3 text-emerald-400" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button onClick={toggleFullscreen} className="hover:text-emerald-400 transition">
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Audio & Server HUD Matrix */}
      <div className="p-3 rounded-2xl bg-[#0c0c14]/85 border border-white/15 space-y-2.5 shadow-xl">
        <div className="flex items-center justify-between">
          {/* SUB / DUB Switcher for Anime & Dual-Audio */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-white/10 border border-white/15">
            <button
              onClick={() => {
                soundFx.playMechanicalTick();
                setSubDubMode("SUB");
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black transition ${
                subDubMode === "SUB" ? "bg-white text-black shadow-glow" : "text-zinc-400 hover:text-white"
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
                subDubMode === "DUB" ? "bg-white text-black shadow-glow" : "text-zinc-400 hover:text-white"
              }`}
            >
              DUB
            </button>
          </div>

          {/* Episode Counter format: S1 : Ep 1 */}
          {type === "tv" && (
            <span className="text-xs font-mono font-bold text-zinc-300 px-3 py-1 rounded-xl bg-white/5 border border-white/10">
              S{selectedSeason} : Ep {episode}
            </span>
          )}
        </div>

        {/* Server Switcher Row: Frosted Glass is default under the hood, showing VidLink, VidSrc, 2Embed, AutoEmbed */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pt-1">
          {FAILOVER_SERVERS.map((srv) => {
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

      {/* 4. Episodes Shelf with Small Thumbnail Grid & Itemized List Switcher */}
      {type === "tv" && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Episodes ({episodes.length || 22})</h3>
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-300">
                <span>Season {selectedSeason}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>

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

          {/* Episode Cards Layout */}
          {episodeViewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {episodes.map((ep) => {
                const isCurrent = ep.episode_number === episode;
                const stillUrl = ep.still_path ? (ep.still_path.startsWith("http") ? ep.still_path : `${IMAGE_BASE}/w300${ep.still_path}`) : null;
                return (
                  <Link
                    key={`ep-grid-${ep.id}`}
                    href={`/watch/${id}?type=tv&season=${selectedSeason}&episode=${ep.episode_number}`}
                    onClick={() => soundFx.playCinematicSwell()}
                    className={`group rounded-xl overflow-hidden border transition relative bg-[#0c0c14]/80 shadow-md ${
                      isCurrent ? "border-emerald-400 ring-1 ring-emerald-400" : "border-white/10 hover:border-white/25"
                    }`}
                  >
                    <div className="relative aspect-video w-full bg-zinc-950">
                      {stillUrl ? (
                        <Image src={stillUrl} alt={ep.name} fill unoptimized className="object-cover group-hover:scale-105 transition duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600">
                          <Play className="w-4 h-4" />
                        </div>
                      )}
                      <span className="absolute top-1.5 left-1.5 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-mono font-bold text-white border border-white/15">
                        EP {ep.episode_number}
                      </span>
                    </div>
                    <div className="p-1.5">
                      <h5 className="text-[10px] font-bold text-white truncate group-hover:text-emerald-300 transition">
                        {ep.name || `Episode ${ep.episode_number}`}
                      </h5>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {episodes.map((ep) => {
                const isCurrent = ep.episode_number === episode;
                const stillUrl = ep.still_path ? (ep.still_path.startsWith("http") ? ep.still_path : `${IMAGE_BASE}/w300${ep.still_path}`) : null;
                return (
                  <Link
                    key={`ep-list-${ep.id}`}
                    href={`/watch/${id}?type=tv&season=${selectedSeason}&episode=${ep.episode_number}`}
                    onClick={() => soundFx.playCinematicSwell()}
                    className={`p-2.5 rounded-2xl border transition flex items-center gap-3 bg-[#0c0c14]/80 ${
                      isCurrent ? "border-emerald-400 ring-1 ring-emerald-400" : "border-white/10 hover:border-white/25"
                    }`}
                  >
                    <div className="relative w-20 aspect-video rounded-xl overflow-hidden bg-zinc-950 flex-none border border-white/15">
                      {stillUrl ? (
                        <Image src={stillUrl} alt={ep.name} fill unoptimized className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600">
                          <Play className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <span className="absolute bottom-1 left-1 bg-black/80 px-1 py-0.2 rounded text-[7px] font-mono font-bold text-white">
                        EP {ep.episode_number}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-bold text-white truncate">{ep.name || `Episode ${ep.episode_number}`}</h5>
                      <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">{ep.overview || "High-speed multi-audio stream."}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
