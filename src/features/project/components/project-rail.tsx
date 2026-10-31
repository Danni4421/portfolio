import { Link } from "react-router-dom";
import type { Project } from "../types";
import { ProjectSlug } from "../utils/slug";
import { ProjectThumbnail } from "../utils/thumbnail";

interface ProjectRailProps {
  projects: Array<Project>;
  railRef: React.RefObject<HTMLDivElement | null>;
}

export function ProjectRail({
  projects,
  railRef,
}: ProjectRailProps) {
  return (
    <div className="relative h-full overflow-hidden [--work-card-h:clamp(360px, 60vh,820px)]">
      <div
        ref={railRef}
        className="flex flex-col gap-5 will-change-transform"
        style={{
          paddingTop: "calc((100vh - var(--work-card-h)) / 2)",
          paddingBottom: "calc((100vh - var(--work-card-h)) / 2)",
        }}
      >
        {projects.map((project, index) => (
          <Link
            key={project.id}
            to={`/projects/${ProjectSlug.generate(project.title)}`}
            data-project-card
            style={{ transformOrigin: "center center" }}
            className="relative block h-(--work-card-h) w-full shrink-0 overflow-hidden rounded-[2.5rem] bg-neutral-100 will-change-transform"
          >
            <img
              data-work-image
              src={ProjectThumbnail.get(project)}
              alt={project.title}
              loading={index < 2 ? "eager" : "lazy"}
              className="absolute inset-0 h-full w-full object-cover will-change-transform"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
