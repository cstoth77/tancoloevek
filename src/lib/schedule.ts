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

export function formatSlot(slot: Slot): string {
  const time = `${slot.start}–${slot.end}`;
  if (slot.kind === "weekly") return `Minden ${ON_DAY[slot.weekday]} ${time}`;
  const { y, m, d, weekday } = parseDate(slot.date);
  return `${slot.label}: ${y}. ${MONTHS[m - 1]} ${d}., ${weekday} · ${time}`;
}

/** Budapesti naptári nap (YYYY-MM-DD) – a Vercel UTC-ben fut. */
function budapestDay(now: Date): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Budapest" }).format(now);
}

export function visibleSlots(slots: Slot[], now: Date): Slot[] {
  const today = budapestDay(now);
  return slots.filter((s) => s.kind === "weekly" || s.date >= today);
}
