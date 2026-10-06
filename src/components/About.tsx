import Image from "next/image";
import { site } from "@/content/site";

export function About() {
  const { about } = site;
  return (
    <section id="rolam" aria-labelledby="rolam-title" className="mx-auto grid max-w-[1360px] gap-10 px-4 py-20 md:grid-cols-12 md:px-8 md:py-32">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] md:col-span-4 md:col-start-2">
        <Image src={about.photo.src} alt={about.photo.alt} fill sizes="(min-width: 768px) 30vw, 100vw" className="object-cover" />
      </div>
      <div className="md:col-span-6 md:col-start-7 md:self-end">
        <h2 id="rolam-title" className="font-display text-[clamp(2.2rem,5vw,4rem)] font-bold uppercase leading-[1.1]">
          {about.heading}
        </h2>
        {about.paragraphs.map((p) => (
          <p key={p} className="mt-6 max-w-[52ch] text-xl text-letter">
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
