import { Link } from "react-router-dom";

import { ProjectMeta } from "./project-meta";
import type { Project } from "../types";
import { ProjectSlug } from "../utils/slug";
import { cn } from "@/lib/utils";
import { Blobatar } from "@blobatar/react";
import { happy } from "blobatar/expression";
import "blobatar/motion.css";
import FoldText from "@/shared/ui/fold-text";

interface ProjectDetailProps {
  projects: Array<Project>;
  activeIndex: number;
}

export function ProjectDetail({ projects, activeIndex }: ProjectDetailProps) {
  return (
    <div className="relative isolate h-full">
      {projects.map((project, index) => {
        const isActive = activeIndex === index;

        return (
          <div
            key={project.id}
            aria-hidden={!isActive}
            className={cn(
              "absolute inset-0 flex flex-col justify-center pb-16 transition-[opacity,transform,filter] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
              {
                "pointer-events-auto translate-y-0 opacity-100 blur-none": isActive,
                "pointer-events-none translate-y-4 opacity-0 blur-sm": !isActive,
              },
            )}
          >
            <h3 className="max-w-lg text-[clamp(1.75rem,2.4vw,2.5rem)] leading-[1.12] tracking-[-0.02em] text-[#111111]">
              <FoldText
                key={isActive ? `${project.id}-active` : project.id}
                text={project.title}
                splitBy="word"
                trigger="scroll"
              />
            </h3>

            <ProjectMeta project={project} />

            <div className="mt-8">
              <Link
                to={`/projects/${ProjectSlug.generate(project.title)}`}
                tabIndex={isActive ? 0 : -1}
                className="inline-flex w-fit items-center gap-2 rounded-full border border-neutral-200 bg-white py-1.5 pl-4 pr-1.5 text-sm text-[#111111] transition-all duration-300 hover:border-neutral-300/95"
              >
                <span className="whitespace-nowrap">Read the story</span>
                <Blobatar
                  name={project.title}
                  expression={happy}
                  animate="hover"
                  className="w-8 h-8 shrink-0"
                />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
