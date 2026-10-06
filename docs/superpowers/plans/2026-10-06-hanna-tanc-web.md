# Hallgat Hanna táncórák weboldal – Implementációs terv

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Egyoldalas, magyar nyelvű, Vercelen futó weboldal, amely Hallgat Hanna két táncóráját (anya–baba, Táncoló Évek 50+) mutatja be looping hero videóval, órarenddel, helyszínnel és kapcsolati űrlappal.

**Architecture:** Next.js 16 App Router, statikusan generált egyetlen oldal (`/`). Minden tartalom egyetlen típusos adatfájlból (`src/content/site.ts`) jön, a megjelenítési logika (időpont-formázás, űrlap-validáció, e-mail, JSON-LD) tiszta függvényekben van (`src/lib/*`) unit tesztekkel. Az egyetlen szerveroldali kód a kapcsolati Server Action (Resend). A médiát (videó, képek) egy lokális Node-script generálja a fal.ai-on, ffmpeg optimalizálja, az eredmény a `public/media/` mappába kerül és commitolva van, így a Vercel build nem hív külső API-t.

**Tech Stack:** Next.js 16.3, React 19, TypeScript (strict), Tailwind CSS 4.3, motion 14, zod 4, resend 6, @fal-ai/client 1.10, Vitest 5, @playwright/test 1.63, ffmpeg 8 (lokálisan, `/opt/homebrew/bin/ffmpeg`), Node 25.

**Spec:** `docs/superpowers/specs/2026-10-06-hanna-tanc-web-design.md` (system prompt: `SYSTEM_PROMPT.md`)

## Global Constraints

- Nyelv: minden UI-szöveg magyar, tegező, meleg hangvétel; `<html lang="hu">`. Emoji nincs az UI-ban.
- Adat: minden időpont, cím, e-mail a plakátokból/`description`-ből jön; ellentmondásnál a plakát nyer. Telefonszámot, árat NEM találunk ki.
- Hannáról AI-kép soha nem készül. A portré helye `public/media/hanna.jpg` (arc nélküli helykitöltő, fájlcserével lecserélhető).
- Fontok: `next/font/google`, `subsets: ['latin', 'latin-ext']` (ő, ű kötelező).
- Alap betűméret ≥ 18px; kattintható elemek ≥ 44×44px; WCAG 2.1 AA kontraszt.
- Hero videó: `autoplay muted loop playsInline`, poster kép, mp4 (H.264) + webm, egyenként ≤ 3 MB; `prefers-reduced-motion: reduce` esetén csak poster.
- Anti-AI-design: nincs kék-fehér SaaS hero, nincs középre zárt hero + 3 egyforma kártya, nincs mindenhol `rounded-2xl`, nincs öncélú gradiens/glow/árnyék.
- Titkok: `FAL_KEY` csak `.env.local`-ban (gitignored), `RESEND_API_KEY`, `CONTACT_TO_EMAIL` csak Vercel env-ben / `.env.local`-ban. Kliensre semmi nem kerül (`NEXT_PUBLIC_` prefix tilos ezekre).
- Kész: `npm run build`, `npm run lint`, `npm test`, `npm run e2e` zöld; Lighthouse mobil Perf ≥ 90, A11y ≥ 95, SEO = 100; critic ≥ 9/10.
- Deploy: GitHub repo → Vercel Git-integráció; `main` = production. Push és repó-létrehozás csak kifejezett felhasználói jóváhagyással.
- Commit üzenetek végén: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`

## Review Focus

1. **Lejárt egyszeri időpont** – az anya–baba „Első óra: 2026. okt. 14.” a dátum után nem jelenhet meg jövőbeli ígéretként; elvárás: a múltbeli egyszeri időpont eltűnik, helyette „Írj az aktuális időpontokért” szöveg. → teszt: Task 2 (`visibleSlots`).
2. **Hiányzó Resend kulcs éles környezetben** – az űrlap ne dobjon 500-at; elvárás: kulcs nélkül az űrlap helyén mailto-gomb, a Server Action pedig kulcs hiányában barátságos hibát ad. → teszt: Task 9 (`sendContact` kulcs nélkül) + Task 11 e2e.
3. **Kártékony / hosszú űrlap-bevitel** – HTML a névben, 10 000 karakteres üzenet, sortörés a tárgyban; elvárás: plain-text e-mail, a tárgy egysoros és vágott, a túl hosszú üzenet validációs hibát kap. → teszt: Task 9 (`buildEmail`, `contactSchema`).
4. **Spam bot kitölti a honeypotot** – elvárás: „sikeres” válasz, de nincs e-mail küldés. → teszt: Task 9.
5. **Mozgásérzékeny / lassú netes látogató** – reduced-motion esetén nincs `<video>` a DOM-ban, csak poster kép. → teszt: Task 11 e2e.

---

## Fájlstruktúra

```
src/
  app/
    layout.tsx            # fontok, metadata, <html lang="hu">
    page.tsx              # szekciók összerakása, JSON-LD
    globals.css           # Tailwind v4 @theme tokenek
    actions/contact.ts    # 'use server' sendContact
    sitemap.ts, robots.ts, opengraph-image.tsx
  content/site.ts         # MINDEN tartalom + típusok
  lib/
    schedule.ts           # időpont-formázás, láthatóság
    contact.ts            # zod séma, buildEmail
    jsonld.ts             # schema.org objektumok
  components/
    Nav.tsx, Hero.tsx, LoopVideo.tsx, ClassBlock.tsx, ScheduleList.tsx,
    PosterLightbox.tsx, About.tsx, Venue.tsx, ContactSection.tsx,
    ContactForm.tsx, Footer.tsx
tests/unit/*.test.ts      # Vitest
tests/e2e/*.spec.ts       # Playwright
scripts/generate-media.mjs, scripts/encode-media.sh
media/PROMPTS.md, media/raw/ (gitignored)
public/media/             # végleges, optimalizált média
public/posters/           # a két plakát
docs/design-direction.md  # seed-ből levezetett irány
```

---

### Task 1: Projekt-váz és tesztkörnyezet

**Files:**
- Create: Next.js váz (`create-next-app`), `vitest.config.ts`, `playwright.config.ts`, `tests/unit/smoke.test.ts`
- Modify: `package.json` (scripts), `.gitignore`

**Interfaces:**
- Produces: `npm test` (vitest run), `npm run e2e` (playwright), `@/` alias → `src/`

- [ ] **Step 1: Váz létrehozása a meglévő repóba**

A repóban már van `description`, `images/`, `docs/`, `SYSTEM_PROMPT.md`, `.gitignore`, `.env.local`. A `create-next-app` nem üres könyvtárba nem ír, ezért ideiglenes mappába generálunk és átmásolunk:

```bash
cd /Users/cstoth/ai_works
npx create-next-app@16 dance-web-tmp --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-turbopack --yes
rsync -a --exclude .git --exclude .gitignore --exclude README.md dance-web-tmp/ dance-web/
rm -rf dance-web-tmp
cd dance-web
npm install motion@14 zod@4 resend@6
npm install -D vitest@5 @playwright/test@1.63 @fal-ai/client@1.10
npx playwright install chromium
```

- [ ] **Step 2: `.gitignore` kiegészítése**

Hozzáfűzni:
```
/media/raw/
/test-results/
/playwright-report/
/screenshots/
```

- [ ] **Step 3: `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: { include: ["tests/unit/**/*.test.ts"], environment: "node" },
});
```

- [ ] **Step 4: `playwright.config.ts`**

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  use: { baseURL: "http://localhost:3100" },
  webServer: {
    command: "npm run build && npx next start -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: { RESEND_API_KEY: "", CONTACT_TO_EMAIL: "" },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
```

- [ ] **Step 5: scripts a `package.json`-ba**

```json
"test": "vitest run",
"e2e": "playwright test",
"media:generate": "node --env-file=.env.local scripts/generate-media.mjs",
"media:encode": "bash scripts/encode-media.sh"
```

- [ ] **Step 6: Smoke teszt**

`tests/unit/smoke.test.ts`:
```ts
import { expect, test } from "vitest";
test("vitest fut", () => expect(1 + 1).toBe(2));
```

