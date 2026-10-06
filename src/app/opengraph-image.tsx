import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/content/site";

export const alt = `${site.teacher.name} – táncórák Rákoskeresztúron`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [font, poster] = await Promise.all([
    readFile(join(process.cwd(), "assets/Unbounded-Bold.ttf")),
    readFile(join(process.cwd(), "public/media/hero-poster.jpg")),
  ]);
  const bg = `data:image/jpeg;base64,${poster.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#1f1713" }}>
        <img src={bg} alt="" width={1200} height={675} style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, background: "rgba(31,23,19,0.6)" }} />
        <div style={{ position: "absolute", left: 64, bottom: 64, display: "flex", flexDirection: "column", color: "#f4ece0", fontFamily: "Unbounded" }}>
          <div style={{ fontSize: 26, letterSpacing: 6, color: "#c4b6a6" }}>TÁNCÓRÁK RÁKOSKERESZTÚRON</div>
          <div style={{ fontSize: 88, lineHeight: 1.1, marginTop: 16 }}>{site.teacher.name.toUpperCase()}</div>
          <div style={{ fontSize: 30, marginTop: 20, color: "#d9774a" }}>Anya–baba tánc · Táncoló Évek 50+</div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Unbounded", data: font, style: "normal", weight: 700 }] },
  );
}
