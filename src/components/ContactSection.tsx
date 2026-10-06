import { Suspense } from "react";
import { site } from "@/content/site";
import { isContactFormEnabled } from "@/lib/contact";
import { ContactForm } from "./ContactForm";

export function ContactSection() {
  const { email, facebookUrl, facebookHandle } = site.contact;
  return (
    <section id="kapcsolat" aria-labelledby="kapcsolat-title" className="border-t border-letter/10">
      <div className="mx-auto grid max-w-[1360px] gap-12 px-4 py-20 md:grid-cols-12 md:px-8 md:py-32">
        <div className="md:col-span-5">
          <h2 id="kapcsolat-title" className="font-display text-[clamp(2.2rem,6vw,4.5rem)] font-semibold uppercase leading-[0.95]">
            Gyere, táncolj velem!
          </h2>
          <p className="mt-6 text-xl text-letter-soft">Mindenkit szeretettel várok egy ingyenes próbaórára.</p>
          <ul className="mt-8 grid gap-2 text-xl">
            <li>
              <a className="inline-flex min-h-11 items-center underline underline-offset-4" href={`mailto:${email}`} data-testid="mailto">
                {email}
              </a>
            </li>
            <li>
              <a className="inline-flex min-h-11 items-center underline underline-offset-4" href={facebookUrl} target="_blank" rel="noopener">
                Facebook: {facebookHandle}
              </a>
            </li>
          </ul>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          {isContactFormEnabled() ? (
            <Suspense>
              <ContactForm />
            </Suspense>
          ) : (
            <a
              href={`mailto:${email}?subject=${encodeURIComponent("Jelentkezés táncórára")}`}
              className="inline-flex min-h-12 items-center rounded-full bg-clay px-8 text-lg font-semibold text-felt"
              data-testid="mailto-fallback"
            >
              Írok egy e-mailt
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
