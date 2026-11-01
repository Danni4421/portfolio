// ponytail: pinned desktop stage that scrolls the experience timeline horizontally
import { useLayoutEffect, useRef, useState } from "react";
import type { WorkExperience } from "../types";
import { useWorkExperienceScroll } from "../hooks/use-work-experience-scroll";
import { WorkExperiencePanel } from "./work-experience-panel";
import { WorkExperienceWave } from "./work-experience-wave";

interface WorkExperienceStageProps {
  experiences: WorkExperience[];
  activeIndex: number;
  onActiveChange: (index: number) => void;
  enabled: boolean;
}

export function WorkExperienceStage({
  experiences,
  activeIndex,
  onActiveChange,
  enabled,
}: WorkExperienceStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<{ width: number; starts: number[] }>({
    width: 0,
    starts: [],
  });

  useWorkExperienceScroll({
    stageRef,
    trackRef,
    count: experiences.length,
    enabled,
    onActiveChange,
  });

  useLayoutEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    const measure = () => {
      const panels = Array.from(
        inner.querySelectorAll<HTMLElement>("[data-timeline-panel]"),
      );

      setLayout({
        width: inner.offsetWidth,
        starts: panels.map((panel) => panel.offsetLeft),
      });
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(inner);

    return () => observer.disconnect();
  }, [experiences.length]);

  return (
    <div
      ref={stageRef}
      className="relative hidden h-screen overflow-hidden lg:block"
    >
      <div
        ref={trackRef}
        className="flex h-full w-max items-center gap-16 pt-16 px-[max(2rem,calc((100vw-64rem)/2))] will-change-transform"
      >
        <div
          ref={innerRef}
          className="relative flex h-full items-center gap-16"
        >
          <WorkExperienceWave width={layout.width} starts={layout.starts} />

          {experiences.map((experience, index) => (
            <WorkExperiencePanel
              key={experience.id}
              experience={experience}
              index={index}
              total={experiences.length}
              isActive={index === activeIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
