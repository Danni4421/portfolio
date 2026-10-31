import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import { ProjectMeta } from "./project-meta";
import type { Project } from "../types";
import { ProjectSlug } from "../utils/slug";
import { ProjectThumbnail } from "../utils/thumbnail";
import { cn } from "@/lib/utils";

interface CompactProjectListProps {
  projects: Array<Project>;
  alwaysVisible?: boolean;
}

export function CompactProjectList({
  projects,
  alwaysVisible = false,
}: CompactProjectListProps) {
  return (
    <div
      className={cn("mt-10 flex flex-col gap-14", {
        "lg:hidden": alwaysVisible,
      })}
    >
      {projects.map((project) => (
        <Link
          key={project.id}
          to={`/projects/${ProjectSlug.generate(project.title)}`}
          data-project-card-mobile
          className="block"
        >
          <div className="relative aspect-7/5 w-full overflow-hidden rounded-[1.75rem] bg-neutral-100">
            <img
              data-work-image
              src={ProjectThumbnail.get(project)}
              alt={project.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="mt-5">
            <h3 className="text-xl leading-[1.2] tracking-[-0.02em] text-[#111111]">
              {project.title}
            </h3>

            <ProjectMeta project={project} />

            <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-[#111111] underline decoration-neutral-300 underline-offset-4">
              Read the story
              <ArrowUpRight size={14} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
