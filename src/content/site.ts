export type Weekday = "hétfő" | "kedd" | "szerda" | "csütörtök" | "péntek" | "szombat" | "vasárnap";
export type Slot =
  | { kind: "weekly"; weekday: Weekday; start: string; end: string }
  | { kind: "once"; date: string; start: string; end: string; label: string };
export type Img = { src: string; alt: string; width: number; height: number };
export type ClassSlug = "broadway" | "tancolo-evek";
export type DanceClass = {
  slug: ClassSlug;
  title: string;
  /** Rövid név a hero betűtáblájához. */
  shortTitle: string;
  tagline: string;
  audience: string;
  intro: string;
  highlights: string[];
  /** Hosszabb leírás a „Bővebben” mögött. */
  more?: { paragraphs: string[]; forWhom: string[] };
  slots: Slot[];
  poster: Img;
  image: Img;
  accent: "powder" | "sun";
  freeTrial: boolean;
  joinAnytime: boolean;
};

const classes: DanceClass[] = [
  {
    slug: "broadway",
    title: "Broadway Jazz & Show Tánc",
    shortTitle: "Broadway Jazz & Show",
    tagline: "Tánc • zene • élmény",
    audience: "Felnőtteknek",
    intro:
      "Lépj be a színházi táncok izgalmas, nőies és lendületes világába! Szereted a musicalek hangulatát, a látványos koreográfiákat és az igazán karakteres zenéket?",
    highlights: [
      "Látványos koreográfiák",
      "Nőies mozgás",
      "Testtudat és koordináció",
      "Felszabadult hangulat",
      "Nem számít, ha még sosem táncoltál!",
    ],
    more: {
      paragraphs: [
        "A Broadway Jazz & Show Tánc órákon a színházi világ inspirálta mozgásformák, a zene és a felszabadult tánc találkoznak.",
        "Az órák során különböző zenei stílusokhoz és hangulatokhoz illő koreográfiákat tanulunk, miközben fejlesztjük a ritmusérzéket, a koordinációt, a testtudatot és a szép testtartást. A hangsúly a mozgás örömén, az önkifejezésen és azon van, hogy mindenki megtalálja a saját stílusát.",
        "Nem szükséges előzetes tánctudás vagy különleges hajlékonyság! Az órákon kezdőként is bátran részt vehetsz, hiszen a cél nem a tökéletesség, hanem a fejlődés, az élmény és az önfeledt kikapcsolódás.",
        "A tematika folyamatosan változik: új zenék, különböző hangulatok és izgalmas koreográfiák várnak, így mindig tartogatunk valami újat.",
      ],
      forWhom: [
        "Ha szeretnél kiszakadni a hétköznapokból, és időt szánni önmagadra.",
        "Ha vonz a musicalek és a színházi táncok világa.",
        "Ha szívesen tanulnál nőies, látványos koreográfiákat.",
        "Ha szeretnél magabiztosabban mozogni, és közben jól érezni magad.",
      ],
    },
    slots: [],
    poster: { src: "/posters/broadway.png", alt: "Broadway Jazz & Show Tánc felnőtteknek – az óra plakátja", width: 1024, height: 1536 },
    image: { src: "/media/broadway.jpg", alt: "Fekete ruhás táncosnő jazz-pózban, színpadi fények előtt", width: 384, height: 480 },
    accent: "powder",
    freeTrial: false,
    joinAnytime: false,
  },
  {
    slug: "tancolo-evek",
    title: "Táncoló Évek",
    shortTitle: "Táncoló Évek 50+",
    tagline: "Tánc, közösség és életöröm 50 év felettieknek",
    audience: "50 év felettieknek",
    intro: "Egy kellemes órára kiszakadunk a hétköznapokból: mozgunk, táncolunk, és közben jól érezzük magunkat.",
    highlights: [
      "Könnyen követhető alaplépések és ritmusgyakorlatok",
      "Sokszínű zene és mozgásformák",
      "Kímélő, ízületbarát átmozgatás, mindenki a saját tempójában",
      "Támogató, felszabadult légkör",
      "Új ismerősök és egy barátságos közösség",
    ],
    slots: [
      { kind: "weekly", weekday: "kedd", start: "18:00", end: "19:00" },
    ],
    poster: { src: "/posters/tancolo-evek.png", alt: "Táncoló Évek – az óra plakátja", width: 1024, height: 1536 },
    image: { src: "/media/tancolo-evek.jpg", alt: "Mosolygó, 50 év feletti táncosok egy világos stúdióban", width: 1612, height: 2000 },
    accent: "sun",
    freeTrial: false,
    joinAnytime: true,
  },
];

