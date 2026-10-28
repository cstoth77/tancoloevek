import { expect, test } from "vitest";
import { buildJsonLd } from "@/lib/jsonld";
import { site } from "@/content/site";

type Node = Record<string, unknown> & { "@type": string };

test("Person + DanceSchool mindig, Event csak jövőbeli egyszeri időpontra", () => {
  const once = { ...site.classes[0], slots: [{ kind: "once" as const, date: "2026-10-14", start: "9:00", end: "10:00", label: "Első óra" }] };
  const before = buildJsonLd(new Date("2026-10-06T12:00:00+02:00"), [once]) as Node[];
  expect(before.map((o) => o["@type"])).toEqual(["Person", "DanceSchool", "Event"]);
  const ev = before[2] as Node & { startDate: string; location: { address: { postalCode: string } } };
  expect(ev.startDate).toBe("2026-10-14T09:00:00+02:00");
  expect(ev.location.address.postalCode).toBe("1173");
  const after = buildJsonLd(new Date("2026-10-20T12:00:00+02:00"), [once]) as Node[];
  expect(after.map((o) => o["@type"])).toEqual(["Person", "DanceSchool"]);
});

test("téli dátum +01:00 eltolással", () => {
  // a budapesti offset a dátumtól függ (CET/CEST), nem lehet beégetve
  const winter = { ...site.classes[0], slots: [{ kind: "once" as const, date: "2026-12-02", start: "9:00", end: "10:00", label: "Első óra" }] };
  const out = buildJsonLd(new Date("2026-10-06T12:00:00+02:00"), [winter]) as (Node & { startDate?: string })[];
  expect(out.find((o) => o["@type"] === "Event")?.startDate).toBe("2026-12-02T09:00:00+01:00");
});
