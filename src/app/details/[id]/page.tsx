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
  Clock,
  Calendar,
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
  const [peopleTab, setPeopleTab] = useState<"all" | "cast" | "director" | "producer">("all");
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
  const runtime = details.runtime ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` : null;

  // People Breakdown
  const cast = (details.credits?.cast || []).slice(0, 18).map((c: any) => ({
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
    .slice(0, 10)
    .map((p: any) => ({ ...p, category: "producer", roleName: p.job || "Producer" }));

  const allPeople = [...directors, ...producers, ...cast];
  const filteredPeople =
    peopleTab === "all"
      ? allPeople
      : allPeople.filter((person) => person.category === peopleTab);

  const relatedItems: MediaItem[] = details.similar?.results?.slice(0, 12) || [];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 pb-28 space-y-8">
      {/* 1. TOP SECTION: Large Background Banner with Overlapping Small Poster */}
      <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-black shadow-2xl">
        {/* Large Background Backdrop Banner */}
        <div className="relative w-full h-52 sm:h-80 md:h-96 bg-zinc-950">
          {backdrop && (
            <Image
              src={backdrop}
              alt={title}
              fill
              priority
              className="object-cover object-center opacity-45"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c10] via-[#0c0c10]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c10] via-transparent to-transparent" />
        </div>

        {/* Overlapping Content Box: Small Poster + Title + Buttons OUTSIDE Poster */}
        <div className="relative px-5 sm:px-8 pb-8 -mt-24 sm:-mt-36 z-10 flex flex-col md:flex-row gap-6 items-start">
          
          {/* Small Crisp Poster (Overlapping) */}
          <div className="relative w-36 sm:w-48 md:w-56 aspect-[2/3] rounded-2xl overflow-hidden border-2 border-white/20 bg-zinc-900 shadow-[0_10px_30px_rgba(0,0,0,0.85)] flex-none">
            {poster ? (
              <Image
                src={poster}
                alt={title}
                fill
                priority
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-600 text-xs">
                No Poster
              </div>
            )}
            {details.vote_average > 0 && (
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/15 text-xs text-white font-bold">
                <Star className="w-3 h-3 fill-white text-white" />
                {details.vote_average.toFixed(1)}
              </div>
            )}
          </div>

          {/* Details & Actions Block */}
          <div className="flex-1 space-y-4 pt-2 md:pt-14">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/15 text-white border border-white/20">
                  {type === "tv" ? "Series / Anime" : "Movie"}
                </span>
                {year && (
                  <span className="flex items-center gap-1 text-xs text-zinc-300">
                    <Calendar className="w-3 h-3 text-zinc-400" />
                    {year}
                  </span>
                )}
                {runtime && (
                  <span className="flex items-center gap-1 text-xs text-zinc-300">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    {runtime}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {title}
              </h1>

              {/* Genre Pills */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {details.genres?.map((g: any) => (
                  <span
                    key={g.id}
                    className="px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-white/5 border border-white/10 text-zinc-300"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            </div>

            {/* BUTTONS LAYOUT: Play + [+] beside each other, and Download beneath Play */}
            <div className="space-y-2.5 max-w-sm pt-2">
              <div className="flex items-center gap-2.5">
                {/* Play Button */}
                <Link href={`/watch/${id}?type=${type}&season=1&episode=1`} className="flex-1">
                  <GlassButton
                    variant="primary"
                    className="w-full text-xs py-2.5 font-bold shadow-glow flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-black text-black" />
                    <span>Play</span>
                  </GlassButton>
                </Link>

                {/* Add to List Button (Icon Only) */}
                <button
                  onClick={toggleWatchlist}
                  title={isSaved ? "Remove from List" : "Add to List"}
                  className={`p-2.5 rounded-2xl border transition flex items-center justify-center ${
                    isSaved
                      ? "bg-white text-black border-white shadow-glow"
                      : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                  }`}
                >
                  {isSaved ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  )}
                </button>
              </div>

              {/* Download Button (Beneath Play) */}
              <button
                onClick={() => setDownloadModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-2xl text-xs font-semibold bg-white/10 text-zinc-200 border border-white/15 hover:bg-white/15 hover:text-white transition"
              >
                <Download className="w-3.5 h-3.5 text-zinc-300" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Overview Section */}
      <div className="space-y-2">
        <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
          Storyline
        </h3>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-4xl">
          {details.overview || "No overview available for this title."}
        </p>
      </div>

      {/* 3. PEOPLE SECTION: Cast, Director, Producer Tabs + Grid/List Toggle */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-white" />
            <h3 className="text-base font-bold text-white">Cast & Crew</h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Category Sub-Buttons (Cast, Director, Producer) */}
            <div className="flex items-center p-0.5 rounded-xl bg-white/5 border border-white/15">
              {(["all", "cast", "director", "producer"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setPeopleTab(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                    peopleTab === tab
                      ? "bg-white text-black shadow-glow font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* View Switcher: Grid vs List Toggle */}
            <div className="flex items-center p-0.5 rounded-xl bg-white/5 border border-white/15">
              <button
                onClick={() => setPeopleView("grid")}
                className={`p-1.5 rounded-lg transition ${
                  peopleView === "grid"
                    ? "bg-white text-black shadow-glow"
                    : "text-zinc-400 hover:text-white"
                }`}
                title="Grid View"
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
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Display: Vertical Cards Container (Grid) vs Vertical Rows (List) */}
        {peopleView === "grid" ? (
          <div className="max-h-[380px] overflow-y-auto no-scrollbar p-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredPeople.map((person, idx) => {
                const photo = person.profile_path ? `${IMAGE_BASE}/w185${person.profile_path}` : null;
                return (
                  <GlassCard
                    key={`${person.id}-${person.category}-${idx}`}
                    hoverEffect
                    className="p-3 rounded-2xl flex flex-col items-center text-center gap-2 border border-white/10 bg-[#0c0c10]"
                  >
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-zinc-900 border border-white/15 flex-none">
                      {photo ? (
                        <Image src={photo} alt={person.name} fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-zinc-600 text-xs font-bold">
                          {person.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 w-full">
                      <h4 className="text-xs font-bold text-white truncate">{person.name}</h4>
                      <p className="text-[10px] text-zinc-400 truncate mt-0.5">{person.roleName}</p>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="max-h-[380px] overflow-y-auto no-scrollbar space-y-2 p-1">
            {filteredPeople.map((person, idx) => {
              const photo = person.profile_path ? `${IMAGE_BASE}/w185${person.profile_path}` : null;
              return (
                <div
                  key={`${person.id}-${person.category}-${idx}`}
                  className="flex items-center justify-between p-2.5 rounded-2xl border border-white/10 bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-zinc-900 border border-white/10 flex-none">
                      {photo ? (
                        <Image src={photo} alt={person.name} fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-[10px] text-zinc-500 font-bold">
                          {person.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{person.name}</p>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider capitalize">
                        {person.category}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-zinc-300 font-medium px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                    {person.roleName}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Explore More Related Media Section */}
      {relatedItems.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white" />
            <h3 className="text-base font-bold text-white">More Like This</h3>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-2">
            {relatedItems.map((item) => {
              const itemTitle = item.title || item.name || "Untitled";
              const itemPoster = item.poster_path ? `${IMAGE_BASE}/w342${item.poster_path}` : null;

              return (
                <Link key={item.id} href={`/details/${item.id}?type=${type}`} className="flex-none w-32 sm:w-40 group">
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
                          sizes="160px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-zinc-600 text-xs">
                          No Poster
                        </div>
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
        season={1}
        episodes={episodes}
        posterPath={details.poster_path}
      />
    </div>
  );
}
