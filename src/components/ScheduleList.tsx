import type { Slot } from "@/content/site";
import { slotParts, visibleSlots } from "@/lib/schedule";
import { SlotText } from "./SlotText";

/** Mini betűtábla: sötét filc, hornyok, nagybetűs időpontok – az oldal legnagyobb információja. */
export function ScheduleList({ slots }: { slots: Slot[] }) {
  const shown = visibleSlots(slots, new Date());
  return (
    <div className="rounded-[4px] bg-felt bg-[repeating-linear-gradient(to_bottom,transparent_0_7px,rgb(255_255_255/0.06)_7px_8px)] px-5 py-6 text-letter md:px-8">
      {shown.length === 0 ? (
        <p className="font-display text-xl font-semibold uppercase leading-snug">Írj nekem az aktuális időpontokért!</p>
      ) : (
        <ul className="grid gap-5">
          {shown.map((s) => {
            const { day, time } = slotParts(s);
            return (
              <li key={`${day}${time}`}>
                <p className="text-sm uppercase tracking-[0.22em] text-letter-soft">{day}</p>
                <p className="whitespace-nowrap font-display text-[clamp(1.6rem,7.2vw,4rem)] font-bold leading-[1.1] tabular-nums">
                  <SlotText text={time} />
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
