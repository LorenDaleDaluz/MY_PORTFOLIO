import { ArrowUpRight } from "lucide-react";
import { contactItems, links, profile, socials } from "../../data/portfolio";
import { useExperience } from "../../engine/context";
import { DotHeading } from "../DotScramble";

const YEAR = new Date().getFullYear();

export default function Contact() {
  const experience = useExperience();

  return (
    <section
      id="contact"
      data-section="contact"
      data-cut="contact"
      data-glow="255,58,36"
      className="section-pad"
    >
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <DotHeading
          lines={[
            { text: "Let's build", dim: true },
            { text: "something", dim: true },
            { text: "reliable" },
            { text: "together." },
          ]}
          className="text-[clamp(2.2rem,6.6vw,6.4rem)]"
        />
        <div className="max-w-sm space-y-6 lg:justify-self-end lg:pt-3">
          <p className="text-[15px] leading-relaxed text-ink/70">
            Open to web development roles, freelance work, and collaborative
            projects focused on modern web experiences.
          </p>
          <a className="btn-light" href={links.email} target="_blank" rel="noreferrer">
            Start a conversation <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      <a
        href={links.email}
        target="_blank"
        rel="noreferrer"
        className="contact-mail mt-16 block border-y border-white/10 py-8 font-medium tracking-tight text-[clamp(22px,5.2vw,80px)] leading-none"
      >
        {profile.email}
      </a>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {contactItems.map((item) => {
          const Icon = item.icon;
          const body = (
            <>
              <span className="label inline-flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 text-ember" />
                {item.label}
              </span>
              <span className="mt-3 block text-[15px] text-ink">{item.value}</span>
            </>
          );
          return item.href ? (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noreferrer" : undefined}
              className="glass block p-5 transition hover:border-white/20"
            >
              {body}
            </a>
          ) : (
            <div key={item.label} className="glass p-5">
              {body}
            </div>
          );
        })}
      </div>

      <ul className="mt-6 flex flex-wrap gap-2">
        {socials.map((social) => {
          const Icon = social.icon;
          return (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-white/12 px-4 text-[12px] text-ink/85 transition hover:border-white/30 hover:bg-white/5"
              >
                <Icon className="h-4 w-4" />
                {social.label}
              </a>
            </li>
          );
        })}
      </ul>

      <footer className="mt-24 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <span className="label">
          © {YEAR} {profile.fullName}
        </span>
        <span className="label">Built with React, Vite &amp; Tailwind CSS</span>
        <a
          href="#start"
          className="label transition hover:!text-ink"
          onClick={(event) => {
            event.preventDefault();
            experience.jumpTo("start");
          }}
        >
          Back to the start ↑
        </a>
      </footer>
    </section>
  );
}
