# Design irány – Hallgat Hanna táncórák

## Felület
Web. Elsődleges méret: **mobil** (a látogatók jellemzően Facebookról, telefonon érkeznek; a 50+ közönség miatt nagy betű, nagy célterület). A desktop a mobil kiterjesztése.

## Seed
`eDVYJSlem2AlDcyQeG6jv5vg` (24 kar., számjegy-arány 0,12 → meleg sáv, hue 18; kerek többség 10:7; számjegy-közök [9,3] → egyenetlen ritmus)

## Irány
- Ásási terület (v1 = 14 % 5 = 4): **a nyilvántartás** – ahogyan ez a szakma számol, órarendet ír, nyilvántart.
- Jelöltek (a kiválasztás ELŐTT felírva):
  0. Laban-féle táncjegyzet (Labanotation, 1928) – függőleges kotta, szimbólumok
  1. Bálkönyvecske / táncrend (1890-es évek) – kis karton, sorszámozott táncok, partnernevek
  2. Színpadi „spike” jelölőszalag a próbaterem padlóján – pozíciók, színkódolt csíkok
  3. **Művelődési házi cserélhető betűs programtábla (1970-es évek)** – hornyolt fekete filc, nyomkodható fehér műanyag betűk, a heti órarend
  4. Koreográfus 8-as számolólapja – „1-2-3-4-5-6-7-8” rács, ütemekre bontott jegyzet
- Választás (v2 = 13 % 5 = 3): **a programtábla.** A partner Közösségi Élet Központ és a Rákoskeresztúri közösségi közeg miatt ez a környék saját tárgya, nem egy általános „tánc-esztétika”.

## Döntések
| Döntés | Félretett alapértelmezés | Opciók | Érték | Eredmény |
|---|---|---|---|---|
| Harmónia | monokróm | mono / analóg / komplementer / split / triád | 31 % 5 = 1 | **analóg** a hue 18 körül → terrakotta, púder, napsárga egy családban; az égkék az egyetlen hideg hang (fókusz, apró jelölés) |
| Háttér | lapos krém | hornyolt filc-csíkozás a sötét szekciókon / krém + táblapanel / **az egész oldal filc** / váltakozó sávok | 34 % 4 = 2 | **az egész oldal sötét filc**, finom vízszintes horonymintával; a világos elemek „kitűzött” lapok |
| Tipográfia | elegáns serif + Inter | lekerekített kondenzált nagybetű / caps + puha serif / kerek mono / **széles, kerek geometrikus display** | 19 % 4 = 3 | **Unbounded** (display, gyakran csupa nagybetű, a betűtábla műanyag betűinek visszhangja) + **Atkinson Hyperlegible Next** (törzsszöveg, gyengénlátóknak tervezve – a 50+ közönségért) |
| Layout | szimmetrikus 12 hasábos rács | balra tolt gerinc 1/3-nál / **tábla-sorok** / 5:7 váltakozó hasábok | 28 % 3 = 1 | **tábla-sorok**: a szekciók egymás alatti, balra zárt „betűsorokból” állnak, rongyos jobb széllel, a horony-ritmusra (8px) igazítva |
| Legnagyobb elem | hero címsor | **az órarend** / hero címsor / óranevek | 21 % 3 = 0 | **az időpontok a legnagyobbak**: „KEDD 18:00” táblabetűkkel, ez a legfontosabb információ |
| Navigáció | fehér sticky top bar | nincs fejléc / vékony felső sáv / **betűtábla-csík fejléc** | 14 % 3 = 2 | keskeny, filc hátterű **betűtábla-csík** fejléc ritkított nagybetűkkel |
| Panelek | rounded-xl + árnyék | táblakeret / **kitűzött papírlap ragasztócsíkkal** / csak hornyok | 22 % 3 = 1 | az órák blokkjai **kitűzött papírlapok** (púder, illetve napsárga), egy-egy áttetsző ragasztócsíkkal; árnyék helyett 1px sötétebb él |
| Képek | full-bleed fotó | fehér keretes print / duotone / **lekerekített „betűlap” kivágás** | 2 % 3 = 2 | **lekerekített téglalap kivágás** (radius 28px – a kerek többség) |
| Sűrűség | levegős | levegős / **közepes** / sűrű | 10 % 3 = 1 | közepes |
| Mozgás | fade-up görgetésre | **karakterenként a horonyba csúszó betűk** / lapozós tábla / ringatózó képek / csak a videó | 21 % 4 = 1 | a „lapozós tábla” a tábla nyelvén olvasva: az **időpontok karakterei egyenként becsúsznak a horonyba**, amikor láthatóvá válnak. Reduced-motion esetén nincs animáció. Más mozgás nincs (a hero videón kívül). |
| Kis kijelző | egymás alá rendezés | forrássorrend / **állandó alsó akciósáv** / órarend előre | 13 % 3 = 1 | mobilon **állandó alsó akciósáv** „Ingyenes próbaóra” gombbal, hüvelykujj-közelben |
| Sötét mód | – | – | – | nincs külön: az oldal eleve sötét filc |

