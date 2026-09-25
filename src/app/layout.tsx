import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Spectra | Stream Minimalist",
  description: "Monochrome & Glass streaming experience for Movies, Shows, and Anime.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#050505] text-zinc-200 min-h-screen selection:bg-white selection:text-black">
        {/* Subtle Ambient Background Gradients */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-white/[0.03] blur-[140px] rounded-full" />
          <div className="absolute top-1/3 -left-40 w-[400px] h-[400px] bg-white/[0.015] blur-[120px] rounded-full" />
        </div>

        <Navbar />
        <main className="relative z-10 pt-20 pb-16">{children}</main>
      </body>
    </html>
  );
}
