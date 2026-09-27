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
  ArrowLeft,
  Compass,
} from "lucide-react";
import { tmdb, MediaItem, IMAGE_BASE, DEFAULT_CREDITS, BACKUP_HINDI_MOVIES, BACKUP_HINDI_SERIES } from "@/lib/tmdb";
import { HINDI_DUBBED_ANIME_CATALOG } from "@/lib/animeService";
import { watchlistManager } from "@/lib/watchlistManager";
import { downloadManager } from "@/lib/downloadManager";
import { soundFx } from "@/lib/soundFx";

export default function DetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params?.id as string;
  const type = (searchParams.get("type") as "movie" | "tv") || "movie";
  const source = searchParams.get("source");

  const [details, setDetails] = useState<any>(null);
  const [cast, setCast] = useState<any[]>([]);
  const [crew, setCrew] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [activeCreditTab, setActiveCreditTab] = useState<"cast" | "director" | "producer">("cast");
  const [creditViewMode, setCreditViewMode] = useState<"grid" | "list">("grid");
  const [inWatchlist, setInWatchlist] = useState<boolean>(false);
  const [downloaded, setDownloaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ref = document.referrer;
      if (ref && !ref.includes("/watch/") && !ref.includes("/details/")) {
        try {
          const originPath = new URL(ref).pathname;
          sessionStorage.setItem("spectra_details_origin", originPath);
        } catch {}
      }
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchDetails = async () => {
      try {
        const data = await tmdb.getDetails(type, id);
        if (isMounted && data) {
          setDetails(data);
          const rawCast = data.credits?.cast?.length ? data.credits.cast : DEFAULT_CREDITS.cast;
          const rawCrew = data.credits?.crew?.length ? data.credits.crew : DEFAULT_CREDITS.crew;
          setCast(rawCast);
          setCrew(rawCrew);

          // Category-aware recommendations
          let recs: any[] = [];
          if (source === "anime") {
            recs = HINDI_DUBBED_ANIME_CATALOG.filter((a) => String(a.mal_id) !== String(id)).map((a) => ({
              id: a.mal_id,
              title: a.title_english || a.title,
              poster_path: a.images.jpg.image_url,
              media_type: "tv",
              vote_average: a.score,
              release_date: `${a.year || 2024}`,
              source: "anime",
            }));
          } else if (data.recommendations?.results?.length) {
            recs = data.recommendations.results;
          } else if (data.similar?.results?.length) {
            recs = data.similar.results;
          } else {
            recs = type === "tv"
              ? BACKUP_HINDI_SERIES.filter((s) => String(s.id) !== String(id))
              : BACKUP_HINDI_MOVIES.filter((m) => String(m.id) !== String(id));
          }
          setRecommendations(recs);
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

    return () => {
      isMounted = false;
    };
  }, [id, type, source]);

  const handleGoBack = () => {
    soundFx.playCinematicWhoosh();
    const savedOrigin = typeof window !== "undefined" ? sessionStorage.getItem("spectra_details_origin") : null;
    if (savedOrigin && !savedOrigin.includes("/watch/") && !savedOrigin.includes("/details/")) {
      router.push(savedOrigin);
    } else if (source === "anime") {
      router.push("/anime");
    } else if (type === "tv") {
      router.push("/series");
    } else {
      router.push("/");
    }
  };

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

  const markImageBroken = (key: string) => {
    setBrokenImages((prev) => ({ ...prev, [key]: true }));
  };

  if (loading && !details) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Sparkles className="w-6 h-6 text-white animate-spin" />
      </div>
    );
  }

  const title = details?.title || details?.name || "Media Title";
  const releaseYear = (details?.release_date || details?.first_air_date || "2023").slice(0, 4);
  const posterUrl = details?.poster_path
    ? details.poster_path.startsWith("http")
      ? details.poster_path
      : `${IMAGE_BASE}/w342${details.poster_path}`
    : null;
  const rating = details?.vote_average ? details.vote_average.toFixed(1) : "8.1";

  // Dynamic filter for Cast, Director, and Producer
  const directors = crew.filter(
    (c: any) =>
      c.job?.toLowerCase() === "director" ||
      c.department?.toLowerCase() === "directing"
  );
  const producers = crew.filter(
    (c: any) =>
      c.job?.toLowerCase().includes("producer") ||
      c.department?.toLowerCase() === "production"
  );

  const displayCredits =
    activeCreditTab === "cast"
      ? cast.slice(0, 15)
      : activeCreditTab === "director"
      ? (directors.length ? directors : DEFAULT_CREDITS.crew.filter((c) => c.job === "Director"))
      : (producers.length ? producers : DEFAULT_CREDITS.crew.filter((c) => c.job === "Producer"));

  return (
    <div className="max-w-md mx-auto px-3 pt-3 pb-28 space-y-4">
      {/* 1. Top Floating Back Button & Poster Card */}
      <div className="relative rounded-3xl p-4 sm:p-5 border border-white/10 bg-[#0e0e14]/90 backdrop-blur-2xl shadow-2xl overflow-hidden">
        {details?.backdrop_path && (
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <Image
              src={
                details.backdrop_path.startsWith("http")
                  ? details.backdrop_path
                  : `${IMAGE_BASE}/w780${details.backdrop_path}`
              }
              alt=""
              fill
              unoptimized
              className="object-cover blur-2xl"
            />
          </div>
        )}

        {/* Floating Back Button */}
        <div className="relative z-20 flex items-center justify-between pb-3">
          <button
            onClick={handleGoBack}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-2xl flex items-center justify-center transition active:scale-90 shadow-md"
            aria-label="Back to Catalog"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Poster & Meta Info */}
        <div className="relative z-10 space-y-4">
          <div className="flex gap-4 items-start">
            <div className="relative w-28 aspect-[2/3] rounded-2xl overflow-hidden bg-zinc-950 border border-white/15 flex-none shadow-xl">
              {posterUrl ? (
                <Image src={posterUrl} alt={title} fill unoptimized className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
                  Poster
                </div>
              )}
              <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/85 backdrop-blur-md px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white border border-white/20 shadow-md">
                <Star className="w-2.5 h-2.5 fill-white text-white" />
                <span>{rating}</span>
              </div>
            </div>

            <div className="flex-1 space-y-2 py-0.5">
              <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/10 text-zinc-300 border border-white/15">
                {source === "anime" ? "ANIME" : type === "tv" ? "SERIES" : "MOVIE"} • {releaseYear}
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

          {/* Action Buttons: ► Play + Watchlist Toggle */}
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
                  ? "bg-red-500/20 text-red-400 border-red-500/40 font-bold"
                  : "bg-white/10 hover:bg-white/20 border-white/15 text-white"
              }`}
            >
              {inWatchlist ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4 stroke-[2.5]" />}
            </button>
          </div>

          {/* Full-width Download Button */}
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

      {/* 2. Storyline */}
      <div className="space-y-1 px-1">
        <h3 className="text-sm font-bold text-white tracking-wide">Storyline</h3>
        <p className="text-xs text-zinc-300 leading-relaxed font-normal">
          {details?.overview || "A high-octane spectacle streaming in full definition."}
        </p>
      </div>

      {/* 3. Cast & Crew Matrix with working tabs & resilient avatars */}
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

        {/* Carousel / List */}
        {creditViewMode === "grid" ? (
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2">
            {displayCredits.map((member: any, idx: number) => {
              const imageKey = `credit-${member.id || idx}`;
              const isBroken = brokenImages[imageKey];
              const avatar = !isBroken && member.profile_path
                ? member.profile_path.startsWith("http")
                  ? member.profile_path
                  : `${IMAGE_BASE}/w185${member.profile_path}`
                : null;

              return (
                <div
                  key={`credit-${member.id || idx}-${member.job || member.character || idx}`}
                  className="flex-none w-24 p-2.5 rounded-2xl bg-[#0c0c14]/80 border border-white/10 flex flex-col items-center text-center space-y-1.5 shadow-md hover:border-white/25 transition"
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/20 flex-none shadow-inner flex items-center justify-center">
                    {avatar ? (
                      <Image
                        src={avatar}
                        alt=""
                        fill
                        unoptimized
                        className="object-cover"
                        onError={() => markImageBroken(imageKey)}
                      />
                    ) : (
                      <span className="text-white font-black text-xs tracking-wider">
                        {member.name ? member.name.slice(0, 2).toUpperCase() : "??"}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 w-full">
                    <h5 className="text-[10px] font-bold text-white truncate">{member.name}</h5>
                    <p className="text-[8px] text-zinc-400 truncate">
                      {member.character || member.job || "Production"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {displayCredits.map((member: any, idx: number) => {
              const imageKey = `credit-list-${member.id || idx}`;
              const isBroken = brokenImages[imageKey];
              const avatar = !isBroken && member.profile_path
                ? member.profile_path.startsWith("http")
                  ? member.profile_path
                  : `${IMAGE_BASE}/w185${member.profile_path}`
                : null;

              return (
                <div
                  key={`credit-list-${member.id || idx}-${member.job || member.character || idx}`}
                  className="flex items-center gap-3 p-2 rounded-xl bg-[#0c0c14]/80 border border-white/10"
                >
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/15 flex-none flex items-center justify-center">
                    {avatar ? (
                      <Image
                        src={avatar}
                        alt=""
                        fill
                        unoptimized
                        className="object-cover"
                        onError={() => markImageBroken(imageKey)}
                      />
                    ) : (
                      <span className="text-white font-bold text-xs">
                        {member.name ? member.name.slice(0, 2).toUpperCase() : "??"}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-white truncate">{member.name}</h5>
                    <p className="text-[10px] text-zinc-400 truncate">
                      {member.character || member.job || "Crew"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. "More Like This" Discovery Shelf with Horizontal Edge-Peeking Posters */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-red-500" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">More Like This</h3>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">
            {recommendations.length} Titles
          </span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2 px-0.5">
          {recommendations.map((item: any, idx: number) => {
            const recImageKey = `rec-img-${item.id || idx}`;
            const isRecBroken = brokenImages[recImageKey];
            const poster = !isRecBroken && item.poster_path
              ? item.poster_path.startsWith("http")
                ? item.poster_path
                : `${IMAGE_BASE}/w185${item.poster_path}`
              : null;
            const recType = item.media_type || type;

            return (
              <Link
                key={`rec-${item.id}-${idx}`}
                href={
                  item.source === "anime" || (recType === "tv" && String(item.id).length < 6)
                    ? `/details/${item.id}?type=tv&source=anime`
                    : `/details/${item.id}?type=${recType}`
                }
                onClick={() => soundFx.playCinematicPop()}
                className="flex-none w-28 group relative"
              >
                <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 group-hover:border-white/30 transition shadow-md group-hover:scale-[1.02]">
                  {poster ? (
                    <Image
                      src={poster}
                      alt=""
                      fill
                      unoptimized
                      className="object-cover transition duration-300"
                      onError={() => markImageBroken(recImageKey)}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 p-2 text-center">
                      <span className="text-[10px] font-bold text-zinc-400 truncate max-w-full">
                        {item.title || item.name}
                      </span>
                    </div>
                  )}

                  {/* Red Frosted Glass Tag */}
                  <div className="absolute top-1.5 left-1.5 z-10">
                    <span className="px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider bg-red-600/30 backdrop-blur-md border border-red-500/40 text-red-200 shadow-[0_0_8px_rgba(239,68,68,0.45)]">
                      MULTI
                    </span>
                  </div>

                  {item.vote_average ? (
                    <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] text-white font-bold border border-white/15">
                      <Star className="w-2 h-2 fill-white text-white" />
                      {item.vote_average.toFixed(1)}
                    </div>
                  ) : null}
                </div>

                <h4 className="text-[11px] font-bold text-white truncate mt-1 group-hover:text-red-300 transition">
                  {item.title || item.name}
                </h4>
                <p className="text-[9px] text-zinc-400 font-mono truncate">
                  {(item.release_date || item.first_air_date || "2024").slice(0, 4)}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
