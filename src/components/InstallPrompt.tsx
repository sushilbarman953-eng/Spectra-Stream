"use client";

import React, { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed top-20 left-4 right-4 z-50 flex items-center justify-between p-3.5 rounded-2xl glass-panel bg-black/90 border border-white/20 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-white/10 border border-white/15">
          <Download className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-xs font-semibold text-white">Install Spectra App</p>
          <p className="text-[10px] text-zinc-400">Launch fullscreen from home screen</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <GlassButton
          onClick={handleInstallClick}
          variant="primary"
          className="text-xs py-1.5 px-3"
        >
          Install
        </GlassButton>
        <button
          onClick={() => setShowPrompt(false)}
          className="p-1.5 text-zinc-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
