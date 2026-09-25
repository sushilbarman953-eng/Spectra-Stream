"use client";

import { useEffect } from "react";
import { storage } from "@/lib/storage";

interface ProgressRecorderProps {
  id: string;
  type: "movie" | "tv";
  title: string;
  poster: string;
  season?: number;
  episode?: number;
}

export const ProgressRecorder = ({
  id,
  type,
  title,
  poster,
  season,
  episode,
}: ProgressRecorderProps) => {
  useEffect(() => {
    storage.saveProgress({
      id,
      type,
      title,
      poster,
      season,
      episode,
    });
  }, [id, type, title, poster, season, episode]);

  return null;
};
