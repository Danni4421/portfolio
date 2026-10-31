import { useCallback, useRef, useState } from "react";
import type { Project } from "../types";
import { useProjectScroll } from "../hooks/use-project-scroll";
import { useProjectParallax } from "../hooks/use-project-parallax";
import { ProjectRail } from "./project-rail";
import { ProjectDetail } from "./project-detail";

interface ProjectStageProps {
  projects: Project[];
  reducedMotion: boolean;
}

export function ProjectStage({
  projects,
  reducedMotion,
}: ProjectStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const enabled = !reducedMotion;

  const handleActiveChange = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  useProjectScroll({
    stageRef,
    railRef,
    projectCount: projects.length,
    enabled,
    onActiveChange: handleActiveChange,
  });

  useProjectParallax({
    stageRef,
    railRef,
    enabled,
  });

  if (!enabled || projects.length === 0) {
    return null;
  }

  return (

    <div
      ref={stageRef}
      className="relative mt-10 hidden w-full lg:block"
    >
      <div className="flex h-screen w-full items-center overflow-hidden">
        <div className="relative grid h-full w-full grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] items-start gap-12 px-6 lg:gap-20 lg:px-12 xl:px-20">
          <div className="relative h-full overflow-hidden [--work-card-h:clamp(360px,62vh,820px)]">
            <ProjectRail
              projects={projects}
              railRef={railRef}
            />
          </div>

          <ProjectDetail
            projects={projects}
            activeIndex={activeIndex}
          />
        </div>
      </div>
    </div>

  );
}