## Design system
| Token | Hex | Szerep |
|---|---|---|
| `felt` | `#1f1713` | oldalháttér (filc) |
| `felt-raised` | `#2d231f` | kiemelt sötét felület, fejléc |
| `groove` | `rgb(255 255 255 / 0.045)` | horonyvonalak (8px ritmus) |
| `letter` | `#f4ece0` | fő szöveg sötéten (15,1:1) |
| `letter-soft` | `#c4b6a6` | másodlagos szöveg (8,9:1) |
| `clay` | `#d9774a` | elsődleges akció háttér, rajta `felt` szöveg (5,6:1) |
| `powder` / `powder-ink` | `#f1d6cf` / `#5a2531` | anya–baba lap (8,8:1) |
| `sun` / `sun-ink` | `#f5c84c` / `#3a2a00` | Táncoló Évek lap (8,8:1) |
| `sky` | `#7cbde6` | fókuszgyűrű, apró jelölések (8,6:1 filcen) |

- Betűk: display `Unbounded` (500–800), törzs `Atkinson Hyperlegible Next` (400/600/700), mindkettő `latin-ext`.
- Radiusok: képek 28px; gombok 999px (pill – a kerek többség); papírlapok 4px.
- Ritmus: 8px horony; szekció-térközök 96/128px desktopon, 64/80px mobilon.
- Árnyék: nincs. Gradiens: nincs (a horonyminta ismétlődő 1px vonal, nem színátmenet).
- Hangulat: *egy meleg közösségi ház hirdetőtáblája este, amikor kint már sötét, bent szól a zene.*

## Tilos lista
Kék-fehér SaaS hero; középre zárt hero + 3 egyforma kártya; `rounded-2xl` mindenhol; glow, árnyék, gradiens; emoji az UI-ban; stock-ikonsor a highlightoknál.

## Figma
https://www.figma.com/design/iVnfcurht1PJm1TDl24Y6m

- **Oldaltervek** oldal: `Desktop 1440` és `Mobile 390` – a végleges (critic loop utáni) kód pixelpontos rögzítése (html-to-design capture, reduced-motion állapot: a hero videó helyén a poszterkép).
- **Hanna tokens** változógyűjtemény: 12 szín, 9 térköz, 2 sarokkerekítés, megfelelő scope-okkal; mellette `Tokens – színek` minta-tábla a változókhoz kötve.
- A betűtípusok (Unbounded, Atkinson Hyperlegible Next, Martian Mono) Google Fonts-ból elérhetők a Figmában is.

## Felülírt seed-döntések (critic loop)
- Gombok: pill → 3px-es „címkéző” téglalap (a kritikus 3 körön át template-elemnek ítélte).
- Képek: 28px-es lekerekítés → ragasztott fotóprint fehér szegéllyel (a ragasztószalaggal ütközött).
- Szekciócímek és adatok: Martian Mono (wdth 75) betűtábla-betű; a széles Unbounded a hero szlogenre és a papírlapokra korlátozva.
- Időpontok animációja: motion helyett tisztán CSS scroll-driven (JS nélkül is olvasható).
