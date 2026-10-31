import { useLayoutEffect, useRef } from "react";
import type { RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface UseProjectScrollOptions {
  stageRef: RefObject<HTMLDivElement | null>;
  railRef: RefObject<HTMLDivElement | null>;
  projectCount: number;
  enabled: boolean;
  onActiveChange: (index: number) => void;
}

export function useProjectScroll({
  stageRef,
  railRef,
  projectCount,
  enabled,
  onActiveChange,
}: UseProjectScrollOptions) {
  const callbackRef = useRef(onActiveChange);

  useLayoutEffect(() => {
    callbackRef.current = onActiveChange;
  }, [onActiveChange]);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    if (!window.matchMedia("(min-width: 1024px)").matches) {
      return;
    }

    const stage = stageRef.current;
    const rail = railRef.current;

    if (!stage || !rail || !enabled || projectCount <= 0) {
      return;
    }

    const cards = gsap.utils.toArray<HTMLElement>("[data-project-card]", rail);
    if (!cards.length) return;

    const lastIndex = cards.length - 1;
    if (lastIndex <= 0) return;

    const measureStep = () => {
      const firstCard = cards[0];
      if (!firstCard || !rail) return 0;
      const gap = parseFloat(getComputedStyle(rail).rowGap || "20") || 20;
      return firstCard.offsetHeight + gap;
    };

    // Pre-set initial card states synchronously to eliminate entrance blink
    cards.forEach((card, i) => {
      const dist = Math.abs(i - 0);
      gsap.set(card, {
        scale: 1 - Math.min(dist * 0.04, 0.08),
        opacity: 1 - Math.min(dist * 0.15, 0.3),
      });
    });

    let currentActiveIndex = 0;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => `+=${lastIndex * window.innerHeight}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 0,
          invalidateOnRefresh: true,
          scrub: 0.5,
          snap: {
            snapTo: (value: number) => Math.round(value * lastIndex) / lastIndex,
            duration: { min: 0.2, max: 0.45 },
            delay: 0.08,
            ease: "power2.out",
          },
          onUpdate: (self) => {
            const exactProgress = self.progress * lastIndex;
            const progressIndex = Math.min(
              lastIndex,
              Math.max(0, Math.round(exactProgress)),
            );

            if (progressIndex !== currentActiveIndex) {
              currentActiveIndex = progressIndex;
              callbackRef.current(currentActiveIndex);
            }

            cards.forEach((card, i) => {
              const dist = Math.abs(i - exactProgress);
              gsap.set(card, {
                scale: 1 - Math.min(dist * 0.04, 0.08),
                opacity: 1 - Math.min(dist * 0.15, 0.3),
                overwrite: "auto",
              });
            });
          },
        },
      });

      tl.to(rail, {
        y: () => -lastIndex * measureStep(),
        ease: "none",
      });
    }, stage);

    return () => {
      ctx.revert();
      rail.style.transform = "";
      cards.forEach((card) => {
        card.style.transform = "";
        card.style.opacity = "";
      });
    };
  }, [stageRef, railRef, projectCount, enabled]);
}
