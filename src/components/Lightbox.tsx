import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { certifications } from "../data/portfolio";

type LightboxProps = {
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export default function Lightbox({ index, onClose, onNavigate }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index !== null;
  const count = certifications.length;

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    document.documentElement.classList.add("is-modal");
    closeRef.current?.focus();
    return () => {
      document.documentElement.classList.remove("is-modal");
      previous?.focus?.({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowRight") onNavigate((index + 1) % count);
      else if (event.key === "ArrowLeft") onNavigate((index - 1 + count) % count);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, onClose, onNavigate, count]);

  if (index === null) return null;
  const cert = certifications[index];

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={cert.title}
      onClick={onClose}
    >
      <figure className="lightbox-figure" onClick={(event) => event.stopPropagation()}>
        <img src={cert.image} alt={`Certificate: ${cert.title}`} className="lightbox-img" />
        <figcaption className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label">
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")} ·{" "}
              {cert.issuer} · {cert.date}
            </p>
            <p className="mt-2 max-w-xl text-lg leading-snug text-ink">{cert.title}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="arrow-btn"
              aria-label="Previous certificate"
              onClick={() => onNavigate((index - 1 + count) % count)}
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="arrow-btn"
              aria-label="Next certificate"
              onClick={() => onNavigate((index + 1) % count)}
            >
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              ref={closeRef}
              type="button"
              className="arrow-btn"
              aria-label="Close"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </figcaption>
      </figure>
    </div>
  );
}
