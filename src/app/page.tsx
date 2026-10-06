import { About } from "@/components/About";
import { BoardHeading } from "@/components/BoardHeading";
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
        <section id="orak" aria-labelledby="orak-title" className="pb-12 md:pb-16">
          <div className="mx-auto max-w-[1360px] px-4 pb-12 pt-16 md:px-8 md:pt-24">
            <BoardHeading id="orak-title">Órák</BoardHeading>
          </div>
          <div className="mx-auto grid max-w-[1360px] gap-16 px-4 md:gap-24 md:px-8">
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
