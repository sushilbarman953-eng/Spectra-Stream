"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Play,
  Plus,
  Check,
  Download,
  Star,
  LayoutGrid,
  List,
  Sparkles,
  User,
} from "lucide-react";
import { tmdb, MediaItem, IMAGE_BASE, BACKUP_HINDI_MOVIES, BACKUP_HINDI_SERIES } from "@/lib/tmdb";
import { watchlistManager } from "@/lib/watchlistManager";
import { downloadManager } from "@/lib/downloadManager";
import { soundFx } from "@/lib/soundFx";

export default function DetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params?.id as string;
  const type = (searchParams.get("type") as "movie" | "tv") || "movie";

  const [details, setDetails] = useState<any>(null);
  const [cast, setCast] = useState<any[]>([]);
  const [crew, setCrew] = useState<any[]>([]);
  const [activeCreditTab, setActiveCreditTab] = useState<"cast" | "director" | "producer">("cast");
  const [creditViewMode, setCreditViewMode] = useState<"grid" | "list">("grid");
  const [inWatchlist, setInWatchlist] = useState<boolean>(false);
  const [downloaded, setDownloaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDetails = async () => {
      try {
        const data = await tmdb.getDetails(type, id);
        if (isMounted && data) {
          setDetails(data);
          setCast(data.credits?.cast || []);
          setCrew(data.credits?.crew || []);
        }
      } catch (e) {
        console.error("Details fetch error:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDetails();
    setInWatchlist(watchlistManager.has(id));
    setDownloaded(downloadManager.has(id));

    return () => { isMounted = false; };
  }, [id, type]);

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
      sizeBytes: 1024 * 1024 * 450,
    });
    setDownloaded(true);
  };

  if (loading && !details) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Sparkles className="w-6 h-6 text-white animate-spin" />
      </div>
    );
  }

  const title = details?.title || details?.name || "Title";
  const releaseYear = (details?.release_date || details?.first_air_date || "2024").slice(0, 4);
  const posterUrl = details?.poster_path ? `${IMAGE_BASE}/w342${details.poster_path}` : null;
  const rating = details?.vote_average ? details.vote_average.toFixed(1) : "7.5";

  // Filter credits
  const filteredCredits =
    activeCreditTab === "cast"
      ? cast.slice(0, 15)
      : activeCreditTab === "director"
      ? crew.filter((c: any) => c.job === "Director" || c.department === "Directing")
      : crew.filter((c: any) => c.job === "Producer" || c.job === "Executive Producer");

  return (
    <div className="max-w-4xl mx-auto px-4 py-3 pb-28 space-y-6">
      {/* Top Back Nav */}
      <button
        onClick={() => {
          soundFx.playCinematicWhoosh();
          router.back();
        }}
        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-xl transition"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      {/* Hero Dossier Card (Exact Screenshot 4 Layout) */}
      <div className="relative rounded-3xl p-5 sm:p-6 border border-white/15 bg-[#0e0e14]/85 backdrop-blur-2xl shadow-2xl overflow-hidden">
        {/* Subtle Ambient Backdrop Glow */}
        {details?.backdrop_path && (
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <Image
              src={`${IMAGE_BASE}/w780${details.backdrop_path}`}
              alt=""
              fill
              unoptimized
              className="object-cover blur-xl"
            />
          </div>
        )}

        <div className="relative z-10 space-y-4">
          <div className="flex gap-4 sm:gap-5">
            {/* Left Poster with Floating Rating Pill */}
            <div className="relative w-28 sm:w-36 aspect-[2/3] rounded-2xl overflow-hidden bg-zinc-950 border border-white/15 flex-none shadow-xl">
              {posterUrl ? (
                <Image
                  src={posterUrl}
                  alt={title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
                  Poster
                </div>
              )}
              {rating && (
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/85 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-white border border-white/20 shadow-md">
                  <Star className="w-2.5 h-2.5 fill-white text-white" />
                  <span>{rating}</span>
                </div>
              )}
            </div>

            {/* Right Meta Info */}
            <div className="flex-1 space-y-2 py-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/10 text-zinc-300 border border-white/15">
                  {type === "tv" ? "SERIES" : "MOVIE"} • {releaseYear}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                {title}
              </h1>

              {/* Genre Pills */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {details?.genres?.map((g: any) => (
                  <span
                    key={g.name}
                    className="px-2.5 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-[10px] text-zinc-300 font-medium"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons: Play + Watchlist (Screenshot 4) */}
          <div className="flex items-center gap-2 pt-2">
            <Link
              href={type === "tv" ? `/watch/${id}?type=tv&season=1&episode=1` : `/watch/${id}?type=movie`}
              onClick={() => soundFx.playCinematicSwell()}
              className="flex-1 py-2.5 px-4 rounded-2xl bg-white text-black font-extrabold text-xs shadow-glow hover:bg-zinc-200 active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-black text-black" />
              <span>Play</span>
            </Link>

            <button
              onClick={toggleWatchlist}
              className={`p-2.5 rounded-2xl border transition active:scale-95 ${
                inWatchlist
                  ? "bg-emerald-400 text-black border-emerald-400 font-bold"
                  : "bg-white/10 hover:bg-white/20 border-white/15 text-white"
              }`}
              title="Add to Watchlist"
            >
              {inWatchlist ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4 stroke-[2.5]" />}
            </button>
          </div>

          {/* Full-Width Download Button (Screenshot 4) */}
          <button
            onClick={handleDownload}
            className={`w-full py-2 px-4 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 active:scale-[0.98] ${
              downloaded
                ? "bg-white/20 border-white/30 text-white font-black"
                : "bg-white/5 hover:bg-white/10 border-white/15 text-zinc-300"
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloaded ? "Saved in Offline Vault" : "Download"}</span>
          </button>
        </div>
      </div>

      {/* Storyline Section (Screenshot 4) */}
      <div className="space-y-1.5 px-1">
        <h3 className="text-sm font-bold text-white tracking-wide">Storyline</h3>
        <p className="text-xs text-zinc-300 leading-relaxed font-normal">
          {details?.overview || "No description provided for this title."}
        </p>
      </div>

      {/* Cast & Crew Section with Tabs & View Toggle (Screenshot 4) */}
      <div className="space-y-3 px-1">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-zinc-400" />
            <h3 className="text-sm font-bold text-white">Cast & Crew</h3>
          </div>

          {/* Tab Selector & Grid/List Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-0.5 rounded-xl bg-white/5 border border-white/10 text-[10px]">
              {(["cast", "director", "producer"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    soundFx.playMechanicalTick();
                    setActiveCreditTab(tab);
                  }}
                  className={`px-2 py-0.5 rounded-lg capitalize transition font-bold ${
                    activeCreditTab === tab
                      ? "bg-white text-black shadow-sm font-black"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center p-0.5 rounded-xl bg-white/5 border border-white/10">
              <button
                onClick={() => setCreditViewMode("grid")}
                className={`p-1 rounded-lg transition ${
                  creditViewMode === "grid" ? "bg-white text-black" : "text-zinc-400 hover:text-white"
                }`}
              >
                <LayoutGrid className="w-3 h-3" />
              </button>
              <button
                onClick={() => setCreditViewMode("list")}
                className={`p-1 rounded-lg transition ${
                  creditViewMode === "list" ? "bg-white text-black" : "text-zinc-400 hover:text-white"
                }`}
              >
                <List className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Cast Cards Horizontal Scroll / Grid (Screenshot 4) */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {filteredCredits.length > 0 ? (
            filteredCredits.map((member: any) => {
              const avatar = member.profile_path ? `${IMAGE_BASE}/w185${member.profile_path}` : null;
              return (
                <div
                  key={`${member.id}-${member.credit_id || member.job}`}
                  className="flex-none w-28 sm:w-32 p-2 rounded-2xl bg-[#0c0c14]/80 border border-white/10 flex flex-col items-center text-center space-y-1.5 shadow-md"
                >
                  <div className="relative w-14 h-14 rounded-full overflow-hidden bg-zinc-900 border border-white/20 flex-none">
                    {avatar ? (
                      <Image
                        src={avatar}
                        alt={member.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 w-full">
                    <h5 className="text-[11px] font-bold text-white truncate">{member.name}</h5>
                    <p className="text-[9px] text-zinc-400 truncate">
                      {member.character || member.job || "Crew"}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-zinc-500 py-3">No credit details available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
