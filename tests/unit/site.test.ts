import { expect, test } from "vitest";
import { site } from "@/content/site";
import { formatSlot } from "@/lib/schedule";

test("plakát szerinti időpontok", () => {
  const bySlug = Object.fromEntries(site.classes.map((c) => [c.slug, c.slots.map(formatSlot)]));
  expect(bySlug["anya-baba"]).toEqual(["Első óra: 2026. október 14., szerda · 9:00–10:00"]);
  expect(bySlug["tancolo-evek"]).toEqual(["Minden kedden 18:00–19:00", "Minden szerdán 10:00–11:00"]);
});

test("helyszín és elérhetőség a plakát szerint", () => {
  expect(`${site.venue.zip} ${site.venue.city}, ${site.venue.street}`).toBe("1173 Budapest, Pesti út 193.");
  expect(site.contact.email).toBe("tancoloevek@gmail.com");
});
