import { site } from "@/content/site";
import { slotShort, visibleSlots } from "@/lib/schedule";

/** A hero cserélhető betűs táblája: mindkét óra időpontja már az első képernyőn. */
export function Letterboard() {
  const now = new Date();
  return (
    <div className="letterboard border-4 border-[#a39a8f] px-5 py-5 md:px-8 md:py-7" aria-labelledby="tabla-title">
      <p id="tabla-title" className="text-lg font-semibold uppercase leading-[2.25rem] tracking-[0.24em] text-letter-soft">
        Óra<span className="board-crooked">r</span>end
      </p>
      <ul className="grid gap-3">
        {site.classes.map((c) => {
          const slots = visibleSlots(c.slots, now);
          return (
            <li key={c.slug}>
              <a href={`#${c.slug}-title`} className="group block uppercase">
                <span className="block text-base font-semibold leading-[2.25rem] tracking-[0.16em] text-sun group-hover:underline">{c.shortTitle}</span>
                {(slots.length ? slots.map(slotShort) : ["Írj az időpontért"]).map((line) => (
                  <span key={line} className="block whitespace-nowrap text-[clamp(1.15rem,5vw,1.9rem)] font-bold leading-[2.25rem] tracking-[0.08em] tabular-nums">
                    {line}
                  </span>
                ))}
              </a>
            </li>
          );
        })}
      </ul>
      <a href="#kapcsolat" className="mt-2 inline-flex min-h-11 items-center text-base font-semibold uppercase tracking-[0.2em] text-clay underline-offset-4 hover:underline">
        Ingyenes próbaóra →
      </a>
    </div>
  );
}