export const site = {
  name: "Táncoló Évek",
  teacher: { name: "Hallgat Hanna", role: "Táncművész, tánctanár" },
  hero: {
    kicker: "Táncórák Budapesten, Rákoskeresztúron",
    headline: "Mozdulj velem a zenére.",
    sub: "Felszabadult, jókedvű táncórák – tánctapasztalat nélkül is.",
    cta: "Jelentkezem",
  },
  about: {
    heading: "Rólam pár szó",
    paragraphs: [
      "Hallgat Hanna vagyok, táncművésznek tanultam. Mindig is közel állt hozzám a tánc, a mozgás és a tanítás. Hiszek abban, hogy a tánc nemcsak mozgás, hanem öröm, önkifejezés és közösségi élmény is, amelyet szeretnék minél több emberrel megosztani.",
      "Szeretném, ha az óráimon mindenki felszabadultan, jókedvűen mozogna, függetlenül attól, hogy van-e korábbi tánctapasztalata.",
    ],
    more: [
      "A Nemes Nagy Ágnes Művészeti Szakgimnáziumban tanultam (2021–2026), ahol 2026-ban megszereztem a Színházi Táncos II. végzettséget. A képzés során sok műfajban mélyülhettem el: klasszikus balett, modern- és jazz-balett, partnering, show-tánc, hip-hop, Limón technika, társastánc, néptánc és akrobatika.",
      "15 éve táncolok; színházi táncos növendékként a klasszikus balett alapjaira építkeztem, és azóta sokféle tánctechnikai, színpadi és musical tapasztalatot gyűjtöttem. A Gregor József Általános Iskolában 8 évig tanultam zenét, énekeltem a kórusban, és egyéni énekversenyeken is kipróbáltam magam.",
      "Az alapokat az Ékszer Balett Táncegyesületben szereztem: 2020-ban klasszikus balett alapvizsgát tettem, emellett spicc technikát, jazz-balettet, steppet, mazsorettet és akrobatikát tanultam. Többször is az idősebb korosztályba soroltak. 2019 és 2021 között a balett társulat fizetett tagjaként rendszeresen felléptem a Stefánia Palotában, ahol olyan hivatásos balettművészekkel dolgozhattam együtt, mint Csizmadia Tamás, Csuja Gergely és Gajárszky Márton. Színpadra álltam többek között a Hófehérke, a Hattyúk tava, az Anasztázia, a Jégvarázs, a Szépség és a Szörny, az Aladdin, a Bűbáj, az Oroszlánkirály és a Diótörő előadásaiban.",
      "A színház és a musical világát is korán megismertem: az iskolai musical szakkörben kiemelt táncos szerepeket kaptam a Shrek, a Matilda és A kis hableány előadásaiban. 2020-ban nyertes tehetségprogram-pályázatommal a jelmezek, a díszlet és az előadásrészletek megvalósításában is részt vettem.",
      "Néhány pillanat, amire különösen büszke vagyok: 2022-ben a Nemzeti Színházban táncoltam az Ádámok és Évák című előadásban, 2023-ban Magyarországot képviselve csapatunkkal különdíjat nyertünk a Szarajevói Nemzetközi Fesztiválon, 2025-ben pedig Góbi Ritával alkottunk együtt a The End of a Chapter című projektben.",
      "Jelenleg óvodásoknak és kisiskolásoknak tanítok klasszikus balettet, felnőtteknek pedig táncórákat tartok, mert szeretném, ha a mozgás és a tánc öröme mindenkinek elérhető lenne.",
      "A munkámban fontos számomra a pontos balett technika, a magabiztos színpadi jelenlét, a kitartás és a fegyelem, és mindezt csapatszellemmel és az előadóművészet iránti elhivatottsággal szeretném továbbadni.",
    ],
    photo: { src: "/media/hanna-portre.jpg", alt: "Hallgat Hanna mosolyogva, fekete háttér előtt", width: 1365, height: 2048 } as Img,
  },
  venue: {
    name: "Allstars Dance Studio",
    street: "Pesti út 193.",
    zip: "1173",
    city: "Budapest",
    directions: "Rákoskeresztúr Városközponttól kb. 5 percre",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Allstars+Dance+Studio+Budapest+Pesti+%C3%BAt+193",
    mapsEmbedUrl: "https://www.google.com/maps?q=Allstars+Dance+Studio,+1173+Budapest,+Pesti+%C3%BAt+193&output=embed",
  },
  contact: {
    email: "tancoloevek@gmail.com",
    facebookUrl: "https://www.facebook.com/profile.php?id=61594872557451",
  },
  classes,
};