Run: `npm test` → Expected: 1 passed. Run: `npm run build` → Expected: sikeres build.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "chore: Next.js 16 váz, Vitest és Playwright"
```

---

### Task 2: Tartalom-adatfájl és időpont-logika

**Files:**
- Create: `src/content/site.ts`, `src/lib/schedule.ts`, `tests/unit/schedule.test.ts`, `tests/unit/site.test.ts`
- Copy: `images/983C7C31-…jpeg` → `public/posters/anya-baba.jpg`, `images/8FAA8A0A-…png` → `public/posters/tancolo-evek.png`

**Interfaces:**
- Produces:
  - `type Weekday = "hétfő" | "kedd" | "szerda" | "csütörtök" | "péntek" | "szombat" | "vasárnap"`
  - `type Slot = { kind: "weekly"; weekday: Weekday; start: string; end: string } | { kind: "once"; date: string; start: string; end: string; label: string }`
  - `type DanceClass = { slug: ClassSlug; title: string; tagline: string; audience: string; intro: string; highlights: string[]; slots: Slot[]; poster: Img; image: Img; accent: "powder" | "sun"; freeTrial: boolean; joinAnytime: boolean }`
  - `type ClassSlug = "anya-baba" | "tancolo-evek"`, `type Img = { src: string; alt: string; width: number; height: number }`
  - `export const site: { teacher; about; venue; contact; partners; classes: DanceClass[] }`
  - `formatSlot(slot: Slot): string`, `visibleSlots(slots: Slot[], now: Date): Slot[]`

- [ ] **Step 1: Failing teszt – `tests/unit/schedule.test.ts`**

```ts
import { describe, expect, test } from "vitest";
import { formatSlot, visibleSlots } from "@/lib/schedule";
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
});
```

Run: `npm test` → Expected: FAIL (`@/lib/schedule` nem létezik).

- [ ] **Step 2: `src/content/site.ts`**

```ts
export type Weekday = "hétfő" | "kedd" | "szerda" | "csütörtök" | "péntek" | "szombat" | "vasárnap";
export type Slot =
  | { kind: "weekly"; weekday: Weekday; start: string; end: string }
  | { kind: "once"; date: string; start: string; end: string; label: string };
export type Img = { src: string; alt: string; width: number; height: number };
export type ClassSlug = "anya-baba" | "tancolo-evek";
export type DanceClass = {
  slug: ClassSlug;
  title: string;
  tagline: string;
  audience: string;
  intro: string;
  highlights: string[];
  slots: Slot[];
  poster: Img;
  image: Img;
  accent: "powder" | "sun";
  freeTrial: boolean;
  joinAnytime: boolean;
};

export const site = {
  teacher: { name: "Hallgat Hanna", role: "Táncművész, tánctanár" },
  hero: {
    kicker: "Táncórák Budapesten, Rákoskeresztúron",
    headline: "Mozdulj velem a zenére.",
    sub: "Felszabadult, jókedvű táncórák – tánctapasztalat nélkül is.",
    cta: "Ingyenes próbaóra",
  },
  about: {
    heading: "Rólam pár szó",
    paragraphs: [
      "Hallgat Hanna vagyok, táncművésznek tanultam. Mindig is közel állt hozzám a tánc, a mozgás és a tanítás.",
      "Szeretném, ha az óráimon mindenki felszabadultan, jókedvűen mozogna, függetlenül attól, hogy van-e korábbi tánctapasztalata.",
    ],
    photo: { src: "/media/hanna.jpg", alt: "Táncos lábak a stúdió fapadlóján", width: 1200, height: 1500 },
  },
  venue: {
    name: "Allstars Dance Studio",
    street: "Pesti út 193.",
    zip: "1173",
    city: "Budapest",
    directions: "Rákoskeresztúr Városközponttól kb. 5 percre",
    lat: 47.4796,
    lng: 19.2475,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Allstars+Dance+Studio+Budapest+Pesti+%C3%BAt+193",
  },
  contact: {
    email: "tancoloevek@gmail.com",
    facebookHandle: "@AktívSzeniorTánc",
    // TODO: a pontos Facebook-oldal URL-t Hannától kérjük el; addig keresési link.
    facebookUrl: "https://www.facebook.com/search/top?q=Akt%C3%ADv%20Szenior%20T%C3%A1nc",
  },
  partners: ["Közösségi Élet Központ", "Szenior Aktivitás Egyesület"],
  classes: [
    {
      slug: "anya-baba",
      title: "Táncolj együtt a babáddal!",
      tagline: "Mozgás • zene • közös élmény",
      audience: "Anyukáknak, hordozott babával",
      intro:
        "Egy vidám, könnyed és bababarát táncos óra anyukáknak, ahol a babádat biztonságosan magadra kötve együtt mozoghattok a zenére.",
      highlights: [
        "Baba közel hozzád",
        "Vidám, könnyen követhető táncok",
        "Mozgás és feltöltődés az anyukának",
        "Közös élmény, kapcsolódás és sok-sok mosoly",
        "Kezdőket is szeretettel várlak",
      ],
      slots: [{ kind: "once", date: "2026-10-14", start: "9:00", end: "10:00", label: "Első óra" }],
      poster: { src: "/posters/anya-baba.jpg", alt: "Táncolj együtt a babáddal! – az óra plakátja", width: 1067, height: 2093 },
      image: { src: "/media/anya-baba.jpg", alt: "Anyuka hordozókendőben táncol a babájával egy napfényes stúdióban", width: 1600, height: 2000 },
      accent: "powder",
      freeTrial: true,
      joinAnytime: false,
    },
    {
      slug: "tancolo-evek",
      title: "Táncoló Évek",
      tagline: "Tánc, közösség és életöröm 50 év felettieknek",
      audience: "50 év felettieknek",
      intro:
        "Egy kellemes órára kiszakadunk a hétköznapokból: mozgunk, táncolunk, és közben jól érezzük magunkat.",
      highlights: [
        "Könnyen követhető alaplépések és ritmusgyakorlatok",
        "Sokszínű zene és mozgásformák",
        "Kímélő, ízületbarát átmozgatás, mindenki a saját tempójában",
        "Támogató, felszabadult légkör",
        "Új ismerősök és egy barátságos közösség",
      ],
      slots: [
        { kind: "weekly", weekday: "kedd", start: "18:00", end: "19:00" },
        { kind: "weekly", weekday: "szerda", start: "10:00", end: "11:00" },
      ],
      poster: { src: "/posters/tancolo-evek.png", alt: "Táncoló Évek – az óra plakátja", width: 1024, height: 1536 },
      image: { src: "/media/tancolo-evek.jpg", alt: "Mosolygó, 50 év feletti táncosok egy világos stúdióban", width: 1600, height: 2000 },
      accent: "sun",
      freeTrial: true,
      joinAnytime: true,
    },
  ] satisfies DanceClass[],
} as const;
```

(A plakátok méretét a másolás után `sips -g pixelWidth -g pixelHeight public/posters/*` paranccsal ellenőrizd, és ha eltér, javítsd.)

- [ ] **Step 3: `src/lib/schedule.ts`**

```ts
import type { Slot, Weekday } from "@/content/site";

const ON_DAY: Record<Weekday, string> = {
  hétfő: "hétfőn", kedd: "kedden", szerda: "szerdán", csütörtök: "csütörtökön",
  péntek: "pénteken", szombat: "szombaton", vasárnap: "vasárnap",
};
const MONTHS = ["január","február","március","április","május","június","július","augusztus","szeptember","október","november","december"];
const DAYS: Weekday[] = ["vasárnap","hétfő","kedd","szerda","csütörtök","péntek","szombat"];

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

/** Budapest-i naptári nap (YYYY-MM-DD) – a Vercel UTC-ben fut. */
function budapestDay(now: Date): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Budapest" }).format(now);
}

export function visibleSlots(slots: Slot[], now: Date): Slot[] {
  const today = budapestDay(now);
  return slots.filter((s) => s.kind === "weekly" || s.date >= today);
}
```

- [ ] **Step 4: Adat-integritás teszt – `tests/unit/site.test.ts`** (a plakátokkal egyezés rögzítése)

```ts
import { expect, test } from "vitest";
import { site } from "@/content/site";
import { formatSlot } from "@/lib/schedule";

