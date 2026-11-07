import { useState } from "react";
import { features, services } from "../../data/portfolio";
import { DotHeading } from "../DotScramble";

const STATS = [
  {
    title: "Track record",
    rows: [
      ["IDentify users", "12,000+"],
      ["Campuses served", "2"],
    ],
  },
  {
    title: "At a glance",
    rows: [
      ["Projects shipped", "4"],
      ["Certificates", "9"],
    ],
  },
];

export default function Services() {
  const [active, setActive] = useState(0);
  const service = services[active];

  return (
    <section id="services" data-section="services" data-glow="255,70,52" className="section-pad">
      <DotHeading
        lines={[{ text: "Complex systems", dim: true }, { text: "made simple" }]}
        className="text-[clamp(2.2rem,6.6vw,6.4rem)]"
      />

      <div className="mt-12 grid gap-10 border-t border-white/10 pt-8 lg:grid-cols-[1.2fr_1fr]">
        <p className="max-w-xl text-[clamp(16px,1.45vw,20px)] leading-relaxed text-ink/80">
          I provide a full range of development services — from responsive web
          systems and hybrid mobile apps to clean, considered UI — built to be
          fast, accessible, and easy to maintain.
        </p>
        <dl className="grid grid-cols-[110px_1fr] gap-x-4 gap-y-8 text-[13px]">
          <dt className="label pt-0.5">Features</dt>
          <dd>
            <ul className="space-y-1 text-ink/85">
              {features.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </dd>
          <dt className="label pt-0.5">Optimization</dt>
          <dd className="leading-relaxed text-ink/70">
            Responsive by default, tuned for performance, and documented —
            use-case, DFD and ERD — so the next developer can pick it up.
          </dd>
        </dl>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-12">
        <article className="glass relative overflow-hidden p-6 sm:p-8 lg:col-span-7">
          <div role="tablist" aria-label="Services" className="flex flex-wrap gap-2">
            {services.map((item, i) => (
              <button
                key={item.title}
                type="button"
                role="tab"
                id={`service-tab-${i}`}
                aria-selected={i === active}
                aria-controls="service-panel"
                onClick={() => setActive(i)}
                className={`service-tab ${i === active ? "is-active" : ""}`}
              >
                {item.title}
              </button>
            ))}
          </div>
          <div
            id="service-panel"
            role="tabpanel"
            aria-labelledby={`service-tab-${active}`}
            className="mt-10 grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end"
          >
            <div key={service.title} className="service-panel">
              <h3 className="text-[clamp(28px,3.2vw,44px)] font-medium leading-tight tracking-tight">
                {service.title}
              </h3>
              <p className="mt-3 max-w-md text-[14px] leading-relaxed text-ink/70">
                {service.description}
              </p>
              <ul className="mt-6 space-y-2 text-[13px] text-ink/85">
                {service.points.map((point) => (
                  <li key={point} className="flex items-center gap-3">
                    <span className="h-px w-5 bg-ember" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <a href="#contact" className="start-ring">
              Start a project
            </a>
          </div>
        </article>

        <div className="grid gap-4 lg:col-span-5">
          {STATS.map((card) => (
            <article key={card.title} className="glass p-6 sm:p-8">
              <h3 className="text-[clamp(22px,2.2vw,30px)] font-medium tracking-tight">
                {card.title}
              </h3>
              <dl className="mt-6 space-y-3 text-[13px]">
                {card.rows.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-baseline justify-between border-t border-white/10 pt-3"
                  >
                    <dt className="text-ink/55">{label}</dt>
                    <dd className="text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
