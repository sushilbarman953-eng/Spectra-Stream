"use client";

import React, { useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

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
    // Only enable category swiping on catalog tabs
    const isCatalog = TAB_ORDER.some((t) => t.path === pathname);
    if (!isCatalog || e.touches.length !== 1) return;

    // Check if touch originates inside an internal horizontal scroller
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

    // Must be a decisive horizontal flick (< 500ms, > 65px distance, mostly horizontal)
    if (deltaTime < 500 && Math.abs(deltaX) > 65 && Math.abs(deltaX) > Math.abs(deltaY) * 1.8) {
      const currentIdx = TAB_ORDER.findIndex((t) => t.path === pathname);
      if (currentIdx === -1) return;

      // Swipe Right to Left (Finger moves left -> Next Tab)
      if (deltaX < 0 && currentIdx < TAB_ORDER.length - 1) {
        if (navigator.vibrate) navigator.vibrate(10);
        router.push(TAB_ORDER[currentIdx + 1].path);
      }
      // Swipe Left to Right (Finger moves right -> Prev Tab)
      else if (deltaX > 0 && currentIdx > 0) {
        if (navigator.vibrate) navigator.vibrate(10);
        router.push(TAB_ORDER[currentIdx - 1].path);
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
