export type Weekday = "hétfő" | "kedd" | "szerda" | "csütörtök" | "péntek" | "szombat" | "vasárnap";
export type Slot =
  | { kind: "weekly"; weekday: Weekday; start: string; end: string }
  | { kind: "once"; date: string; start: string; end: string; label: string };
export type Img = { src: string; alt: string; width: number; height: number };
export type ClassSlug = "anya-baba" | "tancolo-evek";
export type DanceClass = {
  slug: ClassSlug;
  title: string;
  /** Rövid név a hero betűtáblájához. */
  shortTitle: string;
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

const classes: DanceClass[] = [
  {
    slug: "anya-baba",
    title: "Táncolj együtt a babáddal!",
    shortTitle: "Anya–baba tánc",
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
    image: { src: "/media/anya-baba.jpg", alt: "Anyuka hordozókendőben táncol a babájával egy napfényes stúdióban", width: 1612, height: 2000 },
    accent: "powder",
    freeTrial: true,
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
      { kind: "weekly", weekday: "szerda", start: "10:00", end: "11:00" },
    ],
    poster: { src: "/posters/tancolo-evek.png", alt: "Táncoló Évek – az óra plakátja", width: 1024, height: 1536 },
    image: { src: "/media/tancolo-evek.jpg", alt: "Mosolygó, 50 év feletti táncosok egy világos stúdióban", width: 1612, height: 2000 },
    accent: "sun",
    freeTrial: true,
    joinAnytime: true,
  },
];

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
    photo: { src: "/media/hanna.jpg", alt: "Táncos lábak a stúdió fapadlóján", width: 1570, height: 2000 } as Img,
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
    facebookHandle: "@AktívSzeniorTánc",
    // TODO: a pontos Facebook-oldal URL-t Hannától kérjük el; addig keresési link.
    facebookUrl: "https://www.facebook.com/search/top?q=Akt%C3%ADv%20Szenior%20T%C3%A1nc",
  },
  partners: ["Közösségi Élet Központ", "Szenior Aktivitás Egyesület"],
  classes,
};
