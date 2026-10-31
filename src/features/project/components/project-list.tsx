
import { useLocation } from "react-router-dom";

import { ProjectStage } from "./project-stage";
import { CompactProjectList } from "./compact-project-list";
import { ProjectListSkeleton } from "./project-list-skeleton";

import FoldText from "@/shared/ui/fold-text";
import { useProjectIndex } from "../hooks/use-project-index";
import { useGetProjects } from "../services/use-get-projects";

export function ProjectList() {
  const { pathname } = useLocation();

  const {
    data: projects,
    isLoading,
    isError,
  } = useGetProjects();

  const { reducedMotion } = useProjectIndex();

  if (isLoading) {
    return <ProjectListSkeleton />;
  }

  if (isError || !projects || projects.length === 0) {
    return (
      <section
        id="projects"
        className="scroll-mt-24 border-t border-gray-100 px-4 py-16 md:scroll-mt-20 md:py-24"
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 grid grid-cols-1 gap-x-1 gap-y-4 md:mb-8 md:grid-cols-2">
            <p className="text-lg tracking-[-0.64px] text-black">
              What have I been working on?
            </p>

            <p className="text-sm leading-relaxed text-gray-500">
              Projects I've created and built with care.
            </p>
          </div>

          <p className="text-sm text-gray-400">
            <FoldText
              text="There are no related projects for now."
              splitBy="word"
            />
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="projects"
      className="scroll-mt-24 border-t border-gray-100 py-16 md:scroll-mt-20 md:py-24"
    >
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-6 grid grid-cols-1 gap-x-1 gap-y-4 md:mb-8 md:grid-cols-2">
          <p className="text-lg tracking-[-0.64px] text-black">
            <FoldText text="What have I been working on?" />
          </p>

          <div>
            <p className="text-sm leading-relaxed text-gray-500">
              <FoldText
                text="Projects I've created and built with care."
                splitBy="word"
              />
            </p>

            {pathname !== "/projects" && (
              <a
                className="mt-4 inline-block text-sm text-gray-400 underline underline-offset-4 transition-colors hover:text-[#111111]"
                href="/projects"
              >
                View all
              </a>
            )}
          </div>
        </div>
      </div>

      <ProjectStage
        projects={projects}
        reducedMotion={reducedMotion}
      />

      <div className="mx-auto max-w-5xl px-4 lg:hidden">
        <CompactProjectList
          projects={projects}
          alwaysVisible={reducedMotion}
        />
      </div>
    </section>
  );
}
