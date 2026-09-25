"use client";

import React, { useState } from "react";
import { Link2, Play, X } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";

interface CustomStreamModalProps {
  onPlayCustomUrl: (url: string, name: string) => void;
}

export const CustomStreamModal = ({ onPlayCustomUrl }: CustomStreamModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    onPlayCustomUrl(url.trim(), name.trim() || "Custom Stream");
    setUrl("");
    setName("");
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel text-xs text-white border border-white/15 hover:bg-white/10 transition"
      >
        <Link2 className="w-3.5 h-3.5 text-zinc-300" />
        <span>Paste IPTV Link</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md p-5 rounded-2xl glass-panel bg-[#0d0d10] border border-white/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-white" />
                <h3 className="text-sm font-semibold text-white">Play Custom VLC / IPTV Link</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">
                  Stream URL (.m3u8, .mp4, or HLS)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/live/channel.m3u8"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">
                  Channel Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="My IPTV Channel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <GlassButton variant="primary" className="text-xs py-1.5 px-4">
                  <Play className="w-3.5 h-3.5 fill-black" />
                  Play Stream
                </GlassButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