test("plakát szerinti időpontok", () => {
  const byslug = Object.fromEntries(site.classes.map((c) => [c.slug, c.slots.map(formatSlot)]));
  expect(byslug["anya-baba"]).toEqual(["Első óra: 2026. október 14., szerda · 9:00–10:00"]);
  expect(byslug["tancolo-evek"]).toEqual(["Minden kedden 18:00–19:00", "Minden szerdán 10:00–11:00"]);
});

test("helyszín és elérhetőség a plakát szerint", () => {
  expect(`${site.venue.zip} ${site.venue.city}, ${site.venue.street}`).toBe("1173 Budapest, Pesti út 193.");
  expect(site.contact.email).toBe("tancoloevek@gmail.com");
});
```

Run: `npm test` → Expected: minden PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: tartalom-adatfájl és időpont-formázás"
```

---

### Task 3: Seed alapú design irány és tokenek

**Files:**
- Create: `docs/design-direction.md`
- Modify: `src/app/globals.css`, `src/app/layout.tsx`

**Interfaces:**
- Produces: Tailwind tokenek (a komponensek CSAK ezeket használják): `bg-paper`, `text-ink`, `text-ink-soft`, `bg-powder`/`text-powder-ink`, `bg-sun`/`text-sun-ink`, `bg-sky`, `border-line`; fontok: `font-display`, `font-body`; CSS változók: `--font-display`, `--font-body`.

- [ ] **Step 1: Seed generálás**

```bash
LC_ALL=C tr -dc 'A-Za-z0-9' </dev/urandom | head -c 64; echo
```

- [ ] **Step 2: Irány levezetése** a `docs/design-direction.md`-be (a seed NEM kerül az oldalra, a doksiba igen, a reprodukálhatóságért). Kötelező fejezetek: *Seed*, *Olvasat* (milyen mintázatokat láttál: betű/szám arány → kontraszt, ismétlődések → ritmus, kis/nagybetű → tipográfiai feszültség), *Paletta* (hex + arányok), *Tipográfia* (display + body font a Google Fontsból, latin-ext támogatással), *Layout-szabályok* (rács, aszimmetria, „képkocka” szekció), *Mozgás* (max. 3 típusú animáció), *Tilos lista*.

- [ ] **Step 3: Tokenek a `src/app/globals.css`-ben.** Alapértékek a plakátokból kiindulva; a Step 2 felülírhatja őket, ha a doksiban indokolva van:

```css
@import "tailwindcss";

@theme {
  --color-paper: #f6efe6;
  --color-ink: #2a1a1f;
  --color-ink-soft: #5b4a4f;
  --color-line: #e2d6c9;
  --color-powder: #efd3cf;
  --color-powder-ink: #6b2f3a;
  --color-sun: #f4c542;
  --color-sun-ink: #3b2a00;
  --color-sky: #2f7fb8;
  --font-display: var(--font-display-face);
  --font-body: var(--font-body-face);
}

html { font-size: 112.5%; scroll-behavior: smooth; } /* 18px alap */
body { background: var(--color-paper); color: var(--color-ink); font-family: var(--font-body); }
:focus-visible { outline: 3px solid var(--color-sky); outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
```

- [ ] **Step 4: Fontok a `layout.tsx`-ben** (a Step 2-ben választott fontokkal; alapértelmezés: `Fraunces` display, `Figtree` body):

```tsx
import type { Metadata } from "next";
import { Fraunces, Figtree } from "next/font/google";
import "./globals.css";

const display = Fraunces({ subsets: ["latin", "latin-ext"], variable: "--font-display-face", axes: ["SOFT", "opsz"] });
const body = Figtree({ subsets: ["latin", "latin-ext"], variable: "--font-body-face" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Hallgat Hanna – táncórák Rákoskeresztúron",
  description: "Anya–baba tánc és Táncoló Évek 50+ táncórák az Allstars Dance Studióban. Ingyenes próbaóra.",
  openGraph: { locale: "hu_HU", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu" className={`${display.variable} ${body.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 5: Ellenőrzés** – `npm run build` sikeres; `grep -c latin-ext src/app/layout.tsx` → 2.

- [ ] **Step 6: Commit** – `git commit -am "design: seed alapú irány és tokenek"` (+ `git add docs/design-direction.md`).

---

### Task 4: Figma fájl (tokenek, komponensek, oldaltervek)

**Files:** nincs kódfájl; kimenet: Figma URL beírva a `docs/design-direction.md` „Figma” fejezetébe.

**Interfaces:**
- Consumes: Task 3 tokenjei és `docs/design-direction.md`.
- Produces: Figma fájl a következő oldalakkal: `Tokens`, `Components`, `Desktop 1440`, `Mobile 390`. A komponensnevek egyeznek a kóddal: `Nav`, `Hero`, `ClassBlock` (variáns: `accent=powder|sun`), `ScheduleList`, `ContactForm`, `Footer`.

- [ ] **Step 1:** Töltsd be a `figma:figma-create-new-file` skillt, és hozz létre egy Design fájlt „Hallgat Hanna – web” néven.
- [ ] **Step 2:** Töltsd be a `figma:figma-use` és a `figma:figma-generate-library` skillt; hozd létre a változókat (`color/*`, `font/*`, `space/4..128`) a Task 3 értékeivel.
- [ ] **Step 3:** Komponensek a fenti nevekkel, változókhoz kötve.
- [ ] **Step 4:** `figma:figma-generate-design` → `Desktop 1440` és `Mobile 390` frame-ek a szekciósorrenddel: Nav → Hero → Órák → Rólam → Helyszín → Kapcsolat → Footer. A hero és az óraképek helyére a Task 5 állóképei kerülnek, ha már elkészültek (`upload_assets`), különben szürke helykitöltő.
- [ ] **Step 5:** `get_screenshot` mindkét frame-ről; a képeket ments a `screenshots/figma-desktop.png` és `screenshots/figma-mobile.png` fájlba (nem kerülnek a gitbe).
- [ ] **Step 6:** Írd be a Figma URL-t a `docs/design-direction.md`-be; `git commit -am "docs: Figma fájl linkje"`.

---

### Task 5: Média generálása (fal.ai) és kódolás (ffmpeg)

**Files:**
- Create: `scripts/generate-media.mjs`, `scripts/encode-media.sh`, `media/PROMPTS.md`
- Output: `public/media/hero.mp4`, `public/media/hero.webm`, `public/media/hero-poster.jpg`, `public/media/anya-baba.jpg`, `public/media/tancolo-evek.jpg`, `public/media/hanna.jpg`

**Interfaces:**
- Produces: a fenti fájlnevek (Task 2 `site.ts` és Task 7 `Hero` ezekre hivatkozik).

- [ ] **Step 1: Költségbecslés** – töltsd be a `fal-ai:fal-media-generation` skillt, kérd le a `fal-ai/nano-banana-pro` és a `fal-ai/veo3.1/fast/first-last-frame-to-video` árát; ha a teljes futás > 10 USD, kérdezd meg a felhasználót.

- [ ] **Step 2: `scripts/generate-media.mjs`**

```js
import { fal } from "@fal-ai/client";
import { mkdir, writeFile } from "node:fs/promises";

if (!process.env.FAL_KEY) throw new Error("FAL_KEY hiányzik (.env.local)");
fal.config({ credentials: process.env.FAL_KEY });

const RAW = "media/raw";
await mkdir(RAW, { recursive: true });

const STYLE =
  "editorial documentary photograph, natural window light, warm cream and wood tones, soft film grain, 35mm, no text, no logos";

const STILLS = {
  "hero-still": { ratio: "16:9", prompt: `Wide shot of a sunlit dance studio with tall windows and a honey-coloured wooden floor. A woman dancer in soft neutral clothing, seen from the side at mid distance, face turned away and not recognisable, mid-way through a slow, graceful arm sweep. Plenty of empty space on the left third. ${STYLE}` },
  "anya-baba": { ratio: "4:5", prompt: `A mother dancing joyfully in a bright studio while carrying her baby in a blush-pink woven wrap carrier, baby safely snug on her chest, mother's face partly turned away, motion in her skirt. ${STYLE}` },
  "tancolo-evek": { ratio: "4:5", prompt: `A small group of smiling women and men in their sixties dancing together in a bright studio, colourful casual sportswear with sunflower-yellow and sky-blue accents, genuine laughter, slight motion blur on hands. ${STYLE}` },
  "hanna": { ratio: "4:5", prompt: `Close detail of a dancer's bare feet and ankles mid-step on a warm wooden studio floor, soft shadow from a window, no face visible. ${STYLE}` },
};

