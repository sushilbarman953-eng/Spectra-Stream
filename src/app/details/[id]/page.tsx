"use client";

import React, { useState, useEffect } from "react";
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
  Clock,
} from "lucide-react";
import {
  tmdb,
  IMAGE_BASE,
  DEFAULT_CREDITS,
  EXTENDED_MOVIES_CATALOG,
  EXTENDED_SERIES_CATALOG,
} from "@/lib/tmdb";
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

  // Parallax smooth scroll state
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          } else {
            recs = type === "tv"
              ? EXTENDED_SERIES_CATALOG.filter((s) => String(s.id) !== String(id))
              : EXTENDED_MOVIES_CATALOG.filter((m) => String(m.id) !== String(id));
          }

          if (recs.length < 12) {
            const fallbackPool = type === "tv" ? EXTENDED_SERIES_CATALOG : EXTENDED_MOVIES_CATALOG;
            const existingIds = new Set(recs.map((r) => String(r.id)));
            fallbackPool.forEach((item) => {
              if (!existingIds.has(String(item.id)) && String(item.id) !== String(id)) {
                recs.push(item);
                existingIds.add(String(item.id));
              }
            });
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

  if (loading && !details) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Sparkles className="w-6 h-6 text-white animate-spin" />
      </div>
    );
  }

  const title = details?.title || details?.name || "Media Title";
  const releaseYear = (details?.release_date || details?.first_air_date || "2024").slice(0, 4);

  const rawBackdrop = details?.backdrop_path || details?.poster_path;
  const backdropUrl = rawBackdrop
    ? rawBackdrop.startsWith("http")
      ? rawBackdrop
      : `${IMAGE_BASE}/w1280${rawBackdrop}`
    : null;

  const rawPoster = details?.poster_path;
  const posterUrl = rawPoster
    ? rawPoster.startsWith("http")
      ? rawPoster
      : `${IMAGE_BASE}/w342${rawPoster}`
    : null;

  const rating = details?.vote_average ? details.vote_average.toFixed(1) : "8.9";
  const runtime = details?.runtime ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` : "3h 00m";

  // Natural scroll parallax: transforms with document scroll and fades out as user reaches storyline
  const parallaxTranslate = scrollY > 0 ? scrollY * 0.45 : 0;
  const parallaxScale = scrollY < 0 ? 1 + Math.abs(scrollY) * 0.003 : 1;
  const backdropOpacity = Math.max(0, 1 - scrollY / 320);

  // Filter Credits
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
    <div className="min-h-screen bg-[#08080c] relative select-none overflow-x-hidden">
      {/* 1. PARALLAX HERO BACKDROP (Presents hero at top, fades away on scroll) */}
      <div className="relative w-full h-[52vh] sm:h-[60vh] overflow-hidden bg-black">
        {backdropUrl && (
          <div
            className="absolute inset-0 w-full h-full will-change-transform"
            style={{
              transform: `translate3d(0, ${parallaxTranslate}px, 0) scale(${parallaxScale})`,
              transformOrigin: "center top",
              opacity: backdropOpacity,
            }}
          >
            <img
              src={backdropUrl}
              alt=""
              className="w-full h-full object-cover object-top brightness-110 contrast-[1.05]"
            />
          </div>
        )}

        {/* Seamless bottom fade so lower sections never bleed */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-[#08080c]/30 to-transparent pointer-events-none" />

        {/* Top Floating Glass Back Button */}
        <div className="absolute top-4 left-4 z-30">
          <button
            onClick={handleGoBack}
            className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 border border-white/25 text-white backdrop-blur-xl flex items-center justify-center transition active:scale-90 shadow-2xl"
            aria-label="Back to Catalog"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* 2. OVERLAPPING TRANSLUCENT FROSTED GLASS CARD */}
      <div className="max-w-md mx-auto px-3.5 -mt-36 relative z-20 pb-28 space-y-5">
        <div className="rounded-3xl p-4 sm:p-5 border border-white/20 bg-[#0e0e14]/75 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] space-y-4">
          
          {/* Metadata & Poster: Larger typography and balanced tags to fill vertical height */}
          <div className="flex gap-4 items-stretch">
            <div className="relative w-28 sm:w-32 aspect-[2/3] rounded-2xl overflow-hidden bg-zinc-950 border border-white/20 flex-none shadow-2xl">
              {posterUrl ? (
                <img src={posterUrl} alt={title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
                  Poster
                </div>
              )}
              <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-black text-white border border-white/20 shadow-md">
                <Star className="w-3 h-3 fill-white text-white" />
                <span>{rating}</span>
              </div>
            </div>

            {/* Info Column — Fills the entire vertical space */}
            <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
              {/* Type, Year & Runtime badges */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-white/10 text-white border border-white/20 backdrop-blur-md">
                  {source === "anime" ? "ANIME" : type === "tv" ? "SERIES" : "MOVIE"}
                </span>
                <span className="text-[10px] font-mono font-bold text-zinc-300 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
                  {releaseYear}
                </span>
                <span className="text-[10px] font-mono font-bold text-zinc-300 px-2 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {runtime}
                </span>
              </div>

              {/* Prominent Large Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] line-clamp-2 my-1">
                {title}
              </h1>

              {/* Enlarged Genre & Audio Pills filling the bottom gap */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                <span className="px-2.5 py-1 rounded-lg bg-red-600/30 border border-red-500/40 text-[10px] font-black text-red-200 uppercase tracking-wider backdrop-blur-md shadow-[0_0_8px_rgba(239,68,68,0.4)]">
                  MULTI AUDIO
                </span>
                {details?.genres?.length ? (
                  details.genres.slice(0, 2).map((g: any) => (
                    <span
                      key={g.name}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.08] border border-white/15 text-[10px] text-zinc-200 font-semibold backdrop-blur-md"
                    >
                      {g.name}
                    </span>
                  ))
                ) : (
                  <>
                    <span className="px-2.5 py-1 rounded-lg bg-white/[0.08] border border-white/15 text-[10px] text-zinc-200 font-semibold backdrop-blur-md">Action</span>
                    <span className="px-2.5 py-1 rounded-lg bg-white/[0.08] border border-white/15 text-[10px] text-zinc-200 font-semibold backdrop-blur-md">Drama</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons: Row 1 Play + List, Row 2 Download */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2">
              <Link
                href={type === "tv" ? `/watch/${id}?type=tv&season=1&episode=1` : `/watch/${id}?type=movie`}
                onClick={() => soundFx.playCinematicSwell()}
                className="flex-1 py-3 px-4 rounded-2xl bg-white text-black font-black text-xs shadow-glow hover:bg-zinc-200 active:scale-[0.98] transition flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-black text-black" />
                <span>Play</span>
              </Link>

              <button
                onClick={toggleWatchlist}
                className={`p-3 rounded-2xl border transition active:scale-95 ${
                  inWatchlist
                    ? "bg-red-500/20 text-red-400 border-red-500/40 font-bold"
                    : "bg-white/10 hover:bg-white/20 border-white/15 text-white backdrop-blur-md"
                }`}
                title={inWatchlist ? "Remove from List" : "Add to List"}
                aria-label="Add to List"
              >
                {inWatchlist ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4 stroke-[2.5]" />}
              </button>
            </div>

            <button
              onClick={handleDownload}
              className={`w-full py-2.5 px-4 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 active:scale-[0.98] ${
                downloaded
                  ? "bg-white/20 border-white/30 text-white font-black"
                  : "bg-white/10 hover:bg-white/15 border-white/20 text-zinc-200 backdrop-blur-md"
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloaded ? "Downloaded" : "Download"}</span>
            </button>
          </div>
        </div>

        {/* 3. SOLID BLACK WRAPPER FOR LOWER SECTIONS (Prevents background image bleed-through) */}
        <div className="bg-[#08080c] rounded-3xl p-1 space-y-5">
          {/* Storyline */}
          <div className="space-y-1.5 px-1">
            <h3 className="text-sm font-bold text-white tracking-wide">Storyline</h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-normal">
              {details?.overview || "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II."}
            </p>
          </div>

          {/* Cast & Crew Matrix */}
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

            {/* Cast Cards */}
            {creditViewMode === "grid" ? (
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2">
                {displayCredits.map((member: any, idx: number) => {
                  const avatar = member.profile_path
                    ? member.profile_path.startsWith("http")
                      ? member.profile_path
                      : `${IMAGE_BASE}/w185${member.profile_path}`
                    : null;

                  return (
                    <div
                      key={`credit-${member.id || idx}-${member.job || member.character || idx}`}
                      className="flex-none w-24 p-2.5 rounded-2xl bg-[#0c0c14]/90 border border-white/10 flex flex-col items-center text-center space-y-1.5 shadow-md hover:border-white/25 transition"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800 border border-white/20 flex-none shadow-inner flex items-center justify-center relative">
                        {avatar ? (
                          <img
                            src={avatar}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
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
                  const avatar = member.profile_path
                    ? member.profile_path.startsWith("http")
                      ? member.profile_path
                      : `${IMAGE_BASE}/w185${member.profile_path}`
                    : null;

                  return (
                    <div
                      key={`credit-list-${member.id || idx}-${member.job || member.character || idx}`}
                      className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#0c0c14]/90 border border-white/10"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 border border-white/15 flex-none flex items-center justify-center">
                        {avatar ? (
                          <img
                            src={avatar}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
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

          {/* "More Like This" — 2 Horizontal Rows */}
          <div className="space-y-2.5 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-red-500" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">More Like This</h3>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">
                {recommendations.length} Titles
              </span>
            </div>

            <div className="grid grid-rows-2 grid-flow-col auto-cols-[110px] sm:auto-cols-[125px] gap-2.5 overflow-x-auto no-scrollbar pb-3 px-0.5">
              {recommendations.map((item: any, idx: number) => {
                const poster = item.poster_path
                  ? item.poster_path.startsWith("http")
                    ? item.poster_path
                    : `${IMAGE_BASE}/w185${item.poster_path}`
                  : null;
                const recType = item.media_type || type;

                return (
                  <Link
                    key={`rec-row-${item.id}-${idx}`}
                    href={
                      item.source === "anime" || (recType === "tv" && String(item.id).length < 6)
                        ? `/details/${item.id}?type=tv&source=anime`
                        : `/details/${item.id}?type=${recType}`
                    }
                    onClick={() => soundFx.playCinematicPop()}
                    className="group relative flex flex-col"
                  >
                    <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 group-hover:border-white/30 transition shadow-md group-hover:scale-[1.02]">
                      {poster ? (
                        <img
                          src={poster}
                          alt=""
                          className="w-full h-full object-cover transition duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 p-2 text-center">
                          <span className="text-[10px] font-bold text-zinc-400 truncate max-w-full">
                            {item.title || item.name}
                          </span>
                        </div>
                      )}

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

                    <h4 className="text-[10px] font-bold text-white truncate mt-1 group-hover:text-red-300 transition">
                      {item.title || item.name}
                    </h4>
                    <p className="text-[8px] text-zinc-400 font-mono truncate">
                      {(item.release_date || item.first_air_date || "2024").slice(0, 4)}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
