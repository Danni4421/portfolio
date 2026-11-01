// ponytail: viewport + motion preferences for the responsive experience timeline
import { useState } from "react";
import {
  useMediaQuery,
  usePrefersReducedMotion,
} from "@/shared/lib/use-media-query";

export function useWorkExperienceView() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  return { isDesktop, reducedMotion, activeIndex, setActiveIndex };
}
