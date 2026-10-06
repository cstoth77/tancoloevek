import { site } from "@/content/site";

/** Záró betűtábla-csík, egy alapvonalon. */
export function Footer() {
  return (
    <footer className="letterboard border-t-4 border-[#a39a8f] px-4 pb-28 pt-10 md:px-8 md:pb-10">
      <div className="mx-auto flex max-w-[1360px] flex-col gap-3 uppercase md:flex-row md:items-baseline md:justify-between md:gap-8">
        <p className="text-[clamp(1.8rem,5vw,3.2rem)] font-bold leading-[1.2] tracking-[0.1em]">Várlak szeretettel!</p>
        <a className="inline-flex min-h-11 items-center tracking-[0.06em] normal-case underline underline-offset-4" href={`mailto:${site.contact.email}`}>
          {site.contact.email}
        </a>
        <p className="text-sm tracking-[0.12em] text-letter-soft">Partnereink: {site.partners.join(" · ")}</p>
        <p className="text-sm tracking-[0.12em] text-letter-soft">
          © {new Date().getFullYear()} {site.teacher.name}
        </p>
      </div>
    </footer>
  );
}
