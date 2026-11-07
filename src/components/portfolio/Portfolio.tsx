import About from "./About";
import Certifications from "./Certifications";
import Contact from "./Contact";
import Hero from "./Hero";
import Projects from "./Projects";
import Services from "./Services";

/** The page that lives on the viewer's monitor. */
export default function Portfolio({ onOpenCert }: { onOpenCert: (index: number) => void }) {
  return (
    <>
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <filter id="heat-haze">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.03" numOctaves="2" seed="7">
            <animate
              attributeName="baseFrequency"
              dur="9s"
              values="0.008 0.03;0.011 0.045;0.008 0.03"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="14" />
        </filter>
      </svg>
      <Hero />
      <About />
      <Services />
      <Projects />
      <Certifications onOpen={onOpenCert} />
      <Contact />
    </>
  );
}
