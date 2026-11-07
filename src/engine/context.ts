import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import type { Experience, FrameInfo } from "./experience";

export const ExperienceContext = createContext<Experience | null>(null);

/** Flips to true once the loader has finished. */
export const ReadyContext = createContext(false);

export function useExperience(): Experience {
  const experience = useContext(ExperienceContext);
  if (!experience) throw new Error("useExperience must be used inside <App>");
  return experience;
}

export const useReady = () => useContext(ReadyContext);

/** Runs `callback` on every frame the film changes, without re-rendering React. */
export function useFrame(callback: (frame: FrameInfo) => void) {
  const experience = useExperience();
  const ref = useRef(callback);
  useLayoutEffect(() => {
    ref.current = callback;
  });
  useEffect(
    () => experience.subscribe((frame) => ref.current(frame)),
    [experience],
  );
}

export function useActiveSection() {
  const experience = useExperience();
  return useSyncExternalStore(
    experience.subscribeSection,
    experience.getActiveSection,
  );
}
