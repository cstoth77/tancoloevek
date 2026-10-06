"use client";
import { useState } from "react";
import { site } from "@/content/site";
import { BoardHeading } from "./BoardHeading";

/** Kartoték-lap a címmel, nagy útvonal-gomb, és kattintásra betöltődő térkép (addig nincs harmadik féltől származó süti). */
export function Venue() {
  const v = site.venue;
  const [showMap, setShowMap] = useState(false);
  return (
    <section id="helyszin" aria-labelledby="helyszin-title" className="py-12 md:py-16">
      <div className="mx-auto grid max-w-[1360px] gap-8 px-4 md:grid-cols-12 md:items-start md:px-8">
        <BoardHeading id="helyszin-title" className="md:col-span-12 md:justify-self-start">
          Helyszín
        </BoardHeading>
        <div className="relative bg-sun px-5 pb-8 pt-10 text-sun-ink md:col-span-12 md:grid md:grid-cols-12 md:gap-x-10 md:px-10 md:pb-10 md:pt-12">
          <span aria-hidden className="absolute -top-3 right-16 h-7 w-24 rotate-[5deg] bg-powder/80" />
          <address className="not-italic md:col-span-7">
            <span className="block font-display text-[clamp(1.6rem,4vw,2.6rem)] font-bold uppercase leading-[1.1]">{v.name}</span>
            <span className="mt-4 block text-2xl font-semibold">
              {v.zip} {v.city}, {v.street}
            </span>
            <span className="mt-1 block text-xl">{v.directions}</span>
          </address>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row md:col-span-5 md:mt-0 md:flex-col md:self-center">
            <a href={v.mapsUrl} target="_blank" rel="noopener" className="inline-flex min-h-12 items-center justify-center rounded-[3px] bg-clay px-7 text-lg font-semibold text-felt">
              Útvonaltervezés
            </a>
            {!showMap && (
              <button type="button" onClick={() => setShowMap(true)} className="inline-flex min-h-12 items-center justify-center rounded-[3px] border-2 border-sun-ink px-7 text-lg font-semibold">
                Térkép megjelenítése
              </button>
            )}
          </div>
          {!showMap && <p className="mt-3 text-base md:col-span-12">A térkép a Google Maps-ről töltődik be.</p>}
          {showMap && (
            <div className="mt-8 aspect-[4/3] w-full border-4 border-sun-ink/80 md:col-span-12 md:aspect-[16/7]">
              <iframe title={`Térkép: ${v.name}`} src={v.mapsEmbedUrl} className="h-full w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
