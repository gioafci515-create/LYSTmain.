import { pageLocale } from "@/lib/page-meta";
import About from "@/app/components/About";
import Capabilities from "@/app/components/Capabilities";
import Consultation from "@/app/components/Consultation";
import DynamicIsland from "@/app/components/DynamicIsland";
import Experience from "@/app/components/Experience";
import Footer from "@/app/components/Footer";
import Hero from "@/app/components/Hero";

export default async function Home({ params }: PageProps<"/[locale]">) {
  await pageLocale(params);
  return (
    <main>
      <DynamicIsland />
      <Hero />
      <About />
      <Capabilities />
      <Experience />
      <Consultation />
      <Footer />
    </main>
  );
}
