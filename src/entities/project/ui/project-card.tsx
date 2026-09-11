import { ArrowRight, ExternalLink, Github } from "lucide-react";
import type { Project, ProjectResource } from "../model/types";
import { Button } from "@/shared/ui/button";
import { useCallback, useMemo } from "react";

function ProjectLink({
  url,
  icon: Icon,
  children,
}: {
  url: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  const handleOnClick = useCallback(() => {
    window.open(url, "_blank");
  }, [url]);

  return (
    <Button
      className="bg-black rounded-full"
      size="sm"
      onClick={handleOnClick}
      asChild
    >
      {children}
      <Icon className="ml-2" size={16} />
    </Button>
  );
}

function ProjectRepository({
  url,
  children,
}: {
  url: string;
  children: React.ReactNode;
}) {
  const handleOnClick = useCallback(() => {
    window.open(url, "_blank");
  }, [url]);

  return (
    <Button className="bg-black rounded-full" onClick={handleOnClick} size="sm">
      <Github />
      {children}
    </Button>
  );
}

export function ProjectCard({ project }: { project: Project; index: number }) {
  const hasStory = project.stories && project.stories.length > 0;

  const repositories: Array<ProjectResource> = useMemo(() => {
    return project.resources?.filter((r) => r.type === "repository");
  }, [project.resources]);

  const liveUrls: Array<ProjectResource> = useMemo(() => {
    return project.resources?.filter((r) => r.type === "live_demo");
  }, [project.resources]);

  return (
    <div className="group relative flex flex-col h-full gap-4 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/40 p-4 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
      {/* Project Image */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
        <img
          src={project.thumbnail_url ?? "https://via.placeholder.com/800x600"}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Overlay Badge */}
        <div className="absolute top-3 right-3 flex flex-wrap justify-end gap-1.5">
          {project.tech_stacks.slice(0, 3).map((tech) => (
            <span
              key={tech.id}
              className="rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-semibold text-neutral-900 backdrop-blur shadow-sm dark:bg-black/90 dark:text-neutral-100"
            >
              {tech.name}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2">
          <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 line-clamp-3">
            {project.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 pt-2 border-neutral-150 dark:border-neutral-800/60">
          {hasStory && (
            <ProjectLink url={`/projects/${project.slug}`} icon={ArrowRight}>
              Read Story
            </ProjectLink>
          )}

          {repositories.map((repo) => {
            return (
              <ProjectRepository url={repo.resource_url}>
                {repo.title}
              </ProjectRepository>
            );
          })}

          {liveUrls.map((liveUrl) => {
            return (
              <ProjectLink url={liveUrl.resource_url} icon={ExternalLink}>
                {liveUrl.title}
              </ProjectLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}
