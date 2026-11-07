import { useCallback, useLayoutEffect, useRef, useState } from "react";
import Hud from "./components/Hud";
import LavaCanvas from "./components/LavaCanvas";
import Lightbox from "./components/Lightbox";
import Loader from "./components/Loader";
import PillNav from "./components/PillNav";
import Portfolio from "./components/portfolio/Portfolio";
import { ExperienceContext, ReadyContext } from "./engine/context";
import { Experience } from "./engine/experience";

/**
 * Layout of the stage, back to front:
 *   back canvas  — the room, city, desk and monitor
 *   screen       — the live portfolio, positioned inside the monitor
 *   front canvas — the viewer, glare and vignette
 *   HUD          — film slate and captions
 * The document itself only holds a tall spacer that provides the scroll range.
 */
function App() {
  const [experience] = useState(() => new Experience());
  const [ready, setReady] = useState(false);
  const [loaderGone, setLoaderGone] = useState(false);
  const [cert, setCert] = useState<number | null>(null);

  const backRef = useRef<HTMLCanvasElement>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const back = backRef.current;
    const front = frontRef.current;
    const screen = screenRef.current;
    const inner = innerRef.current;
    const content = contentRef.current;
    const spacer = spacerRef.current;
    if (!back || !front || !screen || !inner || !content || !spacer) return;
    experience.attach({ back, front, screen, inner, content, spacer });
    return () => experience.detach();
  }, [experience]);

  const handleReady = useCallback(() => {
    setReady(true);
    experience.start();
  }, [experience]);
  const handleFinished = useCallback(() => setLoaderGone(true), []);

  const closeCert = useCallback(() => setCert(null), []);

  return (
    <ExperienceContext.Provider value={experience}>
      <ReadyContext.Provider value={ready}>
        <a
          href="#about"
          className="skip-link"
          onClick={(event) => {
            event.preventDefault();
            experience.jumpTo("top");
            contentRef.current?.focus({ preventScroll: true });
          }}
        >
          Skip to portfolio
        </a>

        <div className="stage">
          <canvas ref={backRef} className="stage-canvas" aria-hidden="true" />
          <div ref={screenRef} className="screen">
            <div ref={innerRef} className="screen-inner">
              <LavaCanvas />
              <main ref={contentRef} id="main" tabIndex={-1} className="screen-content">
                <Portfolio onOpenCert={setCert} />
              </main>
              <PillNav />
            </div>
          </div>
          <canvas ref={frontRef} className="stage-canvas" aria-hidden="true" />
          <Hud />
        </div>

        <div className="grain" aria-hidden="true" />
        <div ref={spacerRef} className="spacer" aria-hidden="true" />

        {loaderGone ? null : <Loader onReady={handleReady} onFinished={handleFinished} />}
        <Lightbox index={cert} onClose={closeCert} onNavigate={setCert} />
      </ReadyContext.Provider>
    </ExperienceContext.Provider>
  );
}

export default App;
