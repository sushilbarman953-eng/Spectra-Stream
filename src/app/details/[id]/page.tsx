"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Plus,
  Check,
  Star,
  Download,
  Users,
  LayoutGrid,
  List,
  Sparkles,
  Loader2,
} from "lucide-react";
import { tmdb, MediaItem, EpisodeItem, IMAGE_BASE } from "@/lib/tmdb";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { BatchDownloadModal } from "@/components/BatchDownloadModal";

export default function DetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const type = (searchParams.get("type") as "movie" | "tv") || "movie";

  const [details, setDetails] = useState<any>(null);
  const [episodes, setEpisodes] = useState<EpisodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [peopleTab, setPeopleTab] = useState<"cast" | "director" | "producer">("cast");
  const [peopleView, setPeopleView] = useState<"grid" | "list">("grid");
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchAll = async () => {
      setLoading(true);
      try {
        const data = await tmdb.getDetails(type, id);
        if (isMounted) setDetails(data);

        if (type === "tv") {
          const epData = await tmdb.getSeasonEpisodes(id, 1);
          if (isMounted) setEpisodes(epData || []);
        }

        const stored = localStorage.getItem("spectra_watchlist");
        if (stored) {
          const list: any[] = JSON.parse(stored);
          if (list.some((item) => String(item.id) === String(id))) {
            setIsSaved(true);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) fetchAll();
    return () => {
      isMounted = false;
    };
  }, [id, type]);

  const toggleWatchlist = () => {
    try {
      const stored = localStorage.getItem("spectra_watchlist");
      const currentList: any[] = stored ? JSON.parse(stored) : [];
      let updated: any[];

      if (isSaved) {
        updated = currentList.filter((item) => String(item.id) !== String(id));
        setIsSaved(false);
      } else {
        updated = [details, ...currentList];
        setIsSaved(true);
      }
      localStorage.setItem("spectra_watchlist", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !details) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-2 text-zinc-400 text-xs">
        <Loader2 className="w-5 h-5 animate-spin text-white" />
        <span>Loading details...</span>
      </div>
    );
  }

  const title = details.title || details.name || "Untitled";
  const backdrop = details.backdrop_path ? `${IMAGE_BASE}/original${details.backdrop_path}` : null;
  const poster = details.poster_path ? `${IMAGE_BASE}/w500${details.poster_path}` : null;
  const year = (details.release_date || details.first_air_date || "").slice(0, 4);

  const rawCast = (details.credits?.cast || []).filter((c: any) => c.profile_path || c.name);
  const cast = rawCast.slice(0, 24).map((c: any) => ({
    ...c,
    category: "cast",
    roleName: c.character || "Cast",
  }));

  const crew = details.credits?.crew || [];
  const directors = crew
    .filter((c: any) => c.job === "Director" || c.department === "Directing")
    .map((d: any) => ({ ...d, category: "director", roleName: "Director" }));

  const producers = crew
    .filter((c: any) => c.job === "Producer" || c.job === "Executive Producer")
    .slice(0, 16)
    .map((p: any) => ({ ...p, category: "producer", roleName: p.job || "Producer" }));

  const activePeopleList =
    peopleTab === "cast"
      ? cast
      : peopleTab === "director"
      ? directors.length > 0 ? directors : [{ id: 999, name: "Not Listed", roleName: "Director" }]
      : producers;

  const relatedItems: MediaItem[] = details.similar?.results?.slice(0, 20) || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-2 pb-28 space-y-5">
      
      {/* 1. CINEMATIC HERO: FULL BACKDROP EXTENDING BEHIND POSTER & BUTTONS WITH FROSTED GLASS */}
      <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-black">
        {/* Full-bleed background image covering the entire container */}
        {backdrop && (
          <Image
            src={backdrop}
            alt={title}
            fill
            priority
            className="object-cover object-top opacity-60 filter brightness-90 contrast-105"
          />
        )}

        {/* Global Frosted Glass Vignette Overlay */}
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: "blur(14px) saturate(160%)",
            WebkitBackdropFilter: "blur(14px) saturate(160%)",
            background:
              "linear-gradient(to bottom, rgba(10, 10, 14, 0.25) 0%, rgba(10, 10, 14, 0.70) 50%, rgba(8, 8, 12, 0.95) 100%)",
          }}
        />

        {/* Hero Content Container */}
        <div className="relative z-10 p-4 sm:p-6 space-y-4">
          
          {/* TOP ROW: Left Poster & Right Title with Tags */}
          <div className="flex items-end gap-3.5 sm:gap-5 pt-1">
            {/* Left: Foreground Poster */}
            <div className="relative w-28 sm:w-36 aspect-[2/3] rounded-2xl overflow-hidden border-2 border-white/30 bg-zinc-950/80 shadow-[0_12px_35px_rgba(0,0,0,0.95)] flex-none">
              {poster ? (
                <Image src={poster} alt={title} fill priority className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-zinc-600 text-xs">
                  No Poster
                </div>
              )}
              {details.vote_average > 0 && (
                <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/85 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-white/20 text-[10px] text-white font-bold">
                  <Star className="w-2.5 h-2.5 fill-white text-white" />
                  {details.vote_average.toFixed(1)}
                </div>
              )}
            </div>

            {/* Right: Title & Tags */}
            <div className="flex-1 min-w-0 space-y-1.5 pb-1">
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-300 font-semibold drop-shadow-sm">
                <span className="px-2 py-0.5 rounded-md bg-white/15 text-white uppercase text-[9px] font-bold border border-white/20 backdrop-blur-md">
                  {type === "tv" ? "Series" : "Movie"}
                </span>
                {year && <span>• {year}</span>}
              </div>

              <h1 className="text-lg sm:text-2xl font-extrabold text-white leading-tight line-clamp-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                {title}
              </h1>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 pt-0.5">
                {details.genres?.slice(0, 3).map((g: any) => (
                  <span
                    key={g.id}
                    className="px-2 py-0.5 rounded-md text-[9px] font-medium bg-white/10 backdrop-blur-md border border-white/15 text-zinc-200"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* BENEATH ROW: Full-Width Actions (Play + [+] on top, Download directly underneath) */}
          <div className="space-y-2 pt-1 w-full">
            <div className="flex items-center gap-2 w-full">
              {/* Play Button */}
              <Link href={`/watch/${id}?type=${type}&season=1&episode=1`} className="flex-1">
                <GlassButton
                  variant="primary"
                  className="w-full text-xs py-2.5 font-bold shadow-glow flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-black text-black" />
                  <span>Play</span>
                </GlassButton>
              </Link>

              {/* Add to List (+) Button */}
              <button
                onClick={toggleWatchlist}
                title={isSaved ? "In List" : "Add to List"}
                className={`p-2.5 rounded-xl border transition flex items-center justify-center flex-none ${
                  isSaved
                    ? "bg-white text-black border-white shadow-glow"
                    : "bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md"
                }`}
              >
                {isSaved ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4 stroke-[2.5]" />}
              </button>
            </div>

            {/* Download Button */}
            <button
              onClick={() => setDownloadModalOpen(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-white/10 backdrop-blur-md text-zinc-200 border border-white/15 hover:bg-white/20 hover:text-white transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-zinc-300" />
              <span>Download</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. STORYLINE */}
      <div className="space-y-1.5 px-1">
        <h3 className="text-sm font-bold text-white tracking-wide">Storyline</h3>
        <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">
          {details.overview || "Stream this title now on Spectra."}
        </p>
      </div>

      {/* 3. PEOPLE SECTION: Horizontal Carousel & List Mode Toggle */}
      <div className="space-y-3 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-white" />
            <h3 className="text-sm font-bold text-white">Cast & Crew</h3>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center p-0.5 rounded-xl bg-white/5 border border-white/15">
              {(["cast", "director", "producer"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setPeopleTab(tab)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold capitalize transition ${
                    peopleTab === tab
                      ? "bg-white text-black shadow-glow font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center p-0.5 rounded-xl bg-white/5 border border-white/15">
              <button
                onClick={() => setPeopleView("grid")}
                className={`p-1.5 rounded-lg transition ${
                  peopleView === "grid"
                    ? "bg-white text-black shadow-glow"
                    : "text-zinc-400 hover:text-white"
                }`}
                title="Carousel"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPeopleView("list")}
                className={`p-1.5 rounded-lg transition ${
                  peopleView === "list"
                    ? "bg-white text-black shadow-glow"
                    : "text-zinc-400 hover:text-white"
                }`}
                title="List"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Mode vs List Mode */}
        {peopleView === "grid" ? (
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar scroll-smooth pb-2 pt-1">
            {activePeopleList.map((person: any, idx: number) => {
              const photo = person.profile_path
                ? `${IMAGE_BASE}/w185${person.profile_path}`
                : null;

              return (
                <div
                  key={`${person.id}-${idx}`}
                  className="flex-none w-28 flex flex-col items-center text-center p-2.5 rounded-2xl border border-white/10 bg-[#0e0e13]/80 hover:border-white/25 transition group"
                >
                  <div className="relative w-14 h-14 rounded-full overflow-hidden bg-zinc-900 border border-white/15 flex-none mb-1.5">
                    {photo ? (
                      <Image src={photo} alt={person.name} fill className="object-cover group-hover:scale-105 transition" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-zinc-600 text-[11px] font-bold">
                        {person.name?.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-bold text-white truncate w-full">{person.name}</p>
                  <p className="text-[10px] text-zinc-400 truncate w-full">{person.roleName}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="max-h-64 overflow-y-auto no-scrollbar space-y-1.5 pr-1">
            {activePeopleList.map((person: any, idx: number) => {
              const photo = person.profile_path
                ? `${IMAGE_BASE}/w185${person.profile_path}`
                : null;

              return (
                <div
                  key={`${person.id}-${idx}`}
                  className="flex items-center justify-between p-2 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-zinc-900 border border-white/15 flex-none">
                      {photo ? (
                        <Image src={photo} alt={person.name} fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-zinc-600 text-[9px] font-bold">
                          {person.name?.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-bold text-white truncate">{person.name}</p>
                  </div>
                  <span className="text-[10px] text-zinc-400 px-2 py-0.5 rounded bg-white/5 border border-white/10 flex-none ml-2">
                    {person.roleName}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. MORE LIKE THIS: 2-ROW HORIZONTAL SWIPE */}
      {relatedItems.length > 0 && (
        <div className="space-y-2.5 pt-2 border-t border-white/10">
          <div className="flex items-center gap-2 px-1">
            <Sparkles className="w-4 h-4 text-white" />
            <h3 className="text-sm font-bold text-white">More Like This</h3>
          </div>

          <div className="grid grid-rows-2 grid-flow-col auto-cols-[105px] sm:auto-cols-[130px] gap-2.5 overflow-x-auto no-scrollbar scroll-smooth pb-2">
            {relatedItems.map((item) => {
              const itemTitle = item.title || item.name || "Untitled";
              const itemPoster = item.poster_path ? `${IMAGE_BASE}/w342${item.poster_path}` : null;

              return (
                <Link key={item.id} href={`/details/${item.id}?type=${type}`} className="group">
                  <GlassCard
                    hoverEffect
                    className="overflow-hidden border border-white/10 rounded-2xl h-full flex flex-col justify-between bg-[#0c0c10]"
                  >
                    <div className="relative aspect-[2/3] w-full bg-zinc-950">
                      {itemPoster ? (
                        <Image
                          src={itemPoster}
                          alt={itemTitle}
                          fill
                          sizes="130px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-zinc-600 text-[10px]">
                          No Poster
                        </div>
                      )}
                      <div className="absolute top-1 right-1 flex items-center gap-0.5 bg-black/80 px-1 py-0.5 rounded text-[8px] text-zinc-200">
                        <Star className="w-2 h-2 fill-white text-white" />
                        {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
                      </div>
                    </div>
                    <div className="p-1.5 bg-black/60">
                      <h4 className="text-[10px] sm:text-[11px] font-semibold text-white truncate">{itemTitle}</h4>
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
        season={1}
        episodes={episodes}
        posterPath={details.poster_path}
      />
    </div>
  );
}
