import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { Effect } from "effect";
import type { Project } from "../types";

export interface ProjectData {
  project: Project | null;
  markdown: string;
}

export const getProjectBySlug = (
  slug: string,
): Effect.Effect<{ project: Project | null }, Error> =>
  Effect.tryPromise({
    try: async () => {
      const res = await fetch(
        `/api/v1/projects/slug/${encodeURIComponent(slug)}`,
      );
      if (!res.ok) throw new Error(`Failed to fetch project: ${res.status}`);
      const json = await res.json();
      const project = json.data as Project | undefined;
      if (!project) return { project: null };
      return { project: { ...project, slug } };
    },
    catch: (unknownError) => new Error(String(unknownError)),
  });

export interface UseGetProjectDetailProps extends Omit<
  UseQueryOptions<ProjectData>,
  "queryKey" | "queryFn"
  > {
  slug: string
}

export const useGetProjectDetail = ({
  slug,
  ...options
}: UseGetProjectDetailProps) => {
  return useQuery<ProjectData>({
    queryKey: ["project", slug],
    queryFn: () =>
      Effect.runPromise(
        Effect.gen(function* () {
          const { project: fetchedProject } = yield* getProjectBySlug(slug!);

          let markdown = "";
          if (
            fetchedProject &&
            fetchedProject.stories &&
            fetchedProject.stories.length > 0
          ) {
            // Concatenate all stories content
            markdown = fetchedProject.stories
              .map((s) => s.content)
              .join("\n\n");
          }

          return { project: fetchedProject, markdown };
        }),
      ),
    enabled: !!slug,
    ...options
  });
};
