import { useQuery } from "@tanstack/react-query";
import { Effect } from "effect";
import type { TechStack } from "../types";

const API_BASE = "/api/v1";

export const getTechStacks = (): Effect.Effect<{ stacks: Array<TechStack> }, Error> =>
  Effect.tryPromise({
    try: async () => {
      const res = await fetch(`${API_BASE}/tech-stacks`);
      if (!res.ok) throw new Error("Failed to fetch tech stacks");
      const json = await res.json();
      const stacks = (json.data ?? []) as TechStack[];
      return { stacks };
    },
    catch: (unknownError) => new Error(String(unknownError)),
  });

export function useGetTechStacks() {
  return useQuery<Array<TechStack>>({
    queryKey: ["techStacks"],
    queryFn: () =>
      Effect.runPromise(
        getTechStacks().pipe(
          Effect.map(({ stacks }) =>
            [...stacks].sort(
              (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
            ),
          ),
        ),
      ),
  });
}