async function still(name, { ratio, prompt }) {
  const { data } = await fal.subscribe("fal-ai/nano-banana-pro", {
    input: { prompt, aspect_ratio: ratio, resolution: "2K", output_format: "jpeg", num_images: 1 },
  });
  const url = data.images[0].url;
  await writeFile(`${RAW}/${name}.jpg`, Buffer.from(await (await fetch(url)).arrayBuffer()));
  console.log(`${name}: ${url}`);
  return url;
}

const urls = {};
for (const [name, cfg] of Object.entries(STILLS)) urls[name] = await still(name, cfg);

const VIDEO_PROMPT =
  "The dancer performs a slow, fluid, continuous contemporary dance phrase: the arm sweep flows into a gentle turn and returns exactly to the starting pose. Static locked-off camera, sunlight drifting softly, dust motes in the light. Calm, elegant, seamless loop.";

const { data: video } = await fal.subscribe("fal-ai/veo3.1/fast/first-last-frame-to-video", {
  input: {
    prompt: VIDEO_PROMPT,
    first_frame_url: urls["hero-still"],
    last_frame_url: urls["hero-still"],
    duration: "8s",
    resolution: "1080p",
    aspect_ratio: "16:9",
    generate_audio: false,
  },
  logs: true,
});
await writeFile(`${RAW}/hero.mp4`, Buffer.from(await (await fetch(video.video.url)).arrayBuffer()));
console.log(`hero video: ${video.video.url}`);
```

- [ ] **Step 3: Futtatás** – `npm run media:generate`. Expected: 4 jpg + `hero.mp4` a `media/raw/`-ban. **Nézd meg mind az ötöt** (Read a képekre, a videóból `ffmpeg -ss 4 -i media/raw/hero.mp4 -frames:v 1 /tmp/claude-…/mid.jpg` képkockát). Ellenőrizd: senki nem hasonlít konkrét személyre, nincs torz kéz vagy végtag, nincs szöveg. Ha rossz, módosítsd a promptot, és futtasd újra csak azt a tételt.

- [ ] **Step 4: `scripts/encode-media.sh`**

```bash
#!/usr/bin/env bash
set -euo pipefail
RAW=media/raw; OUT=public/media; mkdir -p "$OUT"

# Videó: hang nélkül, 1280 széles, web-optimalizált
ffmpeg -y -i "$RAW/hero.mp4" -an -vf "scale=1280:-2,format=yuv420p" -c:v libx264 -crf 28 -preset slow -movflags +faststart "$OUT/hero.mp4"
ffmpeg -y -i "$RAW/hero.mp4" -an -vf "scale=1280:-2" -c:v libvpx-vp9 -crf 38 -b:v 0 -row-mt 1 "$OUT/hero.webm"
ffmpeg -y -i "$OUT/hero.mp4" -frames:v 1 -q:v 3 "$OUT/hero-poster.jpg"

# Állóképek: max 2000px hosszabb oldal, JPEG q=82 (next/image tovább optimalizál)
for n in anya-baba tancolo-evek hanna; do
  ffmpeg -y -i "$RAW/$n.jpg" -vf "scale='if(gt(iw,ih),2000,-2)':'if(gt(iw,ih),-2,2000)'" -q:v 4 "$OUT/$n.jpg"
done

ls -lh "$OUT"
for f in "$OUT"/hero.mp4 "$OUT"/hero.webm; do
  size=$(stat -f%z "$f"); [ "$size" -le 3145728 ] || { echo "TÚL NAGY: $f ($size)"; exit 1; }
done
```

Run: `npm run media:encode` → Expected: mindkét videó ≤ 3 MB, egyébként növeld a CRF-et 2-vel, és futtasd újra.

- [ ] **Step 5: Hurok ellenőrzése** – vesd össze az első és az utolsó képkockát:
```bash
ffmpeg -i public/media/hero.mp4 -vf "select=eq(n\,0)" -frames:v 1 $TMP/first.png
ffmpeg -sseof -0.1 -i public/media/hero.mp4 -frames:v 1 $TMP/last.png
```
Nézd meg mindkettőt. Ha látható ugrás van, tegyél 0,5 mp-es crossfade-et az `encode-media.sh`-ba (`xfade=transition=fade:duration=0.5`, a klip végét az elejére keverve).

- [ ] **Step 6: Méretek frissítése** a `site.ts`-ben (`sips -g pixelWidth -g pixelHeight public/media/*.jpg`); `npm test` zöld.

- [ ] **Step 7: `media/PROMPTS.md`** – a modellazonosítók, promptok, fal kimeneti URL-ek és a dátum. Commit:
```bash
git add scripts media/PROMPTS.md public/media src/content/site.ts && git commit -m "feat: fal.ai által generált hero loop és hangulatképek"
```

---

### Task 6: Oldalváz – Nav és Footer

**Files:**
- Create: `src/components/Nav.tsx`, `src/components/Footer.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `site` (Task 2), tokenek (Task 3).
- Produces: szekció-azonosítók, amelyekre a többi komponens és az e2e teszt épít: `#orak`, `#rolam`, `#helyszin`, `#kapcsolat`.

- [ ] **Step 1: `src/components/Nav.tsx`**

```tsx
import { site } from "@/content/site";

const LINKS = [
  { href: "#orak", label: "Órák" },
  { href: "#rolam", label: "Rólam" },
  { href: "#helyszin", label: "Helyszín" },
  { href: "#kapcsolat", label: "Kapcsolat" },
];

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-paper/90 backdrop-blur-sm border-b border-line">
      <nav aria-label="Fő navigáció" className="mx-auto flex max-w-[1360px] items-center justify-between gap-6 px-5 py-3">
        <a href="#top" className="font-display text-xl">{site.teacher.name}</a>
        <ul className="hidden gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}><a className="inline-flex min-h-11 items-center hover:underline underline-offset-4" href={l.href}>{l.label}</a></li>
          ))}
        </ul>
        <a href="#kapcsolat" className="inline-flex min-h-11 items-center bg-ink px-5 text-paper">{site.hero.cta}</a>
      </nav>
    </header>
  );
}
```

(Mobilon a horgonyok a CTA-n és a hero gombjain keresztül érhetők el; hamburger menü nincs, kevés szekcióhoz felesleges.)

- [ ] **Step 2: `src/components/Footer.tsx`**

```tsx
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-line px-5 py-12 text-ink-soft">
      <div className="mx-auto flex max-w-[1360px] flex-col gap-6 md:flex-row md:justify-between">
        <p>© {new Date().getFullYear()} {site.teacher.name}</p>
        <p>Partnereink: {site.partners.join(" · ")}</p>
        <a className="underline underline-offset-4" href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: `src/app/page.tsx` váz**

```tsx
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        {/* Hero (Task 7), Órák (Task 8), Rólam + Helyszín (Task 8b), Kapcsolat (Task 9) */}
        <section id="orak" /><section id="rolam" /><section id="helyszin" /><section id="kapcsolat" />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4:** `npm run build && npm run lint` → zöld. Commit: `feat: navigáció és lábléc`.

---

### Task 7: Hero looping videóval

**Files:**
- Create: `src/components/LoopVideo.tsx`, `src/components/Hero.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `/media/hero.mp4`, `/media/hero.webm`, `/media/hero-poster.jpg` (Task 5).
- Produces: `<LoopVideo sources={{mp4, webm}} poster alt />` – reduced-motion esetén `<img>`-et renderel, `<video>`-t nem.

- [ ] **Step 1: `src/components/LoopVideo.tsx`**

```tsx
"use client";
import Image from "next/image";
import { useReducedMotion } from "motion/react";

type Props = { mp4: string; webm: string; poster: string; alt: string };

