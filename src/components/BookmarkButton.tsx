"use client";

import React, { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { storage, SavedMedia } from "@/lib/storage";
import { GlassButton } from "@/components/ui/GlassButton";

export const BookmarkButton = ({ item }: { item: SavedMedia }) => {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(storage.isSaved(item.id));
  }, [item.id]);

  const toggle = () => {
    const isNowSaved = storage.toggleWatchlist(item);
    setSaved(isNowSaved);
  };

  return (
    <GlassButton
      onClick={toggle}
      variant={saved ? "primary" : "secondary"}
      className="text-xs"
    >
      {saved ? (
        <>
          <BookmarkCheck className="w-4 h-4 fill-black" />
          In Watchlist
        </>
      ) : (
        <>
          <Bookmark className="w-4 h-4" />
          Add to Watchlist
        </>
      )}
    </GlassButton>
  );
};
