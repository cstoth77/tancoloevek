import type { Slot, Weekday } from "@/content/site";

const ON_DAY: Record<Weekday, string> = {
  hétfő: "hétfőn",
  kedd: "kedden",
  szerda: "szerdán",
  csütörtök: "csütörtökön",
  péntek: "pénteken",
  szombat: "szombaton",
  vasárnap: "vasárnap",
};
const MONTHS = ["január", "február", "március", "április", "május", "június", "július", "augusztus", "szeptember", "október", "november", "december"];
const DAYS: Weekday[] = ["vasárnap", "hétfő", "kedd", "szerda", "csütörtök", "péntek", "szombat"];

function parseDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d, weekday: DAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()] };
}

/** Az időpont két része: a nap (kisebb sor) és az idő (a tábla nagy betűi). */
export function slotParts(slot: Slot): { day: string; time: string } {
  const time = `${slot.start}–${slot.end}`;
  if (slot.kind === "weekly") return { day: `Minden ${ON_DAY[slot.weekday]}`, time };
  const { y, m, d, weekday } = parseDate(slot.date);
  return { day: `${slot.label}: ${y}. ${MONTHS[m - 1]} ${d}., ${weekday}`, time };
}

export function formatSlot(slot: Slot): string {
  const { day, time } = slotParts(slot);
  return slot.kind === "weekly" ? `${day} ${time}` : `${day} · ${time}`;
}

/** Budapesti naptári nap (YYYY-MM-DD) – a Vercel UTC-ben fut. */
export function budapestDay(now: Date): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Budapest" }).format(now);
}

/** A heti időpontok mindig, az egyszeri időpontok a megadott (budapesti) naptól látszanak. */
export function visibleSlotsOn(slots: Slot[], today: string): Slot[] {
  return slots.filter((s) => s.kind === "weekly" || s.date >= today);
}

export function visibleSlots(slots: Slot[], now: Date): Slot[] {
  return visibleSlotsOn(slots, budapestDay(now));
}

const MONTHS_SHORT = ["JAN.", "FEBR.", "MÁRC.", "ÁPR.", "MÁJ.", "JÚN.", "JÚL.", "AUG.", "SZEPT.", "OKT.", "NOV.", "DEC."];

/** Tömör, nagybetűs sor a hero betűtáblájához (csak a kezdés időpontja). */
export function slotShort(slot: Slot): string {
  if (slot.kind === "weekly") return `${slot.weekday.toUpperCase()} ${slot.start}`;
  const { m, d, weekday } = parseDate(slot.date);
  return `${MONTHS_SHORT[m - 1]} ${d}. ${weekday.toUpperCase()} ${slot.start}`;
}
