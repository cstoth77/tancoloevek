import { site } from "@/content/site";
import { LoopVideo } from "./LoopVideo";

export function Hero() {
  const { hero, teacher } = site;
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] items-end overflow-hidden">
      <LoopVideo mp4="/media/hero.mp4" webm="/media/hero.webm" poster="/media/hero-poster.jpg" alt="Táncos lassú mozdulatai egy napfényes stúdióban" />
      <div aria-hidden className="absolute inset-0 bg-felt/55" />
      <div className="relative mx-auto w-full max-w-[1360px] px-4 pb-28 pt-28 md:px-8 md:pb-24">
        <p className="mb-5 text-sm uppercase tracking-[0.28em] text-letter-soft">{hero.kicker}</p>
        <h1 id="hero-title" className="max-w-[11ch] font-display text-[clamp(2.6rem,8.5vw,7.5rem)] font-bold uppercase leading-[1.1]">
          {hero.headline}
        </h1>
        <p className="mt-6 max-w-[34ch] text-xl md:text-2xl">{hero.sub}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a href="#kapcsolat" className="hidden min-h-12 items-center rounded-full bg-clay px-7 text-lg font-semibold text-felt md:inline-flex">
            {hero.cta}
          </a>
          <a href="#orak" className="inline-flex min-h-12 items-center rounded-full border border-letter/60 px-7 text-lg">
            Az órák
          </a>
        </div>
        <p className="sr-only">
          {teacher.name}, {teacher.role}
        </p>
      </div>
    </section>
  );
}
