Szerep: Világszínvonalú frontend designer és Next.js fejlesztő vagy. Feladatod Hallgat Hanna
táncművész-tanár óráit bemutató, magyar nyelvű, egyoldalas weboldal megtervezése és megépítése,
amely a Vercelen fut. Nincs felhasználói oldal: a cél a bemutatás, az órák, a helyszín, az
elérhetőség és a kapcsolatfelvétel.

FORRÁSOK (ezek az igazság forrásai, ne találj ki adatot):
- /description: az órák szövegei és Hanna bemutatkozása.
- /images/*: az aktuális plakátok. Minden időpont, helyszín és elérhetőség innen jön.
  Ellentmondás esetén a plakát az irányadó.
- Hiányzó adatnál (telefonszám, ár) NE találj ki semmit: hagyd ki az elemet, vagy jelöld
  TODO-ként az adatfájlban.

TECHNOLÓGIA:
- Next.js 16 App Router, TypeScript strict, statikus generálás. Tailwind CSS v4 (CSS-first
  @theme tokenek), Motion (motion/react) a mikroanimációkhoz.
- A tartalom egyetlen típusos fájlban van: src/content/site.ts (classes[], venue, contact, about).
  A komponensek csak innen olvasnak, nincs hardcode-olt szöveg a JSX-ben.
- Kapcsolati űrlap: Server Action + Zod validáció + Resend (RESEND_API_KEY, CONTACT_TO_EMAIL).
  Honeypot mező az spam ellen. Ha nincs API-kulcs, az űrlap helyén a mailto-gomb jelenjen meg.
- SEO: metadata, Open Graph kép, schema.org JSON-LD (Person + DanceSchool + Event az órákra),
  hu lang, sitemap, robots.
- Képek: next/image. Videó: <video autoplay muted loop playsinline> poster képpel, mp4 (H.264)
  és webm formátumban, legfeljebb ~3 MB. prefers-reduced-motion esetén csak a poszterkép
  jelenik meg.
- Akadálymentesség: WCAG 2.1 AA kontraszt, a szöveg a videó fölött is olvasható,
  billentyűzettel teljesen kezelhető. A 50+ célcsoport miatt legalább 18 px-es alapbetű
  és nagy kattintási felületek.

DESIGN FOLYAMAT (kötelező sorrend):
1. SEED: Shell scripttel generálj egy hosszú, véletlen alfanumerikus stringet. Ebből vezesd le
   a kreatív irányt (paletta-arányok, tipográfiai karakter, ritmus, layout-aszimmetria),
   a stringben rejlő mintázatokat is keresve. A seedet ne írd ki az oldalra. A sablonos
   „AI-kinézetet” kerülöd: nincs kék-fehér SaaS-hero, nincs középre zárt hero + három
   egyforma kártya, nincs mindenhol rounded-2xl, nincsenek öncélú gradiensek, glow-k
   és árnyékok.
2. KONKRÉT INSPIRÁCIÓ: A téma a tánc. A layout ritmusa legyen zenei (ütemek, szünetek), a
   tipográfia mozogjon (kontrasztos display-betű és jól olvasható szövegbetű, mindkettő teljes
   magyar ékezetkészlettel: ő, ű). Egy szekció olyan legyen, mint egy kimerevített
   képkocka egy táncfilmből.
3. MÁRKA ÉS ALPROGRAMOK: Hallgat Hanna egy közös alapszínvilág. Az anya–baba óra púder/krém,
   a Táncoló Évek napsárga/égkék akcentust kap, a plakátok hangulatából kiindulva, de
   kifinomultabban, nem harsányan.
4. FIGMA: Az új Figma fájlban (figma-use / figma-generate-design / figma-generate-library
   skillek) előbb a változókat hozd létre (szín, típus, spacing), utána a komponenseket
   (ClassCard, ScheduleRow, ContactForm, Nav, Footer), végül a desktop (1440) és a mobil (390)
   oldaltervet. A kód ezt a Figmát követi.
5. MÉDIA (fal.ai, fal-media-generation skill):
   - Hero loop: egy női táncos (NEM Hanna, nem felismerhető, általános alak) lassú, elegáns
     mozdulatai egy napfényes, fapadlós, nagy ablakos stúdióban. Előbb a kezdőképkockát generáld
     (képmodell), majd image-to-video ugyanazzal az első és utolsó képkockával, hogy a hurok
     zökkenőmentes legyen. 5–8 mp, vízszintes. Ffmpeg-gel tömöríts és vágj (crossfade a
     hurokpontnál, ha kell).
   - Hangulatképek: anya–baba tánc (hordozókendő), 50+ csoportos tánc. Valódi, meleg
     fotóstílus, ne illusztráció. Egyik se ábrázolja Hannát.
   - Hanna portréja helyére arc nélküli helykitöltő kerül (pl. táncos láb vagy kéz részletfotó),
     egy fájlcserével lecserélhető (public/media/hanna.jpg).
   - Minden promptot és modellazonosítót ments el: media/PROMPTS.md.
6. KRITIKUS LOOP: Minden nagyobb iterációnál Playwrighttal készíts képernyőképeket
   (desktop és mobil), és adj át egy külön „design critic” subagentnek, aki CSAK a képeket
   látja, a kódot nem. Kritériumai: hogyan csinálná ezt egy top design stúdió, melyek az
   elcsépelt minták, mi árulkodik AI-generált designról. Legyen bátor és véleményes.
   1–10-es skálán pontoz, a cél ≥ 9. A kritikát te szűrd és alkalmazd.
7. KIVONÁS: A végén egy külön kör, amelyben csak törölsz: fölösleges dekoráció, redundáns
   címkék, magyarázó szövegek, üres konténerek. A visszafogottság = minőség.

OLDALSZERKEZET (egy oldal, horgonyokkal):
Nav (Hanna neve + Órák / Rólam / Helyszín / Kapcsolat + „Ingyenes próbaóra” CTA)
→ Hero (loop videó, név, egymondatos ígéret, CTA)
→ Órák (alprogramonként saját színvilágú blokk: kinek szól, mire számíthat, időpontok,
  „plakát megtekintése” lightbox, jelentkezés-gomb előre kiválasztott órával)
→ Rólam (Hanna szövege a description fájlból)
→ Helyszín (cím, megközelítés, beágyazott térkép (OpenStreetMap vagy Google Maps), útvonaltervezés-link)
→ Kapcsolat (űrlap: név, e-mail, melyik óra, üzenet + mailto + Facebook)
→ Footer (partnerek, elérhetőség, ©)

HANG: Meleg, közvetlen, tegező, ahogy a description fájl is. Emoji csak mértékkel vagy
egyáltalán ne kerüljön az UI-ba.

KÉSZ, HA: npm run build és lint hibamentes; a Lighthouse eredmény mobilon Performance ≥ 90,
A11y ≥ 95, SEO 100; a critic ≥ 9/10; minden adat egyezik a plakátokkal; az oldal fut a
Vercel preview-n.
