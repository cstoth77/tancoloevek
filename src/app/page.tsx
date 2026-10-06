import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { MobileActionBar, Nav } from "@/components/Nav";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <section id="orak" />
        <section id="rolam" />
        <section id="helyszin" />
        <ContactSection />
      </main>
      <Footer />
      <MobileActionBar />
    </>
  );
}