export function LoopVideo({ mp4, webm, poster, alt }: Props) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <Image src={poster} alt={alt} fill priority sizes="100vw" className="object-cover" />;
  }
  return (
    <video
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay muted loop playsInline preload="metadata"
      poster={poster} aria-label={alt} data-testid="hero-video"
    >
      <source src={webm} type="video/webm" />
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
```

- [ ] **Step 2: `src/components/Hero.tsx`** – teljes képernyős, aszimmetrikus (szöveg bal alsó harmad, a videóban a táncos jobbra). Sötétítés a kontraszthoz: egyszínű `bg-ink/45` overlay (nem gradiens).

```tsx
import { site } from "@/content/site";
import { LoopVideo } from "./LoopVideo";

export function Hero() {
  const { hero, teacher } = site;
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] items-end overflow-hidden text-paper">
      <LoopVideo mp4="/media/hero.mp4" webm="/media/hero.webm" poster="/media/hero-poster.jpg" alt="Táncos lassú mozdulatai egy napfényes stúdióban" />
      <div aria-hidden className="absolute inset-0 bg-ink/45" />
      <div className="relative mx-auto w-full max-w-[1360px] px-5 pb-16 pt-32 md:pb-24">
        <p className="mb-4 text-base uppercase tracking-[0.2em]">{hero.kicker}</p>
        <h1 id="hero-title" className="font-display text-[clamp(3rem,9vw,8.5rem)] leading-[0.92] max-w-[12ch]">{hero.headline}</h1>
        <p className="mt-6 max-w-[38ch] text-xl">{hero.sub}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a href="#kapcsolat" className="inline-flex min-h-12 items-center bg-paper px-6 text-ink">{hero.cta}</a>
          <a href="#orak" className="inline-flex min-h-12 items-center border border-paper px-6">Az órák</a>
        </div>
        <p className="sr-only">{teacher.name}, {teacher.role}</p>
      </div>
    </section>
  );
}
```

- [ ] **Step 3:** `page.tsx`: `<Hero />` a `<main>` elejére. `npm run build`; nézd meg a `npm run dev` oldalt Playwright MCP screenshottal 1440-en és 390-en (`screenshots/hero-*.png`). A címnek olvashatónak kell lennie a videó minden képkockáján.
- [ ] **Step 4:** Commit: `feat: hero looping videóval, reduced-motion fallback`.

---

### Task 8: Órák, Rólam, Helyszín szekciók

**Files:**
- Create: `src/components/ScheduleList.tsx`, `src/components/PosterLightbox.tsx`, `src/components/ClassBlock.tsx`, `src/components/About.tsx`, `src/components/Venue.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `DanceClass`, `formatSlot`, `visibleSlots` (Task 2).
- Produces: `<ClassBlock cls={DanceClass} index={number} />`; a jelentkezés-link: `#kapcsolat?ora=<slug>` helyett `href={"/?ora=" + slug + "#kapcsolat"}` → a ContactForm (Task 9) a `ora` query paramból előválaszt.

- [ ] **Step 1: `ScheduleList.tsx`** (szerver komponens; a `now` a build idején számít, ezért a page `export const revalidate = 86400`, hogy naponta újraépüljön, és a lejárt dátum eltűnjön)

```tsx
import type { Slot } from "@/content/site";
import { formatSlot, visibleSlots } from "@/lib/schedule";

export function ScheduleList({ slots }: { slots: Slot[] }) {
  const shown = visibleSlots(slots, new Date());
  if (shown.length === 0) {
    return <p className="text-xl">Írj nekem az aktuális időpontokért!</p>;
  }
  return (
    <ul className="divide-y divide-current/20 border-y border-current/20">
      {shown.map((s) => (
        <li key={formatSlot(s)} className="py-4 text-xl font-medium">{formatSlot(s)}</li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 2: `PosterLightbox.tsx`** – natív `<dialog>`: az Esc, a fókuszcsapda és a háttér-inertség ingyen jár vele.

```tsx
"use client";
import Image from "next/image";
import { useRef } from "react";
import type { Img } from "@/content/site";

export function PosterLightbox({ poster, label }: { poster: Img; label: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()} className="inline-flex min-h-11 items-center underline underline-offset-4">
        {label}
      </button>
      <dialog
        ref={ref}
        aria-label={poster.alt}
        onClick={(e) => { if (e.target === ref.current) ref.current?.close(); }}
        className="m-auto max-h-[92svh] max-w-[min(92vw,640px)] bg-transparent p-0 backdrop:bg-ink/80"
      >
        <Image src={poster.src} alt={poster.alt} width={poster.width} height={poster.height} className="h-auto max-h-[86svh] w-auto" />
        <form method="dialog" className="mt-2 text-right">
          <button className="min-h-11 bg-paper px-5 text-ink">Bezárás</button>
        </form>
      </dialog>
    </>
  );
}
```

- [ ] **Step 3: `ClassBlock.tsx`** – két blokk, tükrözött aszimmetrikus elrendezés (`index` páros: kép balra, páratlan: jobbra), akcentus-háttér: `powder` → `bg-powder text-powder-ink`, `sun` → `bg-sun text-sun-ink`.

```tsx
import Image from "next/image";
import type { DanceClass } from "@/content/site";
import { ScheduleList } from "./ScheduleList";
import { PosterLightbox } from "./PosterLightbox";

const ACCENT = { powder: "bg-powder text-powder-ink", sun: "bg-sun text-sun-ink" } as const;

export function ClassBlock({ cls, index }: { cls: DanceClass; index: number }) {
  const flip = index % 2 === 1;
  return (
    <article aria-labelledby={`${cls.slug}-title`} className={`${ACCENT[cls.accent]} grid md:grid-cols-12`}>
      <div className={`relative min-h-[60svh] md:col-span-5 ${flip ? "md:order-2" : ""}`}>
        <Image src={cls.image.src} alt={cls.image.alt} fill sizes="(min-width: 768px) 42vw, 100vw" className="object-cover" />
      </div>
      <div className="flex flex-col gap-8 px-5 py-16 md:col-span-7 md:px-16 md:py-24">
        <p className="uppercase tracking-[0.2em]">{cls.audience}</p>
        <h3 id={`${cls.slug}-title`} className="font-display text-[clamp(2.4rem,5vw,4.5rem)] leading-none">{cls.title}</h3>
        <p className="max-w-[46ch] text-xl">{cls.intro}</p>
        <ul className="grid gap-2 text-lg md:grid-cols-2">
          {cls.highlights.map((h) => <li key={h}>— {h}</li>)}
        </ul>
        <ScheduleList slots={cls.slots} />
        {cls.joinAnytime && <p>Az órákhoz folyamatosan lehet csatlakozni.</p>}
        <div className="flex flex-wrap items-center gap-6">
          <a href={`/?ora=${cls.slug}#kapcsolat`} className="inline-flex min-h-12 items-center bg-ink px-6 text-paper">
            {cls.freeTrial ? "Jelentkezem ingyenes próbaórára" : "Jelentkezem"}
          </a>
          <PosterLightbox poster={cls.poster} label="Plakát megtekintése" />
        </div>
      </div>
    </article>
  );
}
```

Kontrasztellenőrzés: `text-powder-ink` a `bg-powder`-en és `text-sun-ink` a `bg-sun`-on ≥ 4.5:1 (a Task 3 alapértékeivel ~8:1, illetve ~10:1); ha a Task 3 más színeket választott, mérd újra.

- [ ] **Step 4: `About.tsx` és `Venue.tsx`**

```tsx
// About.tsx
import Image from "next/image";
import { site } from "@/content/site";

export function About() {
  const { about } = site;
  return (
    <section id="rolam" aria-labelledby="rolam-title" className="mx-auto grid max-w-[1360px] gap-12 px-5 py-24 md:grid-cols-12">
      <div className="relative aspect-[4/5] md:col-span-4 md:col-start-2">
        <Image src={about.photo.src} alt={about.photo.alt} fill sizes="(min-width:768px) 30vw, 100vw" className="object-cover" />
      </div>
      <div className="md:col-span-6 md:col-start-7 md:self-end">
        <h2 id="rolam-title" className="font-display text-5xl">{about.heading}</h2>
        {about.paragraphs.map((p) => <p key={p} className="mt-6 max-w-[52ch] text-xl">{p}</p>)}
      </div>
    </section>
  );
}
```

```tsx
// Venue.tsx
import { site } from "@/content/site";

