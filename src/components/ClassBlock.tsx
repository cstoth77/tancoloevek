import type { DanceClass } from "@/content/site";
import { budapestDay } from "@/lib/schedule";
import { PosterLightbox } from "./PosterLightbox";
import { Print } from "./Print";
import { ScheduleList } from "./ScheduleList";

const PAPER = { powder: "bg-powder text-powder-ink", sun: "bg-sun text-sun-ink" } as const;

/** Minden lap kicsit másképp van kitűzve: szög, szalag helye és színe. */
const PINNING = [
  {
    notice: "",
    noticeTape: "left-10 w-36 -rotate-[3deg] bg-sun/75",
    print: "md:-rotate-[2deg]",
    printTape: "right-6 rotate-[4deg] bg-tape/85",
  },
  {
    notice: "md:-rotate-[1.5deg]",
    noticeTape: "right-1/3 w-24 rotate-[2deg] bg-tape/85",
    print: "",
    printTape: "left-6 w-16 -rotate-[8deg] bg-powder/80",
  },
];

/** Kitűzött papírlap a filcen, mellette ragasztott fotóprint. Mobilon a lap (név, időpont) jön előbb. */
export function ClassBlock({ cls, index }: { cls: DanceClass; index: number }) {
  const flip = index % 2 === 1;
  const pin = PINNING[index % PINNING.length];
  return (
    <article aria-labelledby={`${cls.slug}-title`} className="grid gap-10 md:grid-cols-12 md:items-stretch">
      <Print
        img={cls.image}
        tape={pin.printTape}
        sizes="(min-width: 768px) 40vw, 100vw"
        className={`order-2 mx-6 aspect-[4/3] md:mx-0 md:aspect-auto ${pin.print} ${flip ? "md:order-2 md:col-span-5" : "md:order-1 md:col-span-5"}`}
      />
      <div className={`relative order-1 ${PAPER[cls.accent]} px-5 pb-8 pt-10 md:col-span-7 md:px-12 md:pb-12 md:pt-14 ${pin.notice} ${flip ? "md:order-1" : "md:order-2"}`}>
        <span aria-hidden className={`absolute -top-3 h-7 ${pin.noticeTape}`} />
        <p className="text-base font-bold uppercase tracking-[0.12em]">{cls.audience}</p>
        <h3 id={`${cls.slug}-title`} className="mt-3 scroll-mt-24 font-display text-[clamp(1.9rem,4.5vw,3.4rem)] font-bold uppercase leading-[1.1]">
          {cls.title}
        </h3>
        <p className="mt-5 max-w-[46ch] text-xl">{cls.intro}</p>
        <div className="mt-8">
          <ScheduleList slots={cls.slots} serverToday={budapestDay(new Date())} />
        </div>
        {cls.joinAnytime && <p className="mt-3 text-lg">Az órákhoz folyamatosan lehet csatlakozni.</p>}
        <ul className="mt-8 grid gap-y-2 text-lg">
          {cls.highlights.map((h) => (
            <li key={h} className="flex gap-3">
              <span aria-hidden>—</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-6">
          <a href={`/?ora=${cls.slug}#kapcsolat`} className="inline-flex min-h-12 items-center justify-center rounded-[3px] bg-clay px-7 text-lg font-semibold text-felt">
            Jelentkezem
          </a>
          <PosterLightbox poster={cls.poster} label="Plakát megtekintése" />
        </div>
      </div>
    </article>
  );
}
