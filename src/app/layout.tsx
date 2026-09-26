import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { SearchProvider } from "@/context/SearchContext";
import { SearchModal } from "@/components/SearchModal";
import { CategorySwipeProvider } from "@/components/CategorySwipeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spectra Cinema",
  description: "Monochrome frosted glass media streaming suite.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Spectra",
  },
};

export const viewport: Viewport = {
  themeColor: "#08080c",
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
      <head>
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
      </head>
      <body className={`${inter.className} bg-[#08080c] text-white min-h-screen antialiased select-none overflow-x-hidden`}>
        <ServiceWorkerRegister />
        <SearchProvider>
          <CategorySwipeProvider>
            <Navbar />
            <main className="pt-14">
              {children}
            </main>
            <SearchModal />
            <MobileBottomNav />
          </CategorySwipeProvider>
        </SearchProvider>
      </body>
    </html>
  );
}