export function Venue() {
  const v = site.venue;
  const d = 0.004;
  const bbox = [v.lng - d, v.lat - d, v.lng + d, v.lat + d].join(",");
  return (
    <section id="helyszin" aria-labelledby="helyszin-title" className="mx-auto grid max-w-[1360px] gap-10 px-5 py-24 md:grid-cols-12">
      <div className="md:col-span-5">
        <h2 id="helyszin-title" className="font-display text-5xl">Helyszín</h2>
        <address className="mt-6 text-xl not-italic">
          <strong>{v.name}</strong><br />{v.zip} {v.city}, {v.street}<br />{v.directions}
        </address>
        <a href={v.mapsUrl} target="_blank" rel="noopener" className="mt-6 inline-flex min-h-11 items-center underline underline-offset-4">Útvonaltervezés</a>
      </div>
      <iframe
        title={`Térkép: ${v.name}`}
        loading="lazy"
        className="aspect-[4/3] w-full border border-line md:col-span-7"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${v.lat},${v.lng}`}
      />
    </section>
  );
}
```

A `lat/lng` értékeket a végrehajtáskor ellenőrizd az OSM Nominatimmal (`curl 'https://nominatim.openstreetmap.org/search?q=Pesti+út+193+Budapest&format=json'`), és javítsd a `site.ts`-ben.

- [ ] **Step 5: `page.tsx`** – az órák szekció:

```tsx
<section id="orak" aria-labelledby="orak-title">
  <h2 id="orak-title" className="mx-auto max-w-[1360px] px-5 pb-12 pt-24 font-display text-[clamp(2.8rem,7vw,6rem)]">Órák</h2>
  {site.classes.map((c, i) => <ClassBlock key={c.slug} cls={c} index={i} />)}
</section>
<About />
<Venue />
```
és a fájl tetején: `export const revalidate = 86400;`

- [ ] **Step 6:** `npm run build && npm run lint` zöld; Playwright MCP screenshot 1440/390; commit: `feat: órák, rólam és helyszín szekciók`.

---

### Task 9: Kapcsolat – validáció, Server Action, űrlap

**Files:**
- Create: `src/lib/contact.ts`, `src/app/actions/contact.ts`, `src/components/ContactForm.tsx`, `src/components/ContactSection.tsx`, `tests/unit/contact.test.ts`, `.env.example`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Produces:
  - `contactSchema` (zod): `{ name: string(2..80), email: email, classSlug: ClassSlug | "egyeb", message: string(0..2000), website: string (honeypot) }`
  - `type ContactInput = z.infer<typeof contactSchema>`
  - `buildEmail(input: ContactInput, classTitle: string): { subject: string; text: string }`
  - `type ContactState = { status: "idle" | "success" | "error"; message?: string; fieldErrors?: Partial<Record<keyof ContactInput, string>> }`
  - `sendContact(prev: ContactState, formData: FormData): Promise<ContactState>` (Server Action)
  - `isContactFormEnabled(): boolean`

- [ ] **Step 1: Failing tesztek – `tests/unit/contact.test.ts`**

```ts
import { beforeEach, describe, expect, test, vi } from "vitest";
import { buildEmail, contactSchema } from "@/lib/contact";

const valid = { name: "Kiss Éva", email: "eva@example.com", classSlug: "tancolo-evek", message: "Szia!", website: "" };

describe("contactSchema", () => {
  test("érvényes bevitel", () => expect(contactSchema.safeParse(valid).success).toBe(true));
  test("rossz e-mail", () => expect(contactSchema.safeParse({ ...valid, email: "x" }).success).toBe(false));
  test("túl rövid név", () => expect(contactSchema.safeParse({ ...valid, name: "K" }).success).toBe(false));
  test("2000 karakternél hosszabb üzenet elutasítva", () =>
    expect(contactSchema.safeParse({ ...valid, message: "a".repeat(2001) }).success).toBe(false));
  test("ismeretlen óra elutasítva", () =>
    expect(contactSchema.safeParse({ ...valid, classSlug: "salsa" }).success).toBe(false));
});

describe("buildEmail", () => {
  test("egysoros, vágott tárgy, plain text törzs", () => {
    const e = buildEmail({ ...valid, name: "Évi\r\nBcc: x@y.z" + "a".repeat(200) }, "Táncoló Évek");
    expect(e.subject).not.toMatch(/[\r\n]/);
    expect(e.subject.length).toBeLessThanOrEqual(120);
    expect(e.text).toContain("Táncoló Évek");
    expect(e.text).toContain("eva@example.com");
  });
  test("HTML nem értelmeződik (szövegként marad)", () => {
    const e = buildEmail({ ...valid, message: "<script>alert(1)</script>" }, "Táncoló Évek");
    expect(e.text).toContain("<script>alert(1)</script>");
  });
});

describe("sendContact", () => {
  beforeEach(() => { vi.resetModules(); vi.unstubAllEnvs(); });

  const fd = (o: Record<string, string>) => { const f = new FormData(); Object.entries(o).forEach(([k, v]) => f.set(k, v)); return f; };

  test("kulcs nélkül barátságos hiba, nem dob", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const { sendContact } = await import("@/app/actions/contact");
    const r = await sendContact({ status: "idle" }, fd(valid));
    expect(r.status).toBe("error");
    expect(r.message).toMatch(/tancoloevek@gmail.com/);
  });

  test("honeypot kitöltve: siker, de nincs küldés", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    const send = vi.fn();
    vi.doMock("resend", () => ({ Resend: class { emails = { send }; } }));
    const { sendContact } = await import("@/app/actions/contact");
    const r = await sendContact({ status: "idle" }, fd({ ...valid, website: "spam.example" }));
    expect(r.status).toBe("success");
    expect(send).not.toHaveBeenCalled();
  });

  test("validációs hiba mezőnként", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    const { sendContact } = await import("@/app/actions/contact");
    const r = await sendContact({ status: "idle" }, fd({ ...valid, email: "rossz" }));
    expect(r.status).toBe("error");
    expect(r.fieldErrors?.email).toBeDefined();
  });

  test("sikeres küldés Resenddel, reply-to a látogató", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("CONTACT_TO_EMAIL", "hanna@example.com");
    const send = vi.fn().mockResolvedValue({ data: { id: "1" }, error: null });
    vi.doMock("resend", () => ({ Resend: class { emails = { send }; } }));
    const { sendContact } = await import("@/app/actions/contact");
    const r = await sendContact({ status: "idle" }, fd(valid));
    expect(r.status).toBe("success");
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ to: "hanna@example.com", replyTo: "eva@example.com" }));
  });
});
```

Run: `npm test` → Expected: FAIL (a modulok nem léteznek).

- [ ] **Step 2: `src/lib/contact.ts`**

```ts
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Kérlek, add meg a neved.").max(80, "Legfeljebb 80 karakter."),
  email: z.email("Kérlek, érvényes e-mail címet adj meg."),
  classSlug: z.enum(["anya-baba", "tancolo-evek", "egyeb"], "Válassz órát."),
  message: z.string().trim().max(2000, "Legfeljebb 2000 karakter.").default(""),
  website: z.string().default(""),
});
export type ContactInput = z.infer<typeof contactSchema>;

const oneLine = (s: string) => s.replace(/[\r\n\t]+/g, " ").trim();

export function buildEmail(input: ContactInput, classTitle: string) {
  const subject = oneLine(`Jelentkezés: ${classTitle} – ${input.name}`).slice(0, 120);
  const text = [
    `Név: ${oneLine(input.name)}`,
    `E-mail: ${input.email}`,
    `Óra: ${classTitle}`,
    "",
    input.message || "(nincs üzenet)",
  ].join("\n");
  return { subject, text };
}
```

- [ ] **Step 3: `src/app/actions/contact.ts`**

```ts
"use server";
import { Resend } from "resend";
import { buildEmail, contactSchema, type ContactInput } from "@/lib/contact";
import { site } from "@/content/site";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof ContactInput, string>>;
};

const FALLBACK = `Most nem sikerült elküldeni. Írj közvetlenül: ${site.contact.email}`;

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ContactInput;
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", message: "Kérlek, javítsd a jelölt mezőket.", fieldErrors };
  }
  if (parsed.data.website) return { status: "success", message: "Köszönöm, hamarosan jelentkezem!" };

  const key = process.env.RESEND_API_KEY;
  if (!key) return { status: "error", message: FALLBACK };

  const title =
    site.classes.find((c) => c.slug === parsed.data.classSlug)?.title ?? "Általános érdeklődés";
  const { subject, text } = buildEmail(parsed.data, title);
  try {
    const { error } = await new Resend(key).emails.send({
      from: "Weboldal <onboarding@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL || site.contact.email,
      replyTo: parsed.data.email,
      subject,
      text,
    });
    if (error) return { status: "error", message: FALLBACK };
  } catch {
    return { status: "error", message: FALLBACK };
  }
  return { status: "success", message: "Köszönöm, hamarosan jelentkezem!" };
}

export async function isContactFormEnabled() {
  return Boolean(process.env.RESEND_API_KEY);
}
```

(A Server Action fájlból csak async függvény exportálható, ezért async az `isContactFormEnabled`; a típus-export rendben van. A `from` a Resend saját domainje, amíg Hannának nincs saját, ellenőrzött domainje.)

Run: `npm test` → Expected: minden PASS.

- [ ] **Step 4: `src/components/ContactForm.tsx`**

```tsx
"use client";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { sendContact, type ContactState } from "@/app/actions/contact";
import { site } from "@/content/site";

const field = "mt-2 block w-full min-h-12 border border-ink/40 bg-paper px-4 text-lg";

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, { status: "idle" });
  const preset = useSearchParams().get("ora") ?? "";
  const err = state.fieldErrors ?? {};

  if (state.status === "success") return <p role="status" className="text-2xl">{state.message}</p>;

  return (
    <form action={action} noValidate className="grid gap-6">
      <label>Neved
        <input name="name" autoComplete="name" required className={field} aria-invalid={!!err.name} aria-describedby="err-name" />
        {err.name && <span id="err-name" className="text-powder-ink">{err.name}</span>}
      </label>
      <label>E-mail címed
        <input name="email" type="email" autoComplete="email" required className={field} aria-invalid={!!err.email} aria-describedby="err-email" />
        {err.email && <span id="err-email" className="text-powder-ink">{err.email}</span>}
      </label>
      <label>Melyik óra érdekel?
        <select name="classSlug" defaultValue={preset} className={field} aria-invalid={!!err.classSlug}>
          <option value="" disabled>Válassz…</option>
          {site.classes.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
          <option value="egyeb">Egyéb kérdés</option>
        </select>
        {err.classSlug && <span className="text-powder-ink">{err.classSlug}</span>}
      </label>
      <label>Üzenet (nem kötelező)
        <textarea name="message" rows={4} maxLength={2000} className={`${field} py-3`} />
      </label>
      <div aria-hidden className="absolute -left-[9999px]">
        <label>Weboldal<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      {state.status === "error" && <p role="alert">{state.message}</p>}
      <button disabled={pending} className="min-h-12 justify-self-start bg-ink px-8 text-paper disabled:opacity-60">
        {pending ? "Küldés…" : "Elküldöm"}
      </button>
    </form>
  );
}
```

- [ ] **Step 5: `src/components/ContactSection.tsx`**

```tsx
import { Suspense } from "react";
import { site } from "@/content/site";
import { isContactFormEnabled } from "@/app/actions/contact";
import { ContactForm } from "./ContactForm";

export async function ContactSection() {
  const formEnabled = await isContactFormEnabled();
  const { email, facebookUrl, facebookHandle } = site.contact;
  return (
    <section id="kapcsolat" aria-labelledby="kapcsolat-title" className="bg-ink text-paper">
      <div className="mx-auto grid max-w-[1360px] gap-12 px-5 py-24 md:grid-cols-12">
        <div className="md:col-span-5">
          <h2 id="kapcsolat-title" className="font-display text-[clamp(2.8rem,6vw,5rem)] leading-none">Gyere, táncolj velem!</h2>
          <p className="mt-6 text-xl">Mindenkit szeretettel várok egy ingyenes próbaórára.</p>
          <ul className="mt-8 grid gap-3 text-xl">
            <li><a className="inline-flex min-h-11 items-center underline underline-offset-4" href={`mailto:${email}`} data-testid="mailto">{email}</a></li>
            <li><a className="inline-flex min-h-11 items-center underline underline-offset-4" href={facebookUrl} target="_blank" rel="noopener">Facebook: {facebookHandle}</a></li>
          </ul>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          {formEnabled ? (
            <Suspense><ContactForm /></Suspense>
          ) : (
            <a href={`mailto:${email}?subject=${encodeURIComponent("Jelentkezés táncórára")}`} className="inline-flex min-h-12 items-center bg-paper px-8 text-ink" data-testid="mailto-fallback">
              Írok egy e-mailt
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
```

A sötét szekcióban a form mezői (`bg-paper` és `text-ink`) önállóan is olvashatóak; a `text-powder-ink` hibaüzenetet itt cseréld `text-powder`-re, ha a kontraszt nem éri el a 4.5:1-et (mérd meg).

- [ ] **Step 6: `.env.example`**

```
FAL_KEY=
RESEND_API_KEY=
CONTACT_TO_EMAIL=tancoloevek@gmail.com
NEXT_PUBLIC_SITE_URL=https://example.vercel.app
```

- [ ] **Step 7:** `page.tsx`: cseréld le a placeholder `#kapcsolat`-ot `<ContactSection />`-re. `npm test && npm run build && npm run lint` zöld. Commit: `feat: kapcsolati űrlap Resenddel és mailto-fallbackkel`.

---

### Task 10: SEO – JSON-LD, sitemap, robots, OG kép

**Files:**
- Create: `src/lib/jsonld.ts`, `tests/unit/jsonld.test.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/opengraph-image.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Produces: `buildJsonLd(now: Date): object[]` – `Person`, `DanceSchool`, valamint a jövőbeli egyszeri időpontokra `Event`.

- [ ] **Step 1: Failing teszt**

```ts
import { expect, test } from "vitest";
import { buildJsonLd } from "@/lib/jsonld";

test("Person + DanceSchool mindig, Event csak jövőbeli egyszeri időpontra", () => {
  const before = buildJsonLd(new Date("2026-10-06T12:00:00+02:00"));
  expect(before.map((o: any) => o["@type"])).toEqual(["Person", "DanceSchool", "Event"]);
  const ev: any = before[2];
  expect(ev.startDate).toBe("2026-10-14T09:00:00+02:00");
  expect(ev.location.address.postalCode).toBe("1173");
  const after = buildJsonLd(new Date("2026-10-20T12:00:00+02:00"));
  expect(after.map((o: any) => o["@type"])).toEqual(["Person", "DanceSchool"]);
});
```

- [ ] **Step 2: `src/lib/jsonld.ts`**

```ts
import { site } from "@/content/site";
import { visibleSlots } from "./schedule";

const pad = (t: string) => t.padStart(5, "0");

export function buildJsonLd(now: Date): object[] {
  const v = site.venue;
  const place = {
    "@type": "Place",
    name: v.name,
    address: { "@type": "PostalAddress", streetAddress: v.street, postalCode: v.zip, addressLocality: v.city, addressCountry: "HU" },
  };
  const out: object[] = [
    { "@context": "https://schema.org", "@type": "Person", name: site.teacher.name, jobTitle: site.teacher.role, email: site.contact.email },
    { "@context": "https://schema.org", "@type": "DanceSchool", name: `${site.teacher.name} táncórái`, email: site.contact.email, address: place.address },
  ];
  for (const c of site.classes) {
    for (const s of visibleSlots(c.slots, now)) {
      if (s.kind !== "once") continue;
      // Október végéig nyári időszámítás (+02:00); a Review Focus dátumai erre esnek.
      out.push({
        "@context": "https://schema.org", "@type": "Event", name: c.title, description: c.intro,
        startDate: `${s.date}T${pad(s.start)}:00+02:00`, endDate: `${s.date}T${pad(s.end)}:00+02:00`,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: place, organizer: { "@type": "Person", name: site.teacher.name },
        isAccessibleForFree: c.freeTrial,
      });
    }
  }
  return out;
}
```

(Az időzóna-eltolás téli dátumoknál +01:00; ha új, télre eső egyszeri időpont kerül az adatba, a `pad` mellé `Intl`-alapú offset-számítás kell. Ezt egy teszt rögzítse, ha bekerül ilyen dátum.)

- [ ] **Step 3:** `page.tsx`:
```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(new Date())).replace(/</g, "\\u003c") }} />
```

- [ ] **Step 4: `sitemap.ts`, `robots.ts`**

```ts
// sitemap.ts
import type { MetadataRoute } from "next";
const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}
```
```ts
// robots.ts
import type { MetadataRoute } from "next";
const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${base}/sitemap.xml` };
}
```

