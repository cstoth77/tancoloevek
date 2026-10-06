import { describe, expect, test } from "vitest";
import { formatSlot, slotParts, slotShort, visibleSlots } from "@/lib/schedule";
import type { Slot } from "@/content/site";

const weeklyTue: Slot = { kind: "weekly", weekday: "kedd", start: "18:00", end: "19:00" };
const weeklyWed: Slot = { kind: "weekly", weekday: "szerda", start: "10:00", end: "11:00" };
const once: Slot = { kind: "once", date: "2026-10-14", start: "9:00", end: "10:00", label: "Első óra" };

describe("formatSlot", () => {
  test("heti időpont ragozott nappal", () => {
    expect(formatSlot(weeklyTue)).toBe("Minden kedden 18:00–19:00");
    expect(formatSlot(weeklyWed)).toBe("Minden szerdán 10:00–11:00");
    expect(formatSlot({ ...weeklyTue, weekday: "vasárnap" })).toBe("Minden vasárnap 18:00–19:00");
    expect(formatSlot({ ...weeklyTue, weekday: "csütörtök" })).toBe("Minden csütörtökön 18:00–19:00");
  });
  test("egyszeri időpont dátummal és nappal", () => {
    expect(formatSlot(once)).toBe("Első óra: 2026. október 14., szerda · 9:00–10:00");
  });
});

describe("visibleSlots", () => {
  test("a jövőbeli és a mai egyszeri időpont látszik", () => {
    expect(visibleSlots([once], new Date("2026-10-06T12:00:00+02:00"))).toEqual([once]);
    expect(visibleSlots([once], new Date("2026-10-14T08:00:00+02:00"))).toEqual([once]);
  });
  test("a lejárt egyszeri időpont eltűnik, a heti marad", () => {
    expect(visibleSlots([once, weeklyWed], new Date("2026-10-15T08:00:00+02:00"))).toEqual([weeklyWed]);
  });
  test("UTC éjfél előtt már budapesti másnap számít", () => {
    expect(visibleSlots([once], new Date("2026-10-14T22:30:00Z"))).toEqual([]);
  });
});

describe("slotParts", () => {
  test("heti: nap és idő külön", () => {
    expect(slotParts(weeklyTue)).toEqual({ day: "Minden kedden", time: "18:00–19:00" });
  });
  test("egyszeri: címke, dátum és idő", () => {
    expect(slotParts(once)).toEqual({ day: "Első óra: 2026. október 14., szerda", time: "9:00–10:00" });
  });
});

describe("slotShort (betűtábla-sor)", () => {
  test("heti: nap + kezdés nagybetűvel", () => {
    expect(slotShort(weeklyTue)).toBe("KEDD 18:00");
    expect(slotShort(weeklyWed)).toBe("SZERDA 10:00");
  });
  test("egyszeri: rövid dátum + nap + kezdés", () => {
    expect(slotShort(once)).toBe("OKT. 14. SZERDA 9:00");
  });
});
