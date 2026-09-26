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
  Clapperboard,
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

  // People: Cast, Directors, Producers
  const cast = details.credits?.cast?.slice(0, 10) || [];
  const crew = details.credits?.crew || [];
  const directors = crew.filter((c: any) => c.job === "Director" || c.department === "Directing");
  const producers = crew.filter((c: any) => c.job === "Producer" || c.job === "Executive Producer").slice(0, 5);
  const keyPeople = [
    ...directors.map((d: any) => ({ ...d, role: "Director" })),
    ...producers.map((p: any) => ({ ...p, role: "Producer" })),
    ...cast.map((a: any) => ({ ...a, role: a.character || "Cast" })),
  ];

  const relatedItems: MediaItem[] = details.similar?.results?.slice(0, 12) || [];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 pb-28 space-y-8">
      {/* 1. Backdrop Hero Screen */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-3xl overflow-hidden border border-white/15 bg-black shadow-2xl">
        {backdrop && (
          <Image src={backdrop} alt={title} fill priority className="object-cover opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08080a] via-transparent to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/15 text-white border border-white/20">
              {type === "tv" ? "Series / Anime" : "Feature Film"}
            </span>
            {year && <span className="text-xs text-zinc-300 font-semibold">{year}</span>}
            {details.vote_average > 0 && (
              <span className="flex items-center gap-1 text-xs text-white bg-black/60 px-2 py-0.5 rounded-md border border-white/15">
                <Star className="w-3 h-3 fill-white" />
                {details.vote_average.toFixed(1)}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">{title}</h1>

          {/* Action Buttons: Play, Add to List, Download Modal */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href={`/watch/${id}?type=${type}&season=1&episode=1`}>
              <GlassButton variant="primary" className="text-xs py-2 px-5 font-bold shadow-glow flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>Play Now</span>
              </GlassButton>
            </Link>

            <button
              onClick={toggleWatchlist}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                isSaved
                  ? "bg-white/20 text-white border-white/40"
                  : "bg-white/10 text-zinc-200 border-white/20 hover:bg-white/20"
              }`}
            >
              {isSaved ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{isSaved ? "In List" : "Add to List"}</span>
            </button>

            <button
              onClick={() => setDownloadModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 text-white border border-white/20 hover:bg-white/20 shadow-glow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Options</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Overview & Details */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-white">Overview</h3>
        <p className="text-sm text-zinc-300 leading-relaxed max-w-4xl">{details.overview}</p>
        <div className="flex flex-wrap gap-2 pt-1">
          {details.genres?.map((g: any) => (
            <span key={g.id} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-zinc-300">
              {g.name}
            </span>
          ))}
        </div>
      </div>

      {/* 3. People Section: Cast, Directors & Producers with Grid/List Toggle */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-white" />
            <h3 className="text-base font-bold text-white">Cast & Creators</h3>
          </div>

          <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/15">
            <button
              onClick={() => setPeopleView("grid")}
              className={`p-1.5 rounded-lg transition ${
                peopleView === "grid" ? "bg-white text-black shadow-glow" : "text-zinc-400 hover:text-white"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPeopleView("list")}
              className={`p-1.5 rounded-lg transition ${
                peopleView === "list" ? "bg-white text-black shadow-glow" : "text-zinc-400 hover:text-white"
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Grid View */}
        {peopleView === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {keyPeople.map((person, idx) => {
              const photo = person.profile_path ? `${IMAGE_BASE}/w185${person.profile_path}` : null;
              return (
                <GlassCard key={`${person.id}-${idx}`} hoverEffect className="p-3 rounded-2xl flex flex-col items-center text-center gap-2 border border-white/10 bg-[#0c0c10]">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-zinc-900 border border-white/15">
                    {photo ? (
                      <Image src={photo} alt={person.name} fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-zinc-600 text-xs">N/A</div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white truncate max-w-[110px]">{person.name}</h4>
                    <p className="text-[10px] text-zinc-400 truncate max-w-[110px]">{person.role}</p>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="flex flex-col gap-2">
            {keyPeople.map((person, idx) => (
              <div
                key={`${person.id}-${idx}`}
                className="flex items-center justify-between p-2.5 rounded-xl border border-white/10 bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-900 border border-white/10 relative">
                    {person.profile_path ? (
                      <Image src={`${IMAGE_BASE}/w185${person.profile_path}`} alt={person.name} fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-[9px] text-zinc-600">N/A</div>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-white">{person.name}</span>
                </div>
                <span className="text-xs text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                  {person.role}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Explore / Related Media Section */}
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
                  <GlassCard hoverEffect className="overflow-hidden border border-white/10 rounded-2xl h-full flex flex-col justify-between bg-[#0c0c10]">
                    <div className="relative aspect-[2/3] w-full bg-zinc-950">
                      {itemPoster ? (
                        <Image src={itemPoster} alt={itemTitle} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-zinc-600 text-xs">No Poster</div>
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
