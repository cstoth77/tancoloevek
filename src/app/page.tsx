import { Footer } from "@/components/Footer";
import { MobileActionBar, Nav } from "@/components/Nav";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <section id="orak" />
        <section id="rolam" />
        <section id="helyszin" />
        <section id="kapcsolat" />
      </main>
      <Footer />
      <MobileActionBar />
    </>
  );
}
