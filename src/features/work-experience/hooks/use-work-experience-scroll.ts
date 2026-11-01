// ponytail: pin the experience stage and translate the track horizontally on desktop
import { useLayoutEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface UseWorkExperienceScrollOptions {
  stageRef: RefObject<HTMLDivElement | null>;
  trackRef: RefObject<HTMLDivElement | null>;
  count: number;
  enabled: boolean;
  onActiveChange: (index: number) => void;
}

export function useWorkExperienceScroll({
  stageRef,
  trackRef,
  count,
  enabled,
  onActiveChange,
}: UseWorkExperienceScrollOptions) {
  const callbackRef = useRef(onActiveChange);

  useLayoutEffect(() => {
    callbackRef.current = onActiveChange;
  }, [onActiveChange]);

  useLayoutEffect(() => {
    if (typeof window === "undefined" || !enabled) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const stage = stageRef.current;
      const track = trackRef.current;
      if (!stage || !track || count <= 0) return;

      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      if (distance() <= 0) return;

      let lastIndex = 0;

      const ctx = gsap.context(() => {
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const index = Math.min(
                count - 1,
                Math.max(0, Math.round(self.progress * (count - 1))),
              );

              if (index !== lastIndex) {
                lastIndex = index;
                callbackRef.current(index);
              }

              stage.style.setProperty(
                "--timeline-progress",
                String(self.progress),
              );
            },
            onRefresh: (self) => {
              const index = Math.min(
                count - 1,
                Math.max(0, Math.round(self.progress * (count - 1))),
              );
              lastIndex = index;
              callbackRef.current(index);
              stage.style.setProperty(
                "--timeline-progress",
                String(self.progress),
              );
            },
          },
        });
      }, stage);

      // Sections above may mount (and add their pin spacers) after this one.
      // Re-sort before refreshing so our start/end include those spacers.
      const refresh = () => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      };

      let frame = requestAnimationFrame(() => {
        frame = 0;
        refresh();
      });

      const body = document.body;
      let lastHeight = body.scrollHeight;
      const observer = new ResizeObserver(() => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          const height = body.scrollHeight;
          if (height === lastHeight) return;
          lastHeight = height;
          refresh();
        });
      });
      observer.observe(body);

      return () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        ctx.revert();
        track.style.transform = "";
        stage.style.removeProperty("--timeline-progress");
      };
    });

    return () => mm.revert();
  }, [stageRef, trackRef, count, enabled]);
}
