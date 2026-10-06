import Image from "next/image";
import type { DanceClass } from "@/content/site";
import { PosterLightbox } from "./PosterLightbox";
import { ScheduleList } from "./ScheduleList";

const PAPER = { powder: "bg-powder text-powder-ink", sun: "bg-sun text-sun-ink" } as const;

/** Kitűzött papírlap a filcen, ragasztócsíkkal; tábla-sorokba rendezett tartalom. */
export function ClassBlock({ cls, index }: { cls: DanceClass; index: number }) {
  const flip = index % 2 === 1;
  return (
    <article aria-labelledby={`${cls.slug}-title`} className="mx-auto grid max-w-[1360px] gap-8 px-4 md:grid-cols-12 md:gap-10 md:px-8">
      <div className={`relative aspect-[4/5] overflow-hidden rounded-[28px] md:col-span-5 ${flip ? "md:order-2 md:col-start-8" : ""}`}>
        <Image src={cls.image.src} alt={cls.image.alt} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
      </div>
      <div className={`relative rounded-[4px] ${PAPER[cls.accent]} px-5 pb-8 pt-10 md:col-span-7 md:px-12 md:pb-12 md:pt-14 ${flip ? "md:order-1" : ""}`}>
        <span aria-hidden className={`absolute -top-3 h-7 w-28 bg-letter/55 ${flip ? "right-10 rotate-[3deg]" : "left-10 -rotate-[3deg]"}`} />
        <p className="text-sm font-semibold uppercase tracking-[0.22em]">{cls.audience}</p>
        <h3 id={`${cls.slug}-title`} className="mt-3 font-display text-[clamp(1.9rem,4.5vw,3.4rem)] font-bold uppercase leading-[1.1]">
          {cls.title}
        </h3>
        <p className="mt-5 max-w-[46ch] text-xl">{cls.intro}</p>
        <ul className="mt-6 grid gap-x-8 gap-y-2 text-lg md:grid-cols-2">
          {cls.highlights.map((h) => (
            <li key={h} className="border-t border-current/20 pt-2">
              {h}
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <ScheduleList slots={cls.slots} />
        </div>
        {cls.joinAnytime && <p className="mt-4 text-lg">Az órákhoz folyamatosan lehet csatlakozni.</p>}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a href={`/?ora=${cls.slug}#kapcsolat`} className="inline-flex min-h-12 items-center rounded-full bg-felt px-6 text-lg font-semibold text-letter">
            {cls.freeTrial ? "Jelentkezem ingyenes próbaórára" : "Jelentkezem"}
          </a>
          <PosterLightbox poster={cls.poster} label="Plakát megtekintése" />
        </div>
      </div>
    </article>
  );
}
