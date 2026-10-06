import { site } from "@/content/site";
import { Letterboard } from "./Letterboard";
import { LoopVideo } from "./LoopVideo";

export function Hero() {
  const { hero, teacher } = site;
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] items-end overflow-hidden">
      <LoopVideo mp4="/media/hero.mp4" webm="/media/hero.webm" poster="/media/hero-poster.jpg" alt="Táncos lassú mozdulatai egy napfényes stúdióban" />
      <div aria-hidden className="absolute inset-0 bg-felt/55" />
      <div className="relative mx-auto grid w-full max-w-[1360px] gap-6 px-4 pb-28 pt-20 md:grid-cols-12 md:items-end md:gap-8 md:px-8 md:pb-20">
        <div className="md:col-span-6">
          <p className="mb-4 hidden text-sm uppercase tracking-[0.28em] text-letter-soft md:block">{hero.kicker}</p>
          <h1 id="hero-title" className="max-w-[11ch] font-display text-[clamp(2rem,6.4vw,5rem)] font-bold uppercase leading-[1.1]">
            {hero.headline}
          </h1>
          <p className="mt-4 max-w-[34ch] text-xl md:mt-5 md:text-2xl">{hero.sub}</p>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <Letterboard />
        </div>
        <p className="sr-only">
          {teacher.name}, {teacher.role}
        </p>
      </div>
    </section>
  );
}
