import { getProjects } from "@/actions/projects";
import ProjectCard from "./project-card";

export default async function Projects() {
  const projects = await getProjects();

  return (
    <div className="flex flex-col gap-4">
      {projects &&
        projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
    </div>
  );
}
