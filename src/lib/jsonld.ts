import { site, type DanceClass } from "@/content/site";
import { visibleSlots } from "./schedule";

/** A budapesti UTC-eltolás egy adott napon ("+01:00" télen, "+02:00" nyáron). */
function budapestOffset(date: string): string {
  const name = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Budapest", timeZoneName: "longOffset" })
    .formatToParts(new Date(`${date}T12:00:00Z`))
    .find((p) => p.type === "timeZoneName")?.value; // pl. "GMT+02:00"
  return name?.replace("GMT", "") || "+01:00";
}

const iso = (date: string, time: string) => `${date}T${time.padStart(5, "0")}:00${budapestOffset(date)}`;

export function buildJsonLd(now: Date, classes: DanceClass[] = site.classes): object[] {
  const v = site.venue;
  const address = { "@type": "PostalAddress", streetAddress: v.street, postalCode: v.zip, addressLocality: v.city, addressCountry: "HU" };
  const place = { "@type": "Place", name: v.name, address };
  const out: object[] = [
    { "@context": "https://schema.org", "@type": "Person", name: site.teacher.name, jobTitle: site.teacher.role, email: site.contact.email },
    { "@context": "https://schema.org", "@type": "DanceSchool", name: site.name, email: site.contact.email, address },
  ];
  for (const c of classes) {
    for (const s of visibleSlots(c.slots, now)) {
      if (s.kind !== "once") continue;
      out.push({
        "@context": "https://schema.org",
        "@type": "Event",
        name: c.title,
        description: c.intro,
        startDate: iso(s.date, s.start),
        endDate: iso(s.date, s.end),
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: place,
        organizer: { "@type": "Person", name: site.teacher.name },
        isAccessibleForFree: c.freeTrial,
      });
    }
  }
  return out;
}
