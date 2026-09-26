import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavigationShell } from "@/components/NavigationShell";
import { BottomNav } from "@/components/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spectra Cinema",
  description: "Next-gen Indian OTT streaming platform with multi-audio support.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#08080c] text-white antialiased`}>
        <NavigationShell>{children}</NavigationShell>
        <BottomNav />
      </body>
    </html>
  );
}
