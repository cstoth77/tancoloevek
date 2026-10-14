import { Suspense } from "react";
import { site } from "@/content/site";
import { isContactFormEnabled } from "@/lib/contact";
import { ContactForm } from "./ContactForm";

/** Az utolsó kitűzött lap: jelentkezés. */
export function ContactSection() {
  const { email, facebookUrl } = site.contact;
  const formEnabled = isContactFormEnabled();
  return (
    <section id="kapcsolat" aria-labelledby="kapcsolat-title" className="py-12 md:py-16">
      <div className="mx-auto max-w-[1360px] px-4 md:px-8">
      <div className="relative grid gap-10 bg-letter px-5 pb-10 pt-12 text-felt md:grid-cols-12 md:px-14 md:pb-14 md:pt-16">
        <span aria-hidden className="absolute -top-3 left-1/2 h-7 w-32 -translate-x-1/2 rotate-[2deg] bg-sun/80" />
        <div className={formEnabled ? "md:col-span-5" : "md:col-span-12"}>
          <h2 id="kapcsolat-title" className="font-display text-[clamp(2.2rem,6vw,4.5rem)] font-bold uppercase leading-[1.1]">
            Gyere, táncolj velem!
          </h2>
          <p className="mt-5 max-w-[40ch] text-xl">Mindenkit szeretettel várok az óráimon. Írj nekem, és megbeszéljük a részleteket.</p>
          <p className="mt-4 text-xl font-semibold">{email}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={`mailto:${email}?subject=${encodeURIComponent("Jelentkezés táncórára")}`}
              className="inline-flex min-h-12 items-center justify-center rounded-[3px] bg-clay px-7 text-lg font-semibold text-felt"
              data-testid={formEnabled ? "mailto" : "mailto-fallback"}
            >
              E-mail írása
            </a>
            <a href={facebookUrl} target="_blank" rel="noopener" className="inline-flex min-h-12 items-center justify-center rounded-[3px] border-2 border-felt px-7 text-lg font-semibold">
              Facebook
            </a>
          </div>
        </div>
        {formEnabled && (
          <div className="md:col-span-6 md:col-start-7">
            <Suspense>
              <ContactForm />
            </Suspense>
          </div>
        )}
      </div>
      </div>
    </section>
  );
}
