"use client";

import React, { useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { soundFx } from "@/lib/soundFx";

const TAB_ORDER = [
  { path: "/", index: 0 },
  { path: "/movies", index: 1 },
  { path: "/series", index: 2 },
  { path: "/anime", index: 3 },
  { path: "/tv", index: 4 },
];

export const CategorySwipeProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  const touchStart = useRef<{ x: number; y: number; time: number; isExcluded: boolean } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const isCatalog = TAB_ORDER.some((t) => t.path === pathname);
    if (!isCatalog || e.touches.length !== 1) return;

    let target = e.target as HTMLElement | null;
    let isInsideHorizontalShelf = false;

    while (target && target !== document.body) {
      if (
        target.classList.contains("no-scrollbar") ||
        target.getAttribute("data-prevent-swipe") === "true" ||
        target.tagName === "INPUT" ||
        target.tagName === "VIDEO"
      ) {
        isInsideHorizontalShelf = true;
        break;
      }
      target = target.parentElement;
    }

    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now(),
      isExcluded: isInsideHorizontalShelf,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current || touchStart.current.isExcluded) {
      touchStart.current = null;
      return;
    }

    const deltaX = e.changedTouches[0].clientX - touchStart.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStart.current.y;
    const deltaTime = Date.now() - touchStart.current.time;

    touchStart.current = null;

    if (deltaTime < 500 && Math.abs(deltaX) > 65 && Math.abs(deltaX) > Math.abs(deltaY) * 1.8) {
      const currentIdx = TAB_ORDER.findIndex((t) => t.path === pathname);
      if (currentIdx === -1) return;

      const total = TAB_ORDER.length;

      // Play tactical audio click + vibration
      soundFx.playTabShift();
      if (navigator.vibrate) navigator.vibrate(10);

      if (deltaX < 0) {
        const nextIndex = (currentIdx + 1) % total;
        router.push(TAB_ORDER[nextIndex].path);
      } else if (deltaX > 0) {
        const prevIndex = (currentIdx - 1 + total) % total;
        router.push(TAB_ORDER[prevIndex].path);
      }
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="min-h-screen w-full flex flex-col"
    >
      {children}
    </div>
  );
};
