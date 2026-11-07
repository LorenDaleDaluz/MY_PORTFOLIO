import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { certifications } from "../../data/portfolio";
import { useFrame } from "../../engine/context";
import { clamp } from "../../engine/math";
import { DotHeading } from "../DotScramble";

const COUNT = certifications.length;
const STEP = 360 / COUNT;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Kumo-style ring of frames. The section pins itself on the monitor while
 * scrolling turns the ring, one certificate at a time.
 */
export default function Certifications({ onOpen }: { onOpen: (index: number) => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const metaRef = useRef<HTMLSpanElement>(null);
  const front = useRef(-1);
  const radius = useRef(400);

  useEffect(() => {
    const measure = () => {
      const card = Math.min(340, Math.max(170, window.innerWidth * 0.25));
      radius.current = (card * 1.08 * COUNT) / (2 * Math.PI);
      ringRef.current?.style.setProperty("--cw", `${card}px`);
      ringRef.current?.style.setProperty("--r", `${radius.current}px`);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useFrame((f) => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const ring = ringRef.current;
    if (!section || !pin || !ring) return;
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const local = f.offset - top;
    if (local < -f.vh * 1.5 || local > height + f.vh * 0.5) return;

    const range = Math.max(1, height - f.vh);
    pin.style.transform = `translate3d(0px, ${clamp(local, 0, range).toFixed(1)}px, 0px)`;
    const angle = -clamp(local / range) * STEP * (COUNT - 1);
    ring.style.transform = `translateZ(${-radius.current}px) rotateX(-6deg) rotateY(${angle.toFixed(2)}deg)`;

    let best = 0;
    let bestCos = -2;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const c = Math.cos(((i * STEP + angle) * Math.PI) / 180);
      card.style.opacity = (0.2 + 0.8 * Math.pow((c + 1) / 2, 2.2)).toFixed(3);
      card.tabIndex = c > 0.2 ? 0 : -1;
      if (c > bestCos) {
        bestCos = c;
        best = i;
      }
    });
    if (best !== front.current) {
      front.current = best;
      const cert = certifications[best];
      if (counterRef.current) counterRef.current.textContent = `${pad(best + 1)} / ${pad(COUNT)}`;
      if (titleRef.current) titleRef.current.textContent = cert.title;
      if (metaRef.current) metaRef.current.textContent = `${cert.issuer} · ${cert.date}`;
    }
  });

  return (
    <section
      ref={sectionRef}
      id="certifications"
      data-section="certifications"
      data-glow="215,200,255"
      className="relative"
      style={{ height: "calc(var(--screen-h) * 2.6)" }}
    >
      <div ref={pinRef} className="clip relative flex flex-col" style={{ height: "var(--screen-h)" }}>
        <div className="section-x flex flex-wrap items-end justify-between gap-6 pt-[clamp(64px,11vh,120px)]">
          <DotHeading
            lines={[{ text: "Credentials", dim: true }, { text: "& training" }]}
            className="text-[clamp(2rem,5.4vw,5.2rem)]"
          />
          <p className="max-w-xs text-[14px] leading-relaxed text-ink/65">
            Nine certificates from conferences, webinars and exams — tap a frame
            to read it.
          </p>
        </div>

        <div className="cert-scene relative min-h-0 flex-1">
          <div ref={ringRef} className="cert-ring">
            {certifications.map((cert, i) => (
              <button
                key={cert.image}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                type="button"
                className="cert-card"
                style={{ transform: `rotateY(${i * STEP}deg) translateZ(var(--r))` }}
                onClick={() => onOpen(i)}
                aria-label={`View certificate: ${cert.title}`}
              >
                <img src={cert.image} alt="" loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        </div>

        <div className="section-x flex flex-wrap items-end justify-between gap-4 pb-[max(15vh,110px)]">
          <span className="label">Scroll to turn the ring</span>
          <button
            type="button"
            className="cert-current"
            onClick={() => onOpen(Math.max(0, front.current))}
          >
            <span ref={counterRef} className="label !text-ember">
              01 / {pad(COUNT)}
            </span>
            <span ref={titleRef} className="cert-title">
              {certifications[0].title}
            </span>
            <span className="label inline-flex items-center gap-1">
              <span ref={metaRef}>
                {certifications[0].issuer} · {certifications[0].date}
              </span>
              <span aria-hidden="true">·</span> View
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
