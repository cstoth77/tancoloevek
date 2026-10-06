import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-letter/10 px-4 pb-28 pt-12 text-letter-soft md:px-8 md:pb-12">
      <div className="mx-auto flex max-w-[1360px] flex-col gap-4 md:flex-row md:justify-between">
        <p>
          © {new Date().getFullYear()} {site.teacher.name}
        </p>
        <p>Partnereink: {site.partners.join(" · ")}</p>
        <a className="inline-flex min-h-11 items-center underline underline-offset-4" href={`mailto:${site.contact.email}`}>
          {site.contact.email}
        </a>
      </div>
    </footer>
  );
}
