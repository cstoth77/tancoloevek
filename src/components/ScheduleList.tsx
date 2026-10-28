"use client";
import type { Slot } from "@/content/site";
import { slotParts, visibleSlotsOn } from "@/lib/schedule";
import { useBudapestToday } from "@/lib/use-budapest-today";
import { SlotText } from "./SlotText";

/** Az időpontok közvetlenül a papírlapon – a lap legnagyobb betűi. */
export function ScheduleList({ slots, serverToday }: { slots: Slot[]; serverToday: string }) {
  const shown = visibleSlotsOn(slots, useBudapestToday(serverToday));
  if (shown.length === 0) {
    return <p className="font-display text-xl font-semibold uppercase leading-snug">Írj nekem az aktuális időpontokért!</p>;
  }
  return (
    <ul className="grid gap-4 border-y-2 border-dashed border-current/35 py-5">
      {shown.map((s) => {
        const { day, time } = slotParts(s);
        return (
          <li key={`${day}${time}`}>
            <p className="text-base font-semibold uppercase tracking-[0.16em]">{day}</p>
            <p className="whitespace-nowrap font-display text-[clamp(1.6rem,10.5cqi,3.6rem)] font-bold leading-[1.1] tabular-nums">
              <SlotText text={time} />
            </p>
          </li>
        );
      })}
    </ul>
  );
}
