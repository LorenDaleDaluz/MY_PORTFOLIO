import { profile } from "../../data/portfolio";
import { DotScramble } from "../DotScramble";


/** The first thing on the viewer's monitor — and the first full-screen page. */
export default function Hero() {
  return (
    <section
      id="top"
      data-section="top"
      data-glow="255,58,34"
      className="relative"
      style={{ height: "var(--screen-h)" }}
    >
      {/* Spans the whole monitor surface, which can be wider than the page on phones. */}
      <div className="hero-backdrop hero-span absolute inset-y-0" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 top-[11%] flex justify-center">
        <img
          src="/myImage.png"
          alt={`Portrait of ${profile.name}`}
          className="hero-portrait h-full w-auto max-w-none object-contain object-bottom"
          decoding="async"
          fetchPriority="high"
        />
      </div>
      <div className="hero-fade hero-span absolute inset-y-0" aria-hidden="true" />
      <div
        className="hero-ring absolute left-1/2 top-[55%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-hidden="true"
      />

      <h1 className="absolute inset-x-0 top-[3.2%] px-3 text-center font-display font-black uppercase leading-none tracking-[0.04em] text-ink text-[clamp(1.9rem,7.6vw,8.4rem)]">
        <span className="sr-only">{profile.name}</span>
        <DotScramble text="LOREN DALE DALUZ" duration={1500} />
      </h1>

   

      
    </section>
  );
}