- [ ] **Step 5: `opengraph-image.tsx`** – 1200×630, a `hero-poster.jpg` háttérrel, a névvel és a „Táncórák Rákoskeresztúron” szöveggel (`next/og` `ImageResponse`; a poster beolvasása `readFile(join(process.cwd(), "public/media/hero-poster.jpg"))`, base64 data URL-ként).

- [ ] **Step 6:** `npm test && npm run build` zöld; commit: `feat: SEO – JSON-LD, sitemap, robots, OG kép`.

---

### Task 11: E2E tesztek

**Files:**
- Create: `tests/e2e/site.spec.ts`

- [ ] **Step 1: `tests/e2e/site.spec.ts`**

```ts
import { expect, test } from "@playwright/test";

test("szekciók és horgonyok", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  for (const id of ["orak", "rolam", "helyszin", "kapcsolat"]) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
  await expect(page.getByText("Minden kedden 18:00–19:00")).toBeVisible();
  await expect(page.getByText("1173 Budapest, Pesti út 193.")).toBeVisible();
});

test("hero videó mozgással, reduced-motion esetén csak kép", async ({ browser }) => {
  const normal = await browser.newPage();
  await normal.goto("/");
  await expect(normal.getByTestId("hero-video")).toHaveCount(1);
  const reduced = await browser.newPage({ reducedMotion: "reduce" });
  await reduced.goto("/");
  await expect(reduced.getByTestId("hero-video")).toHaveCount(0);
  await expect(reduced.getByAltText(/Táncos lassú mozdulatai/)).toBeVisible();
});

test("plakát lightbox Esc-re bezárul", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Plakát megtekintése" }).first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("Resend kulcs nélkül mailto-fallback jelenik meg", async ({ page }) => {
  await page.goto("/#kapcsolat");
  await expect(page.getByTestId("mailto-fallback")).toHaveAttribute("href", /^mailto:tancoloevek@gmail\.com/);
});

test("nincs vízszintes görgetés", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
```

