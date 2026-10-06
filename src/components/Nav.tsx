import { site } from "@/content/site";

const LINKS = [
  { href: "#orak", label: "Órák" },
  { href: "#rolam", label: "Rólam" },
  { href: "#helyszin", label: "Helyszín" },
  { href: "#kapcsolat", label: "Kapcsolat" },
];

/** Betűtábla-csík fejléc: filc háttér, ritkított nagybetűk. */
export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-letter/10 bg-felt-raised/95">
      <nav aria-label="Fő navigáció" className="mx-auto flex max-w-[1360px] items-center justify-between gap-6 px-4 py-2 md:px-8">
        <a href="#top" className="inline-flex min-h-11 items-center font-display text-sm font-semibold uppercase tracking-[0.18em]">
          {site.teacher.name}
        </a>
        <ul className="hidden gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a className="inline-flex min-h-11 items-center text-sm uppercase tracking-[0.22em] text-letter-soft hover:text-letter" href={l.href}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#kapcsolat" className="hidden min-h-11 items-center rounded-[3px] bg-clay px-5 font-semibold text-felt md:inline-flex">
          {site.hero.cta}
        </a>
      </nav>
    </header>
  );
}

/** Mobilon állandó alsó akciósáv, hüvelykujj-közelben. */
export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-letter/10 bg-felt-raised/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 md:hidden">
      <a href="#kapcsolat" className="flex min-h-12 w-full items-center justify-center rounded-[3px] bg-clay text-lg font-semibold text-felt">
        {site.hero.cta}
      </a>
    </div>
  );
}
