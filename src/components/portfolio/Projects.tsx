import { useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { projects, stackIconMap, type Project } from "../../data/portfolio";
import { DotHeading } from "../DotScramble";
import ProjectArt from "./ProjectArt";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const external = project.link.startsWith("http");
  return (
    <article data-card className="project-card w-[min(84vw,430px)] shrink-0 snap-start">
      <a
        href={project.link}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        download={project.download ? true : undefined}
        aria-label={`${project.title}: ${project.linkLabel}`}
        className="block"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] border border-white/10 bg-[#0d0b0b]">
          <ProjectArt kind={project.art} className="project-art absolute inset-0 h-full w-full" />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-5">
            <h3 className="text-[clamp(30px,3.4vw,44px)] font-medium leading-none tracking-tight text-white [text-shadow:0_2px_24px_rgba(0,0,0,.35)]">
              {project.title}
            </h3>
            <span className="label !text-white/75">{String(index + 1).padStart(2, "0")}</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/55 to-transparent p-5">
            <span className="label !text-white/85">{project.category}</span>
            <span className="label inline-flex items-center gap-1 !text-white">
              {project.linkLabel}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </a>
      <div className="mt-5 space-y-3 px-1">
        <p className="text-[15px] leading-snug text-ink">{project.subtitle}</p>
        <p className="text-[13.5px] leading-relaxed text-ink/60">{project.description}</p>
        {project.highlights.length > 0 ? (
          <ul className="space-y-1 text-[13px] text-ink/75">
            {project.highlights.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-ember">→</span>
                {item}
              </li>
            ))}
          </ul>
        ) : null}
        <ul className="flex flex-wrap gap-1.5 pt-1" aria-label="Built with">
          {project.stack.map((tag) => (
            <li
              key={tag}
              title={tag}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 text-[11px] text-ink/70"
            >
              {(stackIconMap[tag] ?? []).map((src) => (
                <img key={src} src={src} alt="" className="h-4 w-4 object-contain" loading="lazy" decoding="async" />
              ))}
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function Projects() {
  const trackRef = useRef<HTMLDivElement>(null);

  const step = (direction: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    track.scrollBy({ left: direction * ((card?.offsetWidth ?? 380) + 16), behavior: "smooth" });
  };

  return (
    <section
      id="work"
      data-section="work"
      data-cut="work"
      data-glow="255,110,58"
      className="section-pad !pr-0"
    >
      <div className="grid gap-8 pr-[var(--pad)] lg:grid-cols-[auto_1fr_minmax(0,21rem)] lg:items-start">
        <span className="label pt-2 lg:w-24">Portfolio</span>
        <DotHeading
          lines={[
            { text: "Explore", dim: true },
            { text: "my latest", dim: true },
            { text: "projects &" },
            { text: "case studies" },
          ]}
          className="text-[clamp(2.2rem,6vw,6rem)]"
        />
        <div className="space-y-4 text-[14px] leading-relaxed text-ink/70 lg:pt-3">
          <p>
            Selected work built for real needs — from a campus-wide ID system to
            a mobile budgeting app and a browser card game.
          </p>
         
        </div>
      </div>

      <div className="mt-12 flex items-center justify-between gap-6 pr-[var(--pad)]">
        <div className="flex gap-2">
          <button type="button" className="arrow-btn" aria-label="Previous project" onClick={() => step(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button type="button" className="arrow-btn" aria-label="Next project" onClick={() => step(1)}>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <span className="label">{String(projects.length).padStart(2, "0")} projects · swipe or use arrows</span>
      </div>

      <div
        ref={trackRef}
        className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-[var(--pad)] pb-2 pr-[var(--pad)]"
      >
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
