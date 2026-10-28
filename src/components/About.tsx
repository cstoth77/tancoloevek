import { site } from "@/content/site";
import { BoardHeading } from "./BoardHeading";
import { Print } from "./Print";

/** Fotóprint és egy keskenyebb bemutatkozó lap egymás mellett. */
export function About() {
  const { about } = site;
  return (
    <section id="rolam" aria-labelledby="rolam-title" className="mx-auto grid max-w-[1360px] gap-10 px-4 py-16 md:grid-cols-12 md:items-end md:px-8 md:py-20">
      <BoardHeading id="rolam-title" className="md:col-span-12 md:justify-self-start">
        {about.heading}
      </BoardHeading>
      <Print img={about.photo} sizes="(min-width: 768px) 30vw, 100vw" imgClassName="object-top" tape="left-8 -rotate-[4deg] bg-sun/75" className="mx-6 aspect-[4/5] md:col-span-4 md:mx-0 md:aspect-[4/5] md:sticky md:top-24 md:self-start md:-rotate-[1deg]" />
      <div className="relative bg-powder px-5 pb-8 pt-10 text-powder-ink md:col-span-7 md:col-start-6 md:px-12 md:py-12">
        <span aria-hidden className="absolute -top-3 right-12 h-7 w-28 rotate-[3deg] bg-tape/85" />
        {about.paragraphs.map((p, i) => (
          <p key={p} className={`max-w-[52ch] text-xl ${i ? "mt-5" : ""}`}>
            {p}
          </p>
        ))}
        <details className="group mt-5">
          <summary className="inline-flex min-h-11 cursor-pointer list-none items-center font-semibold underline underline-offset-4 [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Bővebben</span>
            <span className="hidden group-open:inline">Kevesebb</span>
          </summary>
          {about.more.map((p) => (
            <p key={p} className="mt-4 max-w-[60ch] text-lg">
              {p}
            </p>
          ))}
        </details>
      </div>
    </section>
  );
}
