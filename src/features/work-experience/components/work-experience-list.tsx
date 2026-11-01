// ponytail: responsive orchestrator - pinned timeline on desktop, vertical list otherwise
import { useQuery } from "@tanstack/react-query";
import { Effect } from "effect";
import type { WorkExperience } from "../types";
import { getWorkExperiences } from "../api";
import { Skeleton } from "@/shared/ui/skeleton";
import FoldText from "@/shared/ui/fold-text";
import { useWorkExperienceView } from "../hooks/use-work-experience-view";
import { WorkExperienceStage } from "./work-experience-stage";
import { WorkExperienceVerticalList } from "./work-experience-vertical-list";

function ExperienceHeader() {
  return (
    <div className="grid grid-cols-1 gap-x-1 gap-y-4 md:grid-cols-2">
      <p className="text-lg tracking-[-0.64px] text-black md:sticky md:top-4 md:self-start">
        <FoldText text="Experience" />
      </p>
      <div>
        <p className="text-sm leading-relaxed text-gray-500">
          <FoldText text="Where I've worked and what I did there." splitBy="word" />
        </p>
      </div>
    </div>
  );
}

export function WorkExperienceList() {
  const { isDesktop, reducedMotion, activeIndex, setActiveIndex } =
    useWorkExperienceView();

  const { data, isLoading, isError } = useQuery<{
    experiences: WorkExperience[];
  }>({
    queryKey: ["workExperiences"],
    queryFn: () => Effect.runPromise(getWorkExperiences()),
  });

  const experiences = data?.experiences ?? [];

  if (isLoading) {
    return (
      <section
        id="experience"
        className="border-t border-gray-100 px-4 py-16 md:py-24"
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 md:mb-8">
            <ExperienceHeader />
          </div>
          <div className="space-y-0 divide-y divide-gray-100">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="py-6 first:pt-0 last:pb-0">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                  <div className="flex shrink-0 items-center gap-3 sm:w-48">
                    <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 sm:pl-4">
                    <Skeleton className="mb-2 h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError || experiences.length === 0) {
    return (
      <section
        id="experience"
        className="border-t border-gray-100 px-4 py-16 md:py-24"
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 md:mb-8">
            <ExperienceHeader />
          </div>
          <p className="text-sm text-gray-400">
            <FoldText
              text="There are no related work experiences for now."
              splitBy="word"
            />
          </p>
        </div>
      </section>
    );
  }

  const showStage = isDesktop && !reducedMotion;

  return (
    <section id="experience" className="border-t border-gray-100">
      <div className="mx-auto max-w-5xl px-4 pt-16 md:pt-24">
        <div className="mb-6 md:mb-8">
          <ExperienceHeader />
        </div>
      </div>

      {showStage ? (
        <WorkExperienceStage
          experiences={experiences}
          activeIndex={activeIndex}
          onActiveChange={setActiveIndex}
          enabled={showStage}
        />
      ) : (
        <div className="mx-auto max-w-5xl px-4 pb-16 md:pb-24">
          <WorkExperienceVerticalList experiences={experiences} />
        </div>
      )}
    </section>
  );
}
