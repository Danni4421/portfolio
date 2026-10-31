import type { RefObject } from "react";

interface UseProjectParallaxOptions {
  stageRef: RefObject<HTMLDivElement | null>;
  railRef: RefObject<HTMLDivElement | null>;
  enabled: boolean;
}

export function useProjectParallax({
  stageRef: _stageRef,
  railRef: _railRef,
  enabled: _enabled,
}: UseProjectParallaxOptions) {
  // Parallax zoom and duplicate ScrollTrigger removed to prevent blink and zoomed image rail issues.
}
