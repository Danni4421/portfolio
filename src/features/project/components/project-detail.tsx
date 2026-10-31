import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import { ProjectMeta } from "./project-meta";
import type { Project } from "../types";
import { ProjectSlug } from "../utils/slug";
import { cn } from "@/lib/utils";

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
              "absolute inset-0 flex flex-col justify-center pb-16 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
              {
                "pointer-events-auto translate-y-0 opacity-100": isActive,
                "pointer-events-none translate-y-4 opacity-0": !isActive,
              },
            )}
          >
            <h3 className="max-w-lg text-[clamp(1.75rem,2.4vw,2.5rem)] leading-[1.12] tracking-[-0.02em] text-[#111111]">
              {project.title}
            </h3>

            <ProjectMeta project={project} />

            <div className="mt-8">
              <Link
                to={`/projects/${ProjectSlug.generate(project.title)}`}
                tabIndex={isActive ? 0 : -1}
                className="inline-flex items-center gap-2 text-sm text-[#111111] underline decoration-neutral-300 underline-offset-4 transition-colors hover:decoration-neutral-900"
              >
                Read the story
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
