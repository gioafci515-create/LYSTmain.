import About from "./components/About";
import Capabilities from "./components/Capabilities";
import Consultation from "./components/Consultation";
import DynamicIsland from "./components/DynamicIsland";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import Hero from "./components/Hero";

export default function Home() {
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
