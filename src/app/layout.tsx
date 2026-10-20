import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { SearchProvider } from "@/context/SearchContext";
import { SearchModal } from "@/components/SearchModal";
import { CategorySwipeProvider } from "@/components/CategorySwipeProvider";
import { AuthProvider } from "@/lib/authContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spectra Cinema",
  description: "Monochrome frosted glass media streaming suite.",
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 1. Force Unregister All Active Service Workers
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for (var registration of registrations) {
                    registration.unregister();
                  }
                });
              }
              // 2. Clear out Cache Storage
              if ('caches' in window) {
                caches.keys().then(function(names) {
                  for (var name of names) caches.delete(name);
                });
              }
              // 3. Purge stale catalog local storage once
              if (!sessionStorage.getItem('spectra_hard_purged_v1')) {
                for (var key in localStorage) {
                  if (key.startsWith('spectra_universal_catalog')) {
                    localStorage.removeItem(key);
                  }
                }
                sessionStorage.setItem('spectra_hard_purged_v1', 'true');
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-[#08080c] text-white min-h-screen antialiased select-none overflow-x-hidden`}>
        <AuthProvider>
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
        </AuthProvider>
      </body>
    </html>
  );
}
