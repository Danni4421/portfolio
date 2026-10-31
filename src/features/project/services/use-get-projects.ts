import { useQuery } from "@tanstack/react-query";
import { Effect } from "effect";

import { ProjectSlug } from "../utils/slug";
import type { Project } from "../types";

export const getRecentProjects = (): Effect.Effect<{ projects: Array<Project> }, Error> =>
  Effect.tryPromise({
    try: async () => {
      const res = await fetch('api/v1/projects')
      if (!res.ok) throw new Error("Failed to fetch projects")
      const json = await res.json()
      const projects = (json.data ?? []) as Array<Project>
      const projectsWithSlugs = projects.map(p => ({
        ...p,
        slug: p.slug || ProjectSlug.generate(p.title)
      }))
      const sorted = [...projectsWithSlugs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      return { projects: sorted }
    },
    catch: (unknownError) => new Error(String(unknownError))
  })

export function useGetProjects() {
  return useQuery<Array<Project>>({
    queryKey: ["recent-projects"],
    queryFn: () =>
      Effect.runPromise(
        getRecentProjects().pipe(
          Effect.map(
            ({ projects }: { projects: Array<Project> }) => projects,
          ),
        ),
      ),
  });
}
