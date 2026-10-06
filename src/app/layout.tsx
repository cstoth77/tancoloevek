import type { Metadata } from "next";
import { Atkinson_Hyperlegible_Next, Unbounded } from "next/font/google";
import "./globals.css";

const display = Unbounded({ subsets: ["latin", "latin-ext"], variable: "--font-display-face", display: "swap" });
const body = Atkinson_Hyperlegible_Next({ subsets: ["latin", "latin-ext"], variable: "--font-body-face", display: "swap", adjustFontFallback: false });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Hallgat Hanna – táncórák Rákoskeresztúron",
  description: "Anya–baba tánc és Táncoló Évek 50+ táncórák az Allstars Dance Studióban. Ingyenes próbaóra.",
  openGraph: { locale: "hu_HU", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu" className={`${display.variable} ${body.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