(Az űrlap e2e tesztje kulcs nélkül nem futtatható; az űrlap logikáját a Task 9 unit tesztjei fedik, az űrlap UI-ját a Task 12 ellenőrzi kézzel, `RESEND_API_KEY=re_dummy npm run dev` mellett, ahol a küldés a FALLBACK üzenetet adja.)

- [ ] **Step 2:** `npm run e2e` → mindkét projekt (desktop, mobile) zöld. Commit: `test: e2e – navigáció, hero, lightbox, fallback, overflow`.

---

### Task 12: Critic loop és kivonás

**Files:** bármelyik `src/components/*`, `src/app/globals.css`; kimenet: `docs/critic-log.md`

- [ ] **Step 1: Screenshotok** – `npm run build && npx next start -p 3100` mellett Playwright MCP-vel teljes oldalas képek 1440 és 390 szélességen → `screenshots/iter-N-desktop.png`, `screenshots/iter-N-mobile.png`.

- [ ] **Step 2: Critic subagent** (Agent tool, `general-purpose`, a legerősebb modellel), CSAK a képfájlok útvonalait kapja meg, kódot nem. A prompt:

```
Te egy top design stúdió kreatív igazgatója vagy. Csak a csatolt képernyőképeket látod
(Read: <útvonalak>). Az oldal: egy budapesti tánctanárnő óráit (anya–baba tánc, 50+ tánc)
népszerűsítő weboldal. Értékeld: (1) milyen esztétikát céloz, és mennyire sikerül;
(2) hogyan csinálná ezt egy top stúdió; (3) mely elemek elcsépeltek vagy árulkodnak
AI-generált designról; (4) mi hiányzik. Légy bátor és véleményes, ne biztonsági játékos.
Kimenet: pontszám 1–10, majd legfeljebb 7 konkrét, prioritizált változtatás
(mit, hol, miért). Referenciaszint: a legjobb Awwwards-díjas kisvállalkozói oldalak.
```

- [ ] **Step 3:** A kritikát szűrd a spec és a Global Constraints alapján (pl. nagyobb betűméret a 50+ közönségért nem vita tárgya), és alkalmazd az elfogadottakat. Rögzítsd a `docs/critic-log.md`-be: iteráció, pontszám, elfogadott és elutasított pontok indoklással.

- [ ] **Step 4:** Ismételd a Step 1–3-at, amíg a pontszám ≥ 9 vagy 4 iteráció le nem fut; ha 4 kör után sincs meg a 9, állj meg, és mutasd meg a felhasználónak.

- [ ] **Step 5: Kivonás-kör** – csak törlés: minden díszítés, címke és konténer mellé írd oda, hogy mit ad hozzá; ami semmit, az megy. Utána még egy critic-értékelés.

- [ ] **Step 6:** A Figma (Task 4) frissítése a végleges állapotra (`figma:figma-generate-design`, „update” mód), hogy Figma = kód.

- [ ] **Step 7:** `npm test && npm run e2e && npm run lint` zöld; commit: `design: critic loop és kivonás`.

---

### Task 13: Lighthouse és Vercel deploy

**Files:** nincs új kódfájl (esetleg `vercel.json`, ha kell).

- [ ] **Step 1: Lighthouse lokálisan**
```bash
npm run build && npx next start -p 3100 &
npx lighthouse http://localhost:3100 --form-factor=mobile --only-categories=performance,accessibility,seo --output=json --output-path=./screenshots/lh.json --chrome-flags="--headless"
node -e "const r=require('./screenshots/lh.json').categories;for(const k in r)console.log(k,Math.round(r[k].score*100))"
```
Expected: performance ≥ 90, accessibility ≥ 95, seo = 100. Ha a performance kevés: a hero `<video>` `preload="none"` + poster, kisebb webm, a fontoknál `display: "swap"`.

- [ ] **Step 2: GitHub** – a deploy útja: GitHub repo → Vercel Git-integráció (döntés: felhasználó, 2026-10-06). A `gh` CLI telepítve van, de nincs bejelentkezve: a felhasználó futtatja a `gh auth login`-t (interaktív, az agent nem tudja). Push előtt:
  - `git status --ignored` → a `.env.local` és a `media/raw/` ignorált, a `git log -p | grep -c fal_sk_` → 0 (a kulcs soha nem került commitba);
  - **kérdezd meg** a repó nevét, tulajdonosát (személyes fiók vagy szervezet) és láthatóságát (privát javasolt), és csak kifejezett igen után: `gh repo create <owner>/<name> --private --source . --remote origin --push`.

- [ ] **Step 3: Vercel import** – a felhasználó a vercel.com-on: *Add New → Project → Import Git Repository* (a GitHub-hozzáférést a Vercel kéri). Framework: Next.js (automatikus), nincs build-beállítás. Env változók (Production + Preview): `RESEND_API_KEY` (ha van), `CONTACT_TO_EMAIL=tancoloevek@gmail.com`, `NEXT_PUBLIC_SITE_URL=<a Vercel domain>`. A `FAL_KEY` NEM kerül a Vercelre (csak lokálisan kell). Ezután minden `main`-re pusholt commit production deploy lesz, minden más branch/PR preview.

- [ ] **Step 4: Ellenőrzés** – Playwright MCP-vel nyisd meg a Vercel URL-t: hero videó lejátszik, horgonyok mennek, a térkép betölt, az űrlap vagy a mailto működik, `/sitemap.xml` és `/robots.txt` a valódi domainnel. Lighthouse a éles URL-en is.

- [ ] **Step 5:** Commit (ha volt változás) és összefoglaló a felhasználónak: preview URL, Lighthouse-számok, critic-pontszám, nyitott TODO-k (Facebook URL, Hanna fotója, saját domain a Resendhez, fal kulcs rotálása).
