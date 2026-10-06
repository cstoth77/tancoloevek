"use client";
import { useState } from "react";
import { site } from "@/content/site";

/** Cím + kattintásra betöltődő térkép (addig nincs harmadik féltől származó süti). */
export function Venue() {
  const v = site.venue;
  const [showMap, setShowMap] = useState(false);
  return (
    <section id="helyszin" aria-labelledby="helyszin-title" className="border-t border-letter/10">
      <div className="mx-auto grid max-w-[1360px] gap-10 px-4 py-20 md:grid-cols-12 md:px-8 md:py-32">
        <div className="md:col-span-5">
          <h2 id="helyszin-title" className="font-display text-[clamp(2.2rem,5vw,4rem)] font-bold uppercase leading-[1.1]">
            Helyszín
          </h2>
          <address className="mt-6 text-xl not-italic">
            <strong className="font-display text-2xl font-semibold uppercase">{v.name}</strong>
            <br />
            {v.zip} {v.city}, {v.street}
            <br />
            <span className="text-letter-soft">{v.directions}</span>
          </address>
          <a href={v.mapsUrl} target="_blank" rel="noopener" className="mt-6 inline-flex min-h-11 items-center underline underline-offset-4">
            Útvonaltervezés
          </a>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-letter/15 bg-felt-raised md:col-span-7">
          {showMap ? (
            <iframe title={`Térkép: ${v.name}`} src={v.mapsEmbedUrl} className="h-full w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          ) : (
            <button type="button" onClick={() => setShowMap(true)} className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
              <span className="font-display text-xl font-semibold uppercase">Térkép megjelenítése</span>
              <span className="max-w-[36ch] text-letter-soft">A térkép a Google Maps-ről töltődik be.</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
