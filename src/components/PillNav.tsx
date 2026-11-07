import type { MouseEvent } from "react";
import { useActiveSection, useExperience } from "../engine/context";

const ITEMS = [
  { id: "services", label: "Services" },
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
];

/** The floating nav bar at the bottom of the (monitor's) screen. */
export default function PillNav() {
  const experience = useExperience();
  const active = useActiveSection();
  const go = (id: string) => (event: MouseEvent) => {
    event.preventDefault();
    experience.jumpTo(id);
  };

  return (
    <nav aria-label="Primary" className="pill-nav">
      <a
        href="#top"
        onClick={go("top")}
        className="pill-logo"
        aria-label="Loren Dale Daluz, back to top"
      >
        LD
      </a>
      {ITEMS.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          onClick={go(item.id)}
          className={`pill-link ${active === item.id ? "is-active" : ""}`}
          aria-current={active === item.id ? "true" : undefined}
        >
          {item.label}
        </a>
      ))}
      <a href="#contact" onClick={go("contact")} className="pill-cta">
        Contact Us
      </a>
    </nav>
  );
}
