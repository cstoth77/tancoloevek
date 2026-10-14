import type { Metadata } from "next";
import { Atkinson_Hyperlegible_Next, Martian_Mono, Unbounded } from "next/font/google";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const display = Unbounded({ subsets: ["latin", "latin-ext"], variable: "--font-display-face", display: "swap" });
const board = Martian_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-board-face", axes: ["wdth"], display: "swap" });
const body = Atkinson_Hyperlegible_Next({ subsets: ["latin", "latin-ext"], variable: "--font-body-face", display: "swap", adjustFontFallback: false });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: "Táncoló Évek – Hallgat Hanna táncórái Rákoskeresztúron",
  description: "Anya–baba tánc és Táncoló Évek 50+ táncórák az Allstars Dance Studióban.",
  openGraph: { locale: "hu_HU", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu" className={`${display.variable} ${body.variable} ${board.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
