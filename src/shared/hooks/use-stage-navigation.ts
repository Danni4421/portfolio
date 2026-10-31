import { useEffect } from "react";
import type { RefObject } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface UseStageNavigationOptions {
  stageRef: RefObject<HTMLDivElement | null>;
  enabled: boolean;
}

export function useStageNavigation({
  stageRef,
  enabled,
}: UseStageNavigationOptions) {
  useEffect(() => {
    const stage = stageRef.current;

    if (!stage || !enabled) return;

    const trigger = ScrollTrigger.create({
      trigger: stage,
      start: "top top",
      end: "bottom bottom",
      invalidateOnRefresh: true,
    });

    ScrollTrigger.refresh();

    return () => {
      trigger.kill();
    };
  }, [stageRef, enabled]);
}
