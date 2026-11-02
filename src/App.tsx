import { useState } from "react";
import { navItems } from "./data/content";
import { useActiveSection } from "./hooks/useActiveSection";
import { useGlassPointer } from "./hooks/useGlassPointer";
import { useReducedMotion } from "framer-motion";
import GlassFilters from "./components/ui/GlassFilters";
import Atmosphere from "./components/Atmosphere";
import Cursor from "./components/Cursor";
import Preloader from "./components/Preloader";
import Navbar from "./components/Navbar";
import ScrollProgress from "./components/ScrollProgress";
import BackToTop from "./components/BackToTop";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Education from "./sections/Education";
import Skills from "./sections/Skills";
import Achievements from "./sections/Achievements";
import Contact from "./sections/Contact";

const ids = navItems.map((n) => n.id);

function introSeen() {
  try {
    return sessionStorage.getItem("intro-seen") === "1";
  } catch {
    return false;
  }
}

export default function App() {
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  const active = useActiveSection(ids);
  useGlassPointer();

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <GlassFilters />
      <Atmosphere />
      <div className="grain" aria-hidden="true" />
      <ScrollProgress />
      <Cursor />
      <Preloader skip={Boolean(reduce) || introSeen()} onDone={() => setReady(true)} />
      <Navbar active={active} />

      <main id="main" className="relative">
        <Hero ready={ready} />
        <About />
        <Experience />
        <Projects />
        <Education />
        <Skills />
        <Achievements />
        <Contact />
      </main>

      <BackToTop />
    </>
  );
}
