"use client";

import React from "react";
import { MediaItem } from "@/lib/tmdb";
import { MovieCard } from "@/components/MovieCard";

interface MediaPosterCardProps {
  item: MediaItem & { rank?: number; audioLanguages?: string[] };
  href?: string;
  rank?: number;
  badgeLabel?: string;
  defaultType?: "movie" | "tv";
  widthClass?: string;
  priority?: boolean;
}

export const MediaPosterCard: React.FC<MediaPosterCardProps> = ({
  item,
  badgeLabel,
  defaultType = "movie",
  widthClass = "w-28 sm:w-32",
  priority = false,
}) => {
  const title = item.title || item.name || "Untitled";
  const targetType = item.media_type || defaultType;
  const langTag =
    badgeLabel ||
    (item.audioLanguages && item.audioLanguages.length > 1
      ? "MULTI"
      : item.audioLanguages?.[0] || "HIN");

  return (
    <div className={"flex-none " + widthClass}>
      <MovieCard
        id={item.id}
        title={title}
        posterPath={item.poster_path || ""}
        rating={item.vote_average || "8.5"}
        langBadge={langTag}
        mediaType={targetType}
        isPriority={priority}
      />
    </div>
  );
};
