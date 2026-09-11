import { useQuery } from "@tanstack/react-query";
import { Effect } from "effect";
import { getTechStacks } from "@/entities/tech-stack/api/tech-stack";
import type { TechStack } from "@/entities/tech-stack/model/types";

export function TechStackList() {
  const { data: techStacks, isLoading: loading } = useQuery<Array<TechStack>>({
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

  if (loading) return null;
  if (!techStacks || techStacks.length === 0) return null;

  const stacks = [...techStacks, ...techStacks];

  return (
    <section className="py-16 md:py-24 border-t border-gray-100 overflow-hidden">
      <div className="marquee-mask overflow-hidden">
        <div className="animate-marquee flex w-max items-center">
          {stacks.map((tech, i) => (
            <img
              key={i}
              alt={tech.name}
              src={tech.image_logo}
              className="h-12 md:h-20 w-auto object-contain shrink-0 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all mr-5"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
