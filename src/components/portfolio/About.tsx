import {
  competencies,
  education,
  offKeyboard,
  stackIconRows,
  summary,
} from "../../data/portfolio";
import { DotHeading } from "../DotScramble";

export default function About() {
  return (
    <section id="about" data-section="about" data-glow="255,84,46" className="section-pad">
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <DotHeading
          lines={[
            { text: "Crafting web", dim: true },
            { text: "experiences", dim: true },
            { text: "one commit" },
            { text: "at a time" },
          ]}
          className="text-[clamp(2.2rem,6.6vw,6.4rem)]"
        />
        <div className="max-w-sm space-y-6 lg:justify-self-end lg:pt-3">
          <p className="text-[15px] leading-relaxed text-ink/70">{summary}</p>
          <a href="#work" className="btn-light">
            View projects
          </a>
        </div>
      </div>

      <div className="meta-row mt-14">
        <div className="flex flex-wrap gap-2">
          <span className="chip">Web</span>
          <span className="chip">Mobile</span>
          <span className="chip">UI design</span>
          <span className="chip">More +</span>
        </div>
        <span className="label hidden md:inline">No shortcuts. Just clean code.</span>
        <span className="label">Education &amp; stack ↓</span>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-12">
        <article className="glass p-6 sm:p-8 lg:col-span-7">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-[clamp(22px,2.4vw,32px)] font-medium tracking-tight">
              Education
            </h3>
            <span className="label">NEUST · 2016 — 2026</span>
          </div>
          <ol className="mt-8 space-y-7">
            {education.map((item) => (
              <li
                key={`${item.program}-${item.period}`}
                className="grid gap-2 border-t border-white/10 pt-5 sm:grid-cols-[130px_1fr]"
              >
                <span className="font-mono text-[12px] tracking-wider text-ember">
                  {item.period}
                </span>
                <div>
                  <p className="text-[16px] text-ink">{item.program}</p>
                  <p className="mt-0.5 text-[13px] text-ink/55">{item.school}</p>
                  <ul className="mt-3 space-y-1.5 text-[13px] text-ink/70">
                    {item.details.map((detail) => (
                      <li key={detail} className="flex gap-2">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-molten" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </article>

        <article className="glass flex flex-col gap-8 p-6 sm:p-8 lg:col-span-5">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-[clamp(22px,2.4vw,32px)] font-medium tracking-tight">
                Tech stack
              </h3>
              <span className="label">18 tools</span>
            </div>
            <div className="mt-6 space-y-2.5">
              {stackIconRows.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={
                    [
                      "HTML, CSS, JavaScript, TypeScript, PHP, Python",
                      "Java, C++, Laravel, React, Angular, Tailwind CSS",
                      "Bootstrap, MySQL, Node.js, Git, GitHub, Adobe Audition",
                    ][i]
                  }
                  className="h-auto w-full max-w-[330px]"
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
          </div>
          <div>
            <p className="label">Core competencies</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {competencies.map((item) => (
                <li key={item} className="rounded-full border border-white/12 px-3 py-1.5 text-[12px] text-ink/80">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label">Off the keyboard</p>
            <ul className="mt-3 space-y-1.5 text-[13px] text-ink/70">
              {offKeyboard.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
}
