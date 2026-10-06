# Design critic napló

A kritikus minden körben friss subagent (Opus) volt, és CSAK képernyőképeket látott (desktop 1440, mobil 390). A javaslatokat a spec és a Global Constraints alapján szűrtük.

| Kör | Pontszám | Elfogadva | Elutasítva (indok) |
|---|---|---|---|
| 1 | 5/10 | órarend a hero-ba betűtáblaként; fekete „LED” időpontdobozok ki; szögletes papírlapok, desktopon enyhe dőlés, fotók ragasztott printként; desktop egyensúly; mobil gombtörés; térkép-placeholder helyett útvonal-kártya; kapcsolat egy kitűzött lapon | telefonszám/Messenger (nincs ilyen adat, nem találunk ki); Hanna arcképe (valódi fotóra várunk, AI-portré tilos); tépett papírszél (giccsveszély) |
| 2 | 6/10 | monospace „műanyag” betű a táblán (Martian Mono, wdth 75), vékony keret, egy ferde betű; mobilon a tábla feljebb; Helyszín és Rólam kitűzött lap; egységes elsődleges gomb; változatos szalag; őszintébb 50+ fotó (újragenerálva); mobilon 4:3 fotó, rövid gombok, egyhasábos lista | a hero szlogen törlése (márkaszöveg marad, csak kisebb lett); tépett fül gombok, papírtextúra |
| 3 | 6/10 | szekciócímek betűtábla-fonttal; a tábla utolsó sora kattintható CTA; mobilon a lap a fotó előtt; változatos szög/szalag; egységes bal él, kisebb térközök; szögletes „címkéző” gombok (a seed pill-döntése felülírva); záró betűtábla-lábléc | tépett szél, rajzszög (megkötés) |
| 4 | 6/10 | szekciócímek betűtábla-csíkon (BoardHeading); szigorú betű-szerepek (mono = tábla, grotesk = papír); csak 1–2 dőlt elem; Helyszín kártya teljes sorban; külön hero-gomb ki; nagy záró tábla a láblécben | mobilon fotó a lap fölé (a 3. kör épp az ellenkezőjét kérte; az időpont a fontosabb) |

Megjegyzés: a 3. körben a kritikus még a régi 50+ fotót látta, mert a `next/image` gyorsítótára (`.next/cache/images`) ugyanarra az URL-re a régi képet adta. A gyorsítótár törölve.

**Eredmény:** 4 kör után a pontszám 6/10-en állt meg (a terv küszöbe 9). A terv szerint itt megálltunk, és a végleges állapotot a felhasználó elé tesszük. A visszatérő, el nem fogadott kifogások: „template-elemek” (szaggatott vonal, „—” lista, polaroid, szalag, sötétített hero-videó), illetve az AI-fotók. Ezek egy része a koncepció lényege, más része csak valódi fotókkal oldható meg.

## Kivonás-kör
- Kapcsolat lap: a Facebook-név szövegként is szerepelt a gomb mellett, ezért a szöveges sort töröltük. Az e-mail cím szövegként marad, mert ki lehet másolni.
- Korábbi körökben törölve: a külön hero-gomb, a fekete időpontdobozok, a kétoszlopos highlight-lista, a duplikált mobil hero-CTA.
