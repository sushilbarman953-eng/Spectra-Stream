"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  Play,
  Plus,
  Check,
  Download,
  Star,
  LayoutGrid,
  List,
  Sparkles,
  User,
  Search,
  Mic,
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
      sizeBytes: 1024 * 1024 * 480,
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

  const title = details?.title || details?.name || "The Lost World";
  const releaseYear = (details?.release_date || details?.first_air_date || "1999").slice(0, 4);
  const posterUrl = details?.poster_path
    ? details.poster_path.startsWith("http")
      ? details.poster_path
      : `${IMAGE_BASE}/w342${details.poster_path}`
    : null;
  const rating = details?.vote_average ? details.vote_average.toFixed(1) : "7.2";

  const filteredCredits =
    activeCreditTab === "cast"
      ? cast.slice(0, 15)
      : activeCreditTab === "director"
      ? crew.filter((c: any) => c.job === "Director" || c.department === "Directing")
      : crew.filter((c: any) => c.job === "Producer" || c.job === "Executive Producer");

  return (
    <div className="max-w-md mx-auto px-4 py-2 pb-28 space-y-5">
      {/* Top App Header Matching Screenshot 1 */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-base font-black tracking-widest uppercase text-white">
          SPECTRA
        </span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-400">
            <Search className="w-3.5 h-3.5" />
            <span className="text-[11px]">Search...</span>
            <Mic className="w-3.5 h-3.5 ml-1 text-zinc-500" />
          </div>
          <div className="w-7 h-7 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-zinc-300">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Dossier Card (Screenshot 1 Layout) */}
      <div className="relative rounded-3xl p-5 border border-white/10 bg-[#0e0e14]/90 backdrop-blur-2xl shadow-2xl overflow-hidden">
        {details?.backdrop_path && (
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <Image
              src={details.backdrop_path.startsWith("http") ? details.backdrop_path : `${IMAGE_BASE}/w780${details.backdrop_path}`}
              alt=""
              fill
              unoptimized
              className="object-cover blur-2xl"
            />
          </div>
        )}

        <div className="relative z-10 space-y-4">
          <div className="flex gap-4">
            {/* Left Poster with Top-Right Rating Badge */}
            <div className="relative w-28 aspect-[2/3] rounded-2xl overflow-hidden bg-zinc-950 border border-white/15 flex-none shadow-xl">
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
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/85 backdrop-blur-md px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white border border-white/20 shadow-md">
                <Star className="w-2.5 h-2.5 fill-white text-white" />
                <span>{rating}</span>
              </div>
            </div>

            {/* Right Meta Info */}
            <div className="flex-1 space-y-2 py-0.5">
              <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/10 text-zinc-300 border border-white/15">
                {type === "tv" ? "SERIES" : "MOVIE"} • {releaseYear}
              </span>

              <h1 className="text-xl font-black text-white tracking-tight leading-tight">
                {title}
              </h1>

              <div className="flex flex-wrap gap-1 pt-0.5">
                {details?.genres?.length ? (
                  details.genres.map((g: any) => (
                    <span
                      key={g.name}
                      className="px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-[9px] text-zinc-300 font-medium"
                    >
                      {g.name}
                    </span>
                  ))
                ) : (
                  <>
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-[9px] text-zinc-300 font-medium">Action & Adventure</span>
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-[9px] text-zinc-300 font-medium">Drama</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons: Play + Watchlist Toggle */}
          <div className="flex items-center gap-2 pt-1">
            <Link
              href={type === "tv" ? `/watch/${id}?type=tv&season=1&episode=1` : `/watch/${id}?type=movie`}
              onClick={() => soundFx.playCinematicSwell()}
              className="flex-1 py-2.5 px-4 rounded-2xl bg-white text-black font-extrabold text-xs shadow-glow hover:bg-zinc-200 active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-black text-black" />
              <span>Play</span>
            </Link>

            <button
              onClick={toggleWatchlist}
              className={`p-2.5 rounded-2xl border transition active:scale-95 ${
                inWatchlist
                  ? "bg-emerald-400 text-black border-emerald-400 font-bold"
                  : "bg-white/10 hover:bg-white/20 border-white/15 text-white"
              }`}
            >
              {inWatchlist ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4 stroke-[2.5]" />}
            </button>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className={`w-full py-2 px-4 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 active:scale-[0.98] ${
              downloaded
                ? "bg-white/20 border-white/30 text-white font-black"
                : "bg-white/5 hover:bg-white/10 border-white/15 text-zinc-300"
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloaded ? "Downloaded" : "Download"}</span>
          </button>
        </div>
      </div>

      {/* Storyline */}
      <div className="space-y-1 px-1">
        <h3 className="text-sm font-bold text-white tracking-wide">Storyline</h3>
        <p className="text-xs text-zinc-300 leading-relaxed font-normal">
          {details?.overview || "Early 20th-century adventurers find themselves fighting for survival after their hot-air balloon crashes into a remote part of the Amazon, stranding them on a prehistoric plateau."}
        </p>
      </div>

      {/* Cast & Crew Section with Grid / List Layout Switcher */}
      <div className="space-y-3 px-1">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-zinc-400" />
            <h3 className="text-sm font-bold text-white">Cast & Crew</h3>
          </div>

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

        {/* Cast Carousel */}
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2">
          {(filteredCredits.length ? filteredCredits : [
            { id: 1, name: "Peter McCauley", character: "Professor George ...", profile_path: null },
            { id: 2, name: "Rachel Blakely", character: "Marguerite Krux", profile_path: null },
            { id: 3, name: "William Snow", character: "Lord John Roxton", profile_path: null }
          ]).map((member: any) => {
            const avatar = member.profile_path ? `${IMAGE_BASE}/w185${member.profile_path}` : null;
            return (
              <div
                key={`${member.id}-${member.credit_id || member.character}`}
                className="flex-none w-24 p-2 rounded-2xl bg-[#0c0c14]/80 border border-white/10 flex flex-col items-center text-center space-y-1.5 shadow-md"
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-zinc-900 border border-white/20 flex-none">
                  {avatar ? (
                    <Image src={avatar} alt={member.name} fill unoptimized className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-500 font-bold text-xs">
                      {member.name.slice(0, 2)}
                    </div>
                  )}
                </div>
                <div className="min-w-0 w-full">
                  <h5 className="text-[10px] font-bold text-white truncate">{member.name}</h5>
                  <p className="text-[8px] text-zinc-400 truncate">
                    {member.character || member.job || "Cast"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
