import { About } from "@/components/About";
import { ClassBlock } from "@/components/ClassBlock";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { MobileActionBar, Nav } from "@/components/Nav";
import { Venue } from "@/components/Venue";
import { site } from "@/content/site";
import { buildJsonLd } from "@/lib/jsonld";

/** Naponta újraépül, hogy a lejárt egyszeri időpontok eltűnjenek. */
export const revalidate = 86400;

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(new Date())).replace(/</g, "\\u003c") }}
      />
      <Nav />
      <main id="top">
        <Hero />
        <section id="orak" aria-labelledby="orak-title" className="pb-20 md:pb-32">
          <h2 id="orak-title" className="mx-auto max-w-[1360px] px-4 pb-12 pt-20 font-display text-[clamp(2.6rem,8vw,6.5rem)] font-bold uppercase leading-[1.1] md:px-8 md:pt-32">
            Órák
          </h2>
          <div className="grid gap-20 md:gap-32">
            {site.classes.map((c, i) => (
              <ClassBlock key={c.slug} cls={c} index={i} />
            ))}
          </div>
        </section>
        <About />
        <Venue />
        <ContactSection />
      </main>
      <Footer />
      <MobileActionBar />
    </>
  );
}
