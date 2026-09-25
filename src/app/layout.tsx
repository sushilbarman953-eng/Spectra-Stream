import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { InstallPrompt } from "@/components/InstallPrompt";

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
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[450px] bg-white/[0.03] blur-[140px] rounded-full" />
          <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] bg-white/[0.02] blur-[120px] rounded-full" />
        </div>

        <Navbar />
        <InstallPrompt />
        <main className="relative z-10 pt-20">{children}</main>
        <MobileBottomNav />

        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then((reg) => {
                  console.log('SW Registered:', reg.scope);
                }).catch((err) => {
                  console.error('SW Error:', err);
                });
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
