import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export const metadata: Metadata = {
  title: "Spectra | Stream Minimalist",
  description: "Monochrome & Glass streaming experience for Movies, Shows, and Anime.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Spectra",
  },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#08080a] text-zinc-200 min-h-screen selection:bg-white selection:text-black pb-20 md:pb-6">
        {/* Subtle Ambient Background Gradients */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[450px] bg-white/[0.03] blur-[140px] rounded-full" />
          <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] bg-white/[0.02] blur-[120px] rounded-full" />
        </div>

        <Navbar />
        <main className="relative z-10 pt-20">{children}</main>
        <MobileBottomNav />
      </body>
    </html>
  );
}
