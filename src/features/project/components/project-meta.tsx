import type { TechStack } from "@/features/tech-stack/types";
import type { Project } from "../types";

interface ProjectMetaProps {
  project: Project;
}

export function ProjectMeta({ project }: ProjectMetaProps) {
  const stacks = project.tech_stacks ?? [];

  return (
    <>
      {project.description && (
        <p className="mt-5 max-w-md text-base leading-relaxed text-gray-500">
          {project.description}
        </p>
      )}

      {stacks.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2">
          {stacks.slice(0, 4).map((tech: TechStack) => (
            <li
              key={tech.id}
              className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-500"
            >
              {tech.name}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
